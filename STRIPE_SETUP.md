# Stripe Setup Guide for Neural Shift

## Step 1: Get Your Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable Key** (starts with `pk_test_`)
3. Copy your **Secret Key** (starts with `sk_test_`)

## Step 2: Create Products in Stripe

1. Go to https://dashboard.stripe.com/products
2. Create 3 products:

### Pro Monthly
- Name: "Neural Shift Pro Monthly"
- Price: $7.99/month
- Recurring: Monthly
- Copy the Price ID (starts with `price_`)

### Pro Annual
- Name: "Neural Shift Pro Annual"
- Price: $49.99/year
- Recurring: Yearly
- Copy the Price ID

### Lifetime
- Name: "Neural Shift Lifetime"
- Price: $97.00
- Recurring: One-time
- Copy the Price ID

## Step 3: Configure Vercel

1. Go to https://vercel.com/your-github-username/neural/settings/environment-variables
2. Add these variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PRICE_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_ANNUAL=price_your_annual_price_id
STRIPE_PRICE_LIFETIME=price_your_lifetime_price_id
NEXT_PUBLIC_APP_URL=https://neural-ashy.vercel.app
```

3. Redeploy the app

## Step 4: Test Payments

Use Stripe Test Mode:
- Test card: 4242 4242 4242 4242
- Any future date
- Any CVC
- Any ZIP

## Troubleshooting

### "Stripe not configured" message
→ Add your publishable key to `.env.local` for local dev

### Checkout redirect fails
→ Make sure all Stripe environment variables are set in Vercel

### Webhook errors
→ For now, we're using client-side verification. For production, set up webhooks.

## Files Modified

- `src/services/stripe.ts` - Stripe integration
- `api/create-checkout-session.ts` - Server-side checkout
- `.env.example` - Environment template
- `src/components/PricingModal.tsx` - Updated with real payments
