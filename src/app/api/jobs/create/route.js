import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

function planMonthlyCredits(plan) {
  if (plan === "starter") return 30;
  if (plan === "pro") return 120;
  if (plan === "elite") return 500;
  return 0; // free
}

function isResetDue(resetAt) {
  const reset = new Date(resetAt).getTime();
  const now = Date.now();
  const days30 = 1000 * 60 * 60 * 24 * 30;
  return now - reset >= days30;
}

export async function POST(req) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = await req.json();

  const preset = body.preset || "viral";
  const ratio = body.ratio || "9:16";
  const clipLength = parseInt(body.clipLength || "18", 10);
  const maxClips = parseInt(body.maxClips || "10", 10);
  const videoPath = body.videoPath;

  if (!videoPath) {
    return Response.json({ error: "Missing videoPath" }, { status: 400 });
  }

  const sb = supabaseAdmin();

  // ✅ 1) Ensure profile exists
  let { data: profile, error: profErr } = await sb
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profErr && profErr.code === "PGRST116") {
    // Not found -> create
    const { data: created, error: createErr } = await sb
      .from("profiles")
      .insert([{ user_id: userId, plan: "free", credits_remaining: 0 }])
      .select("*")
      .single();

    if (createErr) {
      return Response.json({ error: createErr.message }, { status: 500 });
    }
    profile = created;
  } else if (profErr) {
    return Response.json({ error: profErr.message }, { status: 500 });
  }

  // ✅ 2) Reset monthly credits if needed
  if (profile && isResetDue(profile.reset_at)) {
    const newCredits = planMonthlyCredits(profile.plan);

    const { data: updated, error: upErr } = await sb
      .from("profiles")
      .update({
        credits_remaining: newCredits,
        reset_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (upErr) return Response.json({ error: upErr.message }, { status: 500 });
    profile = updated;
  }

  // ✅ 3) Block if no subscription / no credits
  if (!profile || profile.credits_remaining <= 0) {
    return Response.json(
      {
        error:
          "No credits left. Subscribe to generate clips.",
      },
      { status: 403 }
    );
  }

  // ✅ 4) Decrease credit by 1 per video
  const { error: decErr } = await sb
    .from("profiles")
    .update({ credits_remaining: profile.credits_remaining - 1 })
    .eq("user_id", userId);

  if (decErr) {
    return Response.json({ error: decErr.message }, { status: 500 });
  }

  // ✅ 5) Create job
  const { data: job, error: jobErr } = await sb
    .from("jobs")
    .insert([
      {
        user_id: userId,
        preset,
        ratio,
        clip_length: clipLength,
        max_clips: maxClips,
        status: "queued",
        video_path: videoPath,
      },
    ])
    .select("*")
    .single();

  if (jobErr) {
    return Response.json({ error: jobErr.message }, { status: 500 });
  }

  return Response.json({ job });
}