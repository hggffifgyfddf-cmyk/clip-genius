import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const { amount, jobId } = await req.json();
    const costPerClip = 1; // 1 credit per clip

    const supabase = supabaseAdmin();

    // Get current balance
    const { data: credits, error: fetchError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching credits:", fetchError);
      return Response.json({ error: "Database error" }, { status: 500 });
    }

    const currentBalance = credits?.balance || 0;
    const requiredCredits = amount || costPerClip;

    if (currentBalance < requiredCredits) {
      return Response.json({ 
        error: "Insufficient credits", 
        balance: currentBalance,
        required: requiredCredits
      }, { status: 402 });
    }

    // Deduct credits
    const newBalance = currentBalance - requiredCredits;
    
    if (credits) {
      await supabase
        .from("credits")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } else {
      await supabase.from("credits").insert({
        user_id: userId,
        balance: newBalance,
      });
    }

    // Record transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -requiredCredits,
      type: "spend",
      description: `Generated ${requiredCredits} clip${requiredCredits > 1 ? 's' : ''}`,
    });

    // Update job with credits spent
    if (jobId) {
      await supabase
        .from("jobs")
        .update({ credits_spent: requiredCredits })
        .eq("id", jobId);
    }

    return Response.json({ 
      success: true, 
      balance: newBalance,
      spent: requiredCredits
    });
  } catch (error) {
    console.error("Spend credits error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}