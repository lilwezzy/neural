import { useState } from 'react';
import { PRICING_TIERS, formatPrice, setProStatus, isPro } from '../data/pricing';
import { NEURAL_PROGRAMS, NeuralProgram } from '../data/programs';
import { createCheckoutSession, simulatePurchase } from '../services/stripe';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestedProgram?: NeuralProgram | null;
  trigger?: 'upgrade' | 'settings' | 'paywall';
}

export default function PricingModal({ isOpen, onClose, requestedProgram, trigger = 'upgrade' }: PricingModalProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePurchase = async (tierId: string) => {
    if (tierId === 'free') {
      onClose();
      return;
    }

    setLoading(tierId);
    setError(null);

    try {
      // Try real Stripe checkout first
      const session = await createCheckoutSession(tierId);
      
      if (session?.sessionId) {
        // Redirect to Stripe Checkout
        window.location.href = `/api/checkout?session_id=${session.sessionId}`;
        return;
      }
      
      // Fall back to demo mode (no Stripe configured)
      console.log('Using demo mode - Stripe not configured');
      const success = await simulatePurchase(tierId);
      
      if (success) {
        setProStatus(true);
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError('Purchase failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const lockedPrograms = requestedProgram 
    ? [requestedProgram] 
    : NEURAL_PROGRAMS.filter(p => !isPro() && PRICING_TIERS[0].features.includes(p.name) === false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content pricing-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        {success ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h2>Welcome to Neural Shift Pro!</h2>
            <p>You now have access to all 21 programs.</p>
          </div>
        ) : (
          <>
            <div className="pricing-header">
              <h2>Upgrade Your Frequency</h2>
              <p className="pricing-subtitle">
                {trigger === 'paywall' 
                  ? `Unlock "${requestedProgram?.name}" and all programs`
                  : 'Get unlimited access to all 21 neural programs'}
              </p>
            </div>

            <div className="pricing-grid">
              {PRICING_TIERS.map((tier) => {
                const isLoading = loading === tier.id;
                const isPopular = tier.popular;
                
                return (
                  <div 
                    key={tier.id} 
                    className={`pricing-card ${isPopular ? 'popular' : ''} ${tier.id === 'free' ? 'free-tier' : ''}`}
                  >
                    {isPopular && <div className="popular-badge">Most Popular</div>}
                    {tier.originalPrice && (
                      <div className="original-price">${tier.originalPrice.toFixed(2)}</div>
                    )}
                    
                    <h3>{tier.name}</h3>
                    <div className="price-display">
                      <span className="price">{formatPrice(tier.price, tier.period)}</span>
                    </div>
                    
                    <ul className="features-list">
                      {tier.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                    
                    {tier.id === 'free' ? (
                      <button className="pricing-btn free-btn" onClick={onClose}>
                        Continue Free
                      </button>
                    ) : (
                      <button 
                        className="pricing-btn"
                        disabled={isLoading}
                        onClick={() => handlePurchase(tier.id)}
                      >
                        {isLoading ? 'Processing...' : `Get ${tier.name}`}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pricing-footer">
              <p>🔒 Secure payment via Stripe</p>
              <p>30-day money-back guarantee</p>
            </div>
          </>
        )}
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          background: #0a0a0f;
          border: 1px solid #333;
          border-radius: 16px;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 2rem;
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: #666;
          font-size: 1.5rem;
          cursor: pointer;
        }
        
        .pricing-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .pricing-header h2 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }
        
        .pricing-subtitle {
          color: #888;
        }
        
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .pricing-card {
          background: #111118;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .pricing-card.popular {
          border-color: #6366f1;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
        }
        
        .pricing-card.free-tier {
          opacity: 0.7;
        }
        
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .pricing-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        .price-display {
          margin-bottom: 1rem;
        }
        
        .price {
          font-size: 2rem;
          font-weight: 700;
          color: #4ade80;
        }
        
        .original-price {
          text-decoration: line-through;
          color: #666;
          font-size: 0.9rem;
        }
        
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
          flex-grow: 1;
        }
        
        .features-list li {
          padding: 0.4rem 0;
          font-size: 0.85rem;
          color: #ccc;
          padding-left: 1.25rem;
          position: relative;
        }
        
        .features-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4ade80;
        }
        
        .pricing-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pricing-btn:not(:disabled):hover {
          transform: translateY(-2px);
        }
        
        .pricing-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .pricing-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }
        
        .free-btn {
          background: #333;
          color: #ccc;
        }
        
        .pricing-footer {
          text-align: center;
          color: #666;
          font-size: 0.85rem;
        }
        
        .pricing-footer p {
          margin: 0.25rem 0;
        }
        
        .success-state {
          text-align: center;
          padding: 3rem;
        }
        
        .success-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #4ade80;
          color: #0a0a0f;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        
        @media (max-width: 600px) {
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
