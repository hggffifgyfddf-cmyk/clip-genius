import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits);

    // Add credits to user
    const { data: existingCredits, error: fetchError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching credits:", fetchError);
      return Response.json({ error: "Database error" }, { status: 500 });
    }

    let newBalance = credits;
    if (existingCredits) {
      newBalance = existingCredits.balance + credits;
      await supabase
        .from("credits")
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    } else {
      await supabase.from("credits").insert({
        user_id: userId,
        balance: credits,
      });
    }

    // Update transaction status to completed
    await supabase
      .from("credit_transactions")
      .update({
        type: "purchase",
        created_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session.id);

    console.log(`✅ Added ${credits} credits to user ${userId}. New balance: ${newBalance}`);
  }

  return Response.json({ received: true });
}