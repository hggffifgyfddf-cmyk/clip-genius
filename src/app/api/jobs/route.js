import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const sb = supabaseAdmin();

    const { data: jobs, error } = await sb
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Parse clips_data for frontend display
    const jobsWithClips = jobs.map(job => ({
      ...job,
      clips: job.clips_data ? (typeof job.clips_data === 'string' ? JSON.parse(job.clips_data) : job.clips_data) : []
    }));

    return Response.json({ jobs: jobsWithClips });

  } catch (err) {
    console.error("JOBS FETCH ERROR:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}