import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const body = await req.json();

    const preset = body.preset || "viral";
    const ratio = body.ratio || "9:16";
    const clipLength = Number(body.clipLength || 18);
    const maxClips = Number(body.maxClips || 10);
    const videoPath = body.videoPath;
    const youtubeUrl = body.youtubeUrl;  // ✅ ADD THIS
    
    const subtitle_on = body.subtitleOn !== undefined ? body.subtitleOn : true;
    const subtitle_color = body.subtitleColor || "white";

    // ✅ Allow EITHER videoPath OR youtubeUrl
    if (!videoPath && !youtubeUrl) {
      return Response.json({ error: "Missing videoPath or youtubeUrl" }, { status: 400 });
    }

    const sb = supabaseAdmin();

    // ✅ Store youtube_url if provided
    const { data: job, error } = await sb
      .from("jobs")
      .insert([
        {
          user_id: userId,
          preset,
          ratio,
          clip_length: clipLength,
          max_clips: maxClips,
          status: "queued",
          video_path: videoPath || null,  // Can be null if YouTube
          youtube_url: youtubeUrl || null,  // ✅ NEW FIELD - ADD THIS COLUMN
          subtitle_on: subtitle_on,
          subtitle_color: subtitle_color,
          clips_data: [],
          clip_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      console.error("JOB INSERT ERROR:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("✅ JOB CREATED:", {
      id: job.id,
      type: youtubeUrl ? "YOUTUBE" : "UPLOAD",
      color: subtitle_color
    });

    return Response.json({ success: true, job });
  } catch (err) {
    console.error("CREATE JOB CRASH:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}