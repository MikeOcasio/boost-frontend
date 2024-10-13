// route file: /src/app/api/checkout_session/route.jsx
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const items = await req.json();

    if (!Array.isArray(items)) {
      throw new Error("Invalid items format. Expected an array.");
    }

    const lineItems = items.map((item) => ({
      price: item.price_id, // Ensure this is the Price ID
      quantity: item.quantity,
    }));

    console.log("Line items:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cancel`,
    });

    console.log("Checkout session created:", session);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
