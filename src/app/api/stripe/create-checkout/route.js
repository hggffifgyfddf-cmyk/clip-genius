import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }

    const { amount, credits } = await req.json();

    // Price mapping: credits to amount in cents
    const priceMap = {
      100: 499,   // $4.99 for 100 credits
      500: 1999,  // $19.99 for 500 credits
      1000: 3499, // $34.99 for 1000 credits
      5000: 14999 // $149.99 for 5000 credits
    };

    const unitAmount = priceMap[credits] || amount * 100;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} ClipGenius Credits`,
              description: `Generate ${credits} viral clips with AI`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        credits: credits.toString(),
      },
    });

    // Store transaction pending in database
    const supabase = supabaseAdmin();
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: "pending",
      description: `Purchase ${credits} credits`,
      stripe_session_id: session.id,
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}