import { supabaseAdmin } from "@/lib/supabase";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment: Environment.production,
});
const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("paddle-signature");

  try {
    const event = await paddle.webhooks.unserialize(body, signature, webhookSecret);

    if (event.eventType === "transaction.completed") {
      const transactionId = event.data.id;
      // CHANGED THIS LINE ONLY - now gets credits from customData
      const credits = event.data.items[0].price.customData?.credits || 0;

      const supabase = supabaseAdmin();

      // Get transaction from database
      const { data: tx } = await supabase
        .from("credit_transactions")
        .select("user_id")
        .eq("paddle_transaction_id", transactionId)
        .single();

      if (tx) {
        // Add credits to user
        const { data: creditsData } = await supabase
          .from("credits")
          .select("balance")
          .eq("user_id", tx.user_id)
          .single();

        const newBalance = (creditsData?.balance || 0) + credits;

        if (creditsData) {
          await supabase
            .from("credits")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("user_id", tx.user_id);
        } else {
          await supabase.from("credits").insert({
            user_id: tx.user_id,
            balance: credits
          });
        }

        // Update transaction status
        await supabase
          .from("credit_transactions")
          .update({
            type: "purchase",
            created_at: new Date().toISOString()
          })
          .eq("paddle_transaction_id", transactionId);

        console.log(`✅ Added ${credits} credits to user ${tx.user_id}`);
      }
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}