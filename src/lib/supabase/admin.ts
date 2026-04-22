import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin client using the service role key.
 * This bypasses Row Level Security (RLS) entirely.
 * ONLY use this in server actions/components — NEVER expose to the client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey || serviceKey === "COLE_AQUI_SUA_SERVICE_ROLE_KEY") {
    throw new Error(
      "[Admin Client] SUPABASE_SERVICE_ROLE_KEY não configurada no .env.local"
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
