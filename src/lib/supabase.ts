import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** 瀏覽器端 Supabase 客戶端（用於 client components） */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as SupabaseClient);

/** 取得 Supabase 客戶端，若未設定 env 則回傳 null */
export function getSupabase(): SupabaseClient | null {
  return supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
}

/** 伺服器端 Supabase 客戶端（用於 API routes、Server Actions） */
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
