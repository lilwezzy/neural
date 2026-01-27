import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_secret_key', {
  apiVersion: '2023-10-16',
});

// Price IDs from your Stripe Dashboard
const PRICE_IDS: Record<string, string> = {
  'pro-monthly': process.env.STRIPE_PRICE_MONTHLY || 'price_monthly_id',
  'pro-annual': process.env.STRIPE_PRICE_ANNUAL || 'price_annual_id',
  'lifetime': process.env.STRIPE_PRICE_LIFETIME || 'price_lifetime_id',
};

export async function POST(request: NextRequest) {
  try {
    const { tierId, priceId } = await request.json();
    
    const selectedPriceId = priceId || PRICE_IDS[tierId];
    
    if (!selectedPriceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://neural-ashy.vercel.app'}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://neural-ashy.vercel.app'}/?canceled=true`,
      metadata: {
        tierId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
