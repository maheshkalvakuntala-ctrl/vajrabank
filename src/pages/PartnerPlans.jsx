import React from "react";
import { CheckCircleFill, CreditCard } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import "./PartnerPlans.css";

export default function PartnerPlans() {
    const navigate = useNavigate();

    const handleSubscribe = (planName) => {
        // In a real app, this would redirect to a checkout page or similar
        // For now, we'll just navigate to the signup page with a query param
        navigate(`/partner/register?plan=${planName}`);
    };

    return (
        <div className="partner-plans-page">
            <div className="plans-header">
                <h1 className="plans-title">Choose Your Partner Plan</h1>
                <p className="plans-subtitle">
                    Unlock the full power of the Vajra ecosystem. Scale your business with
                    our tailored banking and advertising solutions.
                </p>
            </div>

            <div className="plans-grid">
                {/* Starter Plan */}
                <div className="plan-card">
                    <h3 className="plan-name">Starter</h3>
                    <div className="plan-price">
                        $29<span>/month</span>
                    </div>
                    <ul className="plan-features">
                        <li>
                            <CheckCircleFill className="check-icon" /> Basic Analytics
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> 1 Ad Campaign
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Standard Support
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Community Access
                        </li>
                    </ul>
                    <button
                        className="subscribe-btn"
                        onClick={() => handleSubscribe("Starter")}
                    >
                        <CreditCard /> Subscribe Now
                    </button>
                </div>

                {/* Growth Plan (Featured) */}
                <div className="plan-card featured">
                    <div className="popular-badge">Most Popular</div>
                    <h3 className="plan-name">Growth</h3>
                    <div className="plan-price">
                        $99<span>/month</span>
                    </div>
                    <ul className="plan-features">
                        <li>
                            <CheckCircleFill className="check-icon" /> Advanced Analytics
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> 5 Ad Campaigns
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Priority Support
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> API Access
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Custom Branding
                        </li>
                    </ul>
                    <button
                        className="subscribe-btn"
                        onClick={() => handleSubscribe("Growth")}
                    >
                        <CreditCard /> Subscribe Now
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="plan-card">
                    <h3 className="plan-name">Enterprise</h3>
                    <div className="plan-price">
                        $299<span>/month</span>
                    </div>
                    <ul className="plan-features">
                        <li>
                            <CheckCircleFill className="check-icon" /> Unlimited Analytics
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Unlimited Ads
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> Dedicated Manager
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> White-label Solution
                        </li>
                        <li>
                            <CheckCircleFill className="check-icon" /> SSO Integration
                        </li>
                    </ul>
                    <button
                        className="subscribe-btn"
                        onClick={() => handleSubscribe("Enterprise")}
                    >
                        <CreditCard /> Subscribe Now
                    </button>
                </div>
            </div>

            <div className="demo-mode-text">
                <div className="status-dot"></div>
                DEMO MODE: Payments are simulated. No real charge will be made.
            </div>
        </div>
    );
}
