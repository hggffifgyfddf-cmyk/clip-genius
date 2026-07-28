import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";

const paddle = new Paddle(process.env.PADDLE_API_KEY, {
  environment: Environment.production,
});

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const { credits } = await req.json();

    // Price mapping for Paddle (you'll get these from Paddle Dashboard)
    const priceMap = {
      100: "pri_01kpgmyb0yya93yn22nx1bq9mn",
      500: "pri_01kpgn3zx616gq22ymwh414gep",
      1000: "pri_01kpgn7tfcx2jex90h6t93d6vz",
      5000: "pri_01kpgnsry34kgd01fw0t1s1bgy"
    };

    const priceId = priceMap[credits];

    // Create transaction
    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customerId: userId,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`
    });

    // Store transaction in database
    const supabase = supabaseAdmin();
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: "pending",
      description: `Purchase ${credits} credits`,
      paddle_transaction_id: transaction.id
    });

    return Response.json({ url: transaction.checkout.url });

  } catch (error) {
    console.error("Paddle checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}