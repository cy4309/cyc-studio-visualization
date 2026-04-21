import { NextRequest, NextResponse } from "next/server";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";

const MAX_ATTEMPTS = 3; // 首次 + 最多 retry 2 次
const RETRY_DELAYS_MS = [400, 800] as const;

type PingResult =
  | { ok: true; rows: { id: unknown }[] }
  | { ok: false; error: PostgrestError };

/**
 * Supabase 保活（Vercel Cron → 此 route）
 *
 * 【Cron 頻率】建議 vercel.json 設為「每天至少一次」（例如 UTC 0:00：`0 0 * * *`）。
 * Supabase 免費專案若長期無實際 DB 活動會被標為 inactive；僅依賴 metadata / head-only
 * 請求可能不足以維持活躍。每日觸發 + 實際讀取列資料，較能穩定被視為有使用專案。
 */
/** 與官網聯絡表單寫入的表一致（public.contact_requests） */
async function pingContactRequestsWithRetry(
  client: SupabaseClient,
): Promise<PingResult> {
  let lastError: PostgrestError | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // 實際讀取至少一筆的欄位（非 head-only / 非僅 count），讓 Postgres 執行一般 SELECT。
    // .not("id", "is", null) 產生明確 WHERE，避免查詢形狀被過度簡化；每次請求皆新，不額外依賴 HTTP cache。
    const { data, error } = await client
      .from("contact_requests")
      .select("id")
      .not("id", "is", null)
      .limit(1);

    if (!error) {
      const rows = (data ?? []) as { id: unknown }[];
      if (attempt > 0) {
        console.log(
          `[keep-alive] success after retry, attempt=${attempt + 1}, rows=${rows.length}`,
        );
      } else {
        console.log(
          `[keep-alive] success, rows=${rows.length}`,
        );
      }
      return { ok: true, rows };
    }

    lastError = error;
    console.error(
      `[keep-alive] attempt ${attempt + 1}/${MAX_ATTEMPTS} failed:`,
      error.message,
      error,
    );

    if (attempt < MAX_ATTEMPTS - 1) {
      const delay = RETRY_DELAYS_MS[attempt] ?? 800;
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  return {
    ok: false,
    error: lastError ?? { message: "Unknown error" } as PostgrestError,
  };
}

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.error("[keep-alive] unauthorized", { timestamp });
    return NextResponse.json(
      { ok: false, error: "Unauthorized", timestamp },
      { status: 401 },
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    console.error("[keep-alive] Supabase env missing", { timestamp });
    return NextResponse.json(
      { ok: false, error: "Supabase 未設定", timestamp },
      { status: 500 },
    );
  }

  try {
    const result = await pingContactRequestsWithRetry(supabase);

    if (!result.ok) {
      console.error("[keep-alive] failed after retries", {
        timestamp,
        error: result.error.message,
      });
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          timestamp,
        },
        { status: 500 },
      );
    }

    console.log("[keep-alive] completed", {
      timestamp,
      sampleIds: result.rows.map((r) => r.id),
    });

    return NextResponse.json({
      ok: true,
      message: "Supabase 保活成功",
      timestamp,
      rowCount: result.rows.length,
      sample: result.rows[0] ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[keep-alive] exception", { timestamp, message, err });
    return NextResponse.json(
      { ok: false, error: message, timestamp },
      { status: 500 },
    );
  }
}
