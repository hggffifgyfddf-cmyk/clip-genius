import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  const sb = supabaseAdmin();

  // 1) get 1 queued job
  const { data: jobs, error } = await sb
    .from("jobs")
    .select("*")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!jobs || jobs.length === 0) return Response.json({ ok: true, message: "No queued jobs" });

  const job = jobs[0];

  // mark as processing
  await sb.from("jobs").update({ status: "processing" }).eq("id", job.id);

  return Response.json({ ok: true, job });
}