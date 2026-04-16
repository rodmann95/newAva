import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.error("BROWSER_ERR: Supabase ENV vars not found in client bundle.");
  }

  return createBrowserClient(
    url || "",
    key || "",
  );
}
