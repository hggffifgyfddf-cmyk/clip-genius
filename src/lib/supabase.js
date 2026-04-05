import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("ENV KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  return createClient(url, key);
}