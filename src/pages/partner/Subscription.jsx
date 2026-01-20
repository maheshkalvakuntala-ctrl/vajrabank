import React, { useState } from 'react';
import { Check, CreditCard, StarFill } from 'react-bootstrap-icons';
import { paymentService } from '../../services/paymentService';
import { usePartner } from '../../context/PartnerContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-canvas-confetti';

export default function Subscription() {
    const { loginPartner, updateSubscription } = usePartner();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(null);
    const [fireConfetti, setFireConfetti] = useState(false);

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            price: '$29',
            interval: '/month',
            features: ['Basic Analytics', '1 Ad Campaign', 'Standard Support', 'Community Access'],
            highlight: false,
            color: '#64748b'
        },
        {
            id: 'growth',
            name: 'Growth',
            price: '$99',
            interval: '/month',
            features: ['Advanced Analytics', '5 Ad Campaigns', 'Priority Support', 'API Access', 'Custom Branding'],
            highlight: true,
            color: '#3b82f6'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$299',
            interval: '/month',
            features: ['Unlimited Analytics', 'Unlimited Ads', 'Dedicated Manager', 'White-label Solution', 'SSO Integration'],
            highlight: false,
            color: '#8b5cf6'
        }
    ];

    const handleSubscribe = async (plan) => {
        setProcessing(plan.id);
        try {
            // 1. Simulate Auth (Login as Partner if not already)
            // For demo, we auto-login as a mock partner
            if (!localStorage.getItem("vajra_partner_auth")) {
                loginPartner({
                    id: `partner_${Date.now()}`,
                    name: "Demo Partner",
                    email: "partner@demo.com",
                    businessName: "Demo Corp"
                });
            }

            // 2. Process Payment
            const result = await paymentService.initiatePayment(plan);

            if (result.success) {
                // 3. Update Subscription
                updateSubscription(plan.id, 'ACTIVE');

                // 4. Success Effects
                setFireConfetti(true);
                setTimeout(() => {
                    navigate('/partner/dashboard');
                }, 2500);
            }
        } catch (error) {
            alert("Payment failed: " + error);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', padding: '100px 20px 40px' }}>
            {fireConfetti && <Confetti style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 100 }} fire={true} />}

            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Choose Your Partner Plan
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '60px', maxWidth: '600px', margin: '0 auto 60px' }}>
                    Unlock the full power of the Vajra ecosystem. Scale your business with our tailored banking and advertising solutions.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            style={{
                                background: '#1e293b',
                                borderRadius: '24px',
                                padding: '40px',
                                position: 'relative',
                                border: plan.highlight ? `2px solid ${plan.color}` : '1px solid #334155',
                                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                                zIndex: plan.highlight ? 10 : 1,
                                boxShadow: plan.highlight ? `0 0 40px ${plan.color}33` : 'none',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {plan.highlight && (
                                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: plan.color, color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                    MOST POPULAR
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#ccfa60' }}>{plan.name}</h3>
                            <div style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '8px', color: 'white' }}>
                                {plan.price}<span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '400' }}>{plan.interval}</span>
                            </div>

                            <ul style={{ margin: '32px 0', padding: 0, listStyle: 'none', textAlign: 'left', flex: 1 }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1' }}>
                                        <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '4px', borderRadius: '50%', display: 'flex' }}>
                                            <Check color="#22c55e" size={12} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: plan.highlight ? plan.color : '#334155',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: processing ? 'not-allowed' : 'pointer',
                                    transition: 'background 0.2s, transform 0.2s',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!processing) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = `0 10px 20px ${plan.color}44`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {processing === plan.id ? 'Processing...' : (
                                    <>
                                        <CreditCard /> Subscribe Now
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '60px', color: '#64748b', fontSize: '0.9rem' }}>
                    <p>
                        {paymentService.isMockMode()
                            ? "🟢 DEMO MODE: Payments are simulated. No real charge will be made."
                            : "🔒 Secure Payment via Razorpay. Your data is encrypted."}
                    </p>
                </div>
            </div>
        </div>
    );
}
