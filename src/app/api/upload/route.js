import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function safeName(name = "video.mp4") {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sb = supabaseAdmin();

    const filename = safeName(file.name || "upload.mp4");
    const path = `${userId}_${Date.now()}_${filename}`;

    const { error } = await sb.storage
      .from("clipgenius")
      .upload(path, buffer, {
        contentType: file.type || "video/mp4",
      });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({
      videoPath: path,
    });

  } catch (e) {
    return Response.json(
      { error: e.message || "Upload failed" },
      { status: 500 }
    );
  }
}