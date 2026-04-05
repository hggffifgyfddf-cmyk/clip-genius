import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const sb = supabaseAdmin();

  const { data, error } = await sb
    .from("profiles")
    .select("user_id, plan, credits_left, reset_at")
    .eq("user_id", userId)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ profile: data });
}