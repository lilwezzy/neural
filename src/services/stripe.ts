import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe (get your publishable key from Stripe Dashboard)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here';

let stripePromise: Promise<any> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export interface CheckoutSession {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

// Stripe Price IDs from your Stripe Dashboard
// Create products in Stripe Dashboard and copy the Price IDs here
export const STRIPE_PRICES: Record<string, string> = {
  'pro-monthly': 'price_pro_monthly_id', // Replace with actual Price ID
  'pro-annual': 'price_pro_annual_id',   // Replace with actual Price ID
  'lifetime': 'price_lifetime_id',       // Replace with actual Price ID
};

export async function createCheckoutSession(tierId: string): Promise<{ sessionId: string } | null> {
  // For demo mode (no real Stripe yet)
  if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_your_key_here') {
    console.log('Stripe not configured - demo mode');
    return null;
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: STRIPE_PRICES[tierId],
        tierId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    return { sessionId };
  } catch (error) {
    console.error('Checkout session error:', error);
    return null;
  }
}

export async function redirectToCheckout(sessionId: string): Promise<boolean> {
  const stripe = await getStripe();
  if (!stripe) {
    console.error('Stripe not loaded');
    return false;
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    console.error('Stripe redirect error:', error);
    return false;
  }
  return true;
}

export async function verifyPurchase(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/verify-purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) return false;
    const { verified } = await response.json();
    return verified;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}

// Demo mode functions (for testing without real Stripe)
export function simulatePurchase(tierId: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Demo purchase completed for tier: ${tierId}`);
      resolve(true);
    }, 1500);
  });
}
