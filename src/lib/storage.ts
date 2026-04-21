/**
 * Supabase Storage 公開檔案 URL 工具（Public bucket）
 *
 * 路徑格式：getStoragePublicUrl("a1.jpg") 或 "子資料夾/a1.jpg"
 * 環境變數：NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY（建議兩者皆有，URL 才與 SDK 一致並正確編碼）
 * 選填：NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET 覆寫預設 bucket
 */

import { createClient } from "@supabase/supabase-js";

/** 預設公開 bucket（可用 NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET 覆寫） */
export const STORAGE_PUBLIC_BUCKET = "resources";

export function getStorageBucket(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_HERO_BG_BUCKET?.trim() ||
    STORAGE_PUBLIC_BUCKET
  );
}

/** 手動拼接時對 object path 分段編碼，避免空白、中文等導致 400 */
function encodeStorageObjectPath(path: string): string {
  return path
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

/**
 * 取得 Storage 檔案的公開 URL
 * @param path 相對於 bucket 的路徑（與 Dashboard 中 object path 一致，含子資料夾時一併寫入，例如 `hero/a1.jpg`）
 */
export function getStoragePublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  const normalizedPath = path.replace(/^\/+/, "");

  if (!base) {
    return normalizedPath.startsWith("/")
      ? normalizedPath
      : `/${normalizedPath}`;
  }

  const bucket = getStorageBucket();

  // 優先使用官方 getPublicUrl（路徑編碼與專案 URL 與線上行為一致，較不易 400）
  if (anonKey) {
    const supabase = createClient(base, anonKey);
    const { data } = supabase.storage.from(bucket).getPublicUrl(normalizedPath);
    return data.publicUrl;
  }

  const encodedPath = encodeStorageObjectPath(normalizedPath);
  return `${base}/storage/v1/object/public/${bucket}/${encodedPath}`;
}

/** 是否為 Supabase Storage 公開物件 URL（任意專案路徑） */
export function isStorageUrl(url: string): boolean {
  return url.includes("/storage/v1/object/public/");
}
