import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { jobId } = await req.json();
    if (!jobId) {
      return Response.json({ error: "Missing jobId" }, { status: 400 });
    }

    const sb = supabaseAdmin();

    // get job
    const { data: job, error } = await sb
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single();

    if (error || !job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    if (!job.zip_path) {
      return Response.json({ error: "Zip not ready" }, { status: 400 });
    }

    // signed download URL
    const { data } = await sb.storage
      .from("clipgenius")
      .createSignedUrl(job.zip_path, 60);

    return Response.json({ url: data.signedUrl });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}