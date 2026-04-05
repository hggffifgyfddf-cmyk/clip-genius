import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const supabase = supabaseAdmin();

    const { data: credits, error } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching credits:", error);
      return Response.json({ error: "Database error" }, { status: 500 });
    }

    const balance = credits?.balance || 0;

    // Get transaction history
    const { data: transactions } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    return Response.json({ 
      balance, 
      transactions: transactions || [],
      costPerClip: 1 // 1 credit per clip
    });
  } catch (error) {
    console.error("Credits API error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}