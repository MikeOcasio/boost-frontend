import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req, res) {
  try {
    const items = await req.json();

    const products = await Promise.all(
      items.map(async (item) => {
        const product = await stripe.products.create({
          name: item.name,
          type: "service",
          images: [item.image],
          metadata: {
            productId: item.id,
            productName: item.name,
            platformId: item.platform_id,
            platformName: item.platform.name,
          },
        });

        const price = await stripe.prices.create({
          unit_amount: item.price * 100, // Stripe expects amount in cents
          currency: "usd",
          product: product.id,
        });

        return {
          price: price.id, // Use the created price
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      currency: "usd",
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/thank_you?orderId=${products.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard`,
      payment_method_types: ["card", "paypal"],
      metadata: {
        userId: products.id,
        orderId: products.id,
      },
      line_items: products,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err.message);
    return NextResponse.json({ status: 500 }, { error: err.message });
  }
}
