export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year' | 'lifetime';
  originalPrice?: number;
  features: string[];
  popular?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'lifetime',
    features: [
      '5 programs included',
      'Basic audio quality',
      'Session tracking',
      'Standard subliminal level',
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 7.99,
    period: 'month',
    features: [
      'All 21 programs',
      '8D spatial audio on all tracks',
      'Higher subliminal density options',
      'Advanced session analytics',
      'Priority support',
      'New programs monthly',
    ],
    popular: true,
  },
  {
    id: 'pro-annual',
    name: 'Pro Annual',
    price: 49.99,
    period: 'year',
    originalPrice: 95.88,
    features: [
      'Everything in Pro Monthly',
      '48% savings vs monthly',
      '2 months free',
      'Early access to new programs',
      'Founding member badge',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 97,
    period: 'lifetime',
    originalPrice: 191.76,
    features: [
      'All Pro features forever',
      'Never pay again',
      'All future programs included',
      'Founder status',
      'Exclusive lifetime-only programs',
    ],
  },
];

export const FREE_PROGRAMS = [
  'money-magnet',
  'vagus-reset',
  'the-zone',
  'memory-genus-40hz',
  'dopamine-reset',
];

export function isPro(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('neural-shift-pro') === 'true';
}

export function isProgramFree(programId: string): boolean {
  return FREE_PROGRAMS.includes(programId);
}

export function canAccessProgram(programId: string): boolean {
  return isPro() || isProgramFree(programId);
}

export function setProStatus(status: boolean): void {
  localStorage.setItem('neural-shift-pro', status ? 'true' : 'false');
}

export function formatPrice(price: number, period: string): string {
  const formatted = `$${price.toFixed(2)}`;
  if (period === 'month') return `${formatted}/mo`;
  if (period === 'year') return `${formatted}/yr`;
  return formatted;
}
