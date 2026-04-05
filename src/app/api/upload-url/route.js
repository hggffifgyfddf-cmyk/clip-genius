import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    // 1) Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        { error: "Not signed in" },
        { status: 401 }
      );
    }

    // 2) Get file info from frontend
    const { filename, contentType } = await req.json();

    if (!filename) {
      return Response.json(
        { error: "Filename missing" },
        { status: 400 }
      );
    }

    // 3) Storage path used by worker too
    const path = `${userId}/${Date.now()}_${filename}`;

    // 4) Create signed upload URL
    const supabase = supabaseAdmin();

    const { data, error } = await supabase.storage
      .from("clipgenius")
      .createSignedUploadUrl(path);
    
    if (error) {
      console.error("SIGNED UPLOAD ERROR:", error);
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // 5) Return upload URL + path
    return Response.json({
      uploadUrl: data.signedUrl,
      path,
    });

  } catch (err) {
    console.error("UPLOAD URL ROUTE ERROR:", err);
    return Response.json(
      { error: "Server error creating upload URL" },
      { status: 500 }
    );
  }
}