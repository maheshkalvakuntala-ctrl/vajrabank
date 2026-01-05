import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  ShieldLock,
  LightningCharge,
  Cpu,
  Globe2,
  CreditCard,
  ArrowRight,
  CheckCircleFill,
  PlusCircle,
  X,
  InfoCircleFill,
  BoxSeam,
  Trophy
} from "react-bootstrap-icons";
import Testimonials from "../components/Testimonials";
import "./About.css";

/* --- DATA MODELS --- */
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1550565118-3a14e8d0386f?q=80&w=2070", // Modern building/office
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070", // Tech/Banking
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015"  // Data/Growth
];

const STORY_ITEMS = [
  {
    title: "1. Virtual Onboarding",
    desc: "Open your account in under 3 minutes with digital KYC.",
    detail: "Our proprietary AI engine validates your identity in seconds using biometrics and government registry sync, allowing instant access to your new wallet.",
    label: "THE START",
    icon: <PlusCircle size={20} />
  },
  {
    title: "2. Secure Identity",
    desc: "Every transaction protected by hardware-level encryption.",
    detail: "We utilize FIPS 140-2 Level 3 certified modules to store keys. Every byte of your financial data is encrypted at rest and in transit.",
    label: "PROTECTION",
    icon: <ShieldLock size={20} />
  },
  {
    title: "3. Smart Management",
    desc: "AI insights that help you spend, save, and invest better.",
    detail: "Vajra AI scans your spending patterns to suggest optimized budget caps and auto-save triggers, helping you grow your net worth effortlessly.",
    label: "GROWTH",
    icon: <LightningCharge size={20} />
  },
  {
    title: "4. Global Reach",
    desc: "Borderless finance across 100+ corridors and 25 currencies.",
    detail: "No more SWIFT delays. Our peer-to-peer liquidity bridge ensures cross-border settlements happen in minutes, not days, with zero markup.",
    label: "BEYOND",
    icon: <Globe2 size={20} />
  }
];

const FEATURES = [
  {
    id: "upi",
    title: "Smart UPI & Payments",
    desc: "One tap to pay anyone, anywhere. Unified, fast, and free.",
    icon: <PlusCircle size={32} color="#10b981" />,
    path: "/user/payments",
    cta: "Go to Payments",
    heroSubtitle: "Engineered for 99.99% success rates and everyday speed.",
    details: "VajraBank's UPI engine is built for the modern pace. Scan any QR, pay contacts instantly, and manage all your bank accounts in one seamless interface.",
    capabilities: [
      { title: "Instant Transfers", desc: "Real-time settlement for all P2P and P2M transactions.", icon: <LightningCharge /> },
      { title: "Bill Splitting", desc: "Settle dinners or rent with automated link generation.", icon: <PlusCircle /> },
      { title: "Scheduled Pay", desc: "Never miss a rent or utility payment again.", icon: <ShieldLock /> }
    ],
    steps: ["Link Bank", "Scan QR", "Auth & Pay", "Auto-Track"],
    mockupType: "transactions",
    trust: "Military-grade encryption for every UPI pin entry."
  },
  {
    id: "cards",
    title: "Multi-Tier Cards",
    desc: "Physical, virtual, and collectible cards for every lifestyle.",
    icon: <CreditCard size={32} color="#4da3ff" />,
    path: "/user/cards",
    cta: "Manage Cards",
    heroSubtitle: "Complete control over your spend, from virtual to titanium.",
    details: "Choose from Elite Platinum, Vajra Gold, or Pulse Virtual. Our cards offer dynamic security and worldwide acceptance.",
    capabilities: [
      { title: "Instant Freeze", desc: "Misplaced your card? Lock it in one tap.", icon: <ShieldLock /> },
      { title: "Dynamic CVV", desc: "Rotating codes for ultra-secure online shopping.", icon: <LightningCharge /> },
      { title: "Limit Controls", desc: "Set per-transaction or daily spending caps.", icon: <Cpu /> }
    ],
    steps: ["Choose Tier", "Instant Issue", "Spend & Earn", "Redeem Rewards"],
    mockupType: "cards",
    trust: "PCIDSS Level 1 compliant infrastructure."
  },
  {
    id: "wealth",
    title: "Wealth & Stocks",
    desc: "Direct access to local and global equity markets.",
    icon: <Trophy size={32} color="#fbbf24" />,
    path: "/user/roi",
    cta: "Explore Investments",
    heroSubtitle: "Your wealth, managed by AI and secured by Vajra.",
    details: "Invest in US Stocks, Mutual Funds, and Fixed Deposits with zero commission and deep insights.",
    capabilities: [
      { title: "Fractional Stocks", desc: "Own a piece of global giants for as little as ₹100.", icon: <Globe2 /> },
      { title: "AI Rebalancing", desc: "Automated portfolio health checks every 24 hours.", icon: <Cpu /> },
      { title: "Tax Harvesting", desc: "Smart algorithms to save on your long term capital gains.", icon: <Trophy /> }
    ],
    steps: ["Risk Profile", "Fund Wallet", "Auto-Invest", "Track ROI"],
    mockupType: "chart",
    trust: "Regulated by SEBI and SIPC protected corrodors."
  },
  {
    id: "business",
    title: "Business Suite",
    desc: "Powerful banking tools for modern entrepreneurs.",
    icon: <BoxSeam size={32} color="#f472b6" />,
    path: "/user/business",
    cta: "Open Business Dash",
    heroSubtitle: "Bank less, grow more. Tools for the creators and founders.",
    details: "Automate payroll, manage vendor payouts, and get instant business credit lines based on your cash flow.",
    capabilities: [
      { title: "Bulk Payouts", desc: "Pay 1000+ vendors or employees in a single click.", icon: <PlusCircle /> },
      { title: "Team Cards", desc: "Issue cards to your team with individual limits.", icon: <CreditCard /> },
      { title: "Smart Invoices", desc: "Automatic matching of incoming payments to bills.", icon: <Cpu /> }
    ],
    steps: ["Verify Business", "Setup Team", "Go Live", "Analyze Health"],
    mockupType: "business",
    trust: "Dual-layer authorization for all bulk releases."
  },
  {
    id: "platform",
    title: "Wealth Platform",
    desc: "Personalized investment advisory for elite members.",
    icon: <LightningCharge size={32} color="#a78bfa" />,
    path: "/user/roi",
    cta: "See Platinum Perks",
    heroSubtitle: "Bespoke advisory for people who value time as much as wealth.",
    details: "Access private equity deals and high-yield structured products curated by our experts.",
    capabilities: [
      { title: "Private Equity", desc: "Exclusive access to pre-IPO investment rounds.", icon: <Trophy /> },
      { title: "Heritage Vaults", desc: "Structured products for generational wealth preservation.", icon: <ShieldLock /> },
      { title: "Advisory Access", desc: "Direct chat with senior investment strategists.", icon: <PlusCircle /> }
    ],
    steps: ["KYC Upgrade", "Advisory Meet", "Global Picks", "Quarterly Audit"],
    mockupType: "advisory",
    trust: "Personal NDAs and high-fidelity privacy layers."
  },
  {
    id: "international",
    title: "International Suite",
    desc: "Send, receive, and hold foreign currencies with ease.",
    icon: <Globe2 size={32} color="#6366f1" />,
    path: "/user/international",
    cta: "Go International",
    heroSubtitle: "Finance without borders. Send global as fast as local.",
    details: "Multi-currency wallets that get you the real exchange rate without the hidden bank fees.",
    capabilities: [
      { title: "Global Wallets", desc: "Hold 25+ currencies including USD, EUR, and GBP.", icon: <Globe2 /> },
      { title: "Direct Corridors", desc: "Skip intermediary banks for faster, cheaper transfers.", icon: <LightningCharge /> },
      { title: "FEMA Compliant", desc: "All paperwork and declarations handled automatically.", icon: <ShieldLock /> }
    ],
    steps: ["Set Corridor", "Lock Rate", "Send Money", "Real-time Tracking"],
    mockupType: "currency",
    trust: "Regulated across 15+ global finance jurisdictions."
  }
];

const STACKED_CARDS = [
  {
    id: "platinum",
    name: "Elite Platinum",
    theme: "linear-gradient(135deg, #1e293b, #0f172a)",
    benefits: ["Priority Concierge", "5% Reward Rate", "Unlimited Lounge", "Golf Access", "Insurance Cover"],
    limit: "₹1,000,000",
    fees: "₹4,999/yr",
    eligibility: "Income > ₹1.5L/mo",
    details: "The Elite Platinum is more than just a card; it's a gateway to a premium lifestyle. Enjoy curated experiences, worldwide assistance, and the highest reward accumulation in the industry."
  },
  {
    id: "gold",
    name: "Vajra Gold",
    theme: "linear-gradient(135deg, #451a03, #78350f)",
    benefits: ["Airport Transfers", "3% Cash Back", "Zero Forex Markup", "Dining Discounts"],
    limit: "₹500,000",
    fees: "₹999/yr",
    eligibility: "Income > ₹60k/mo",
    details: "Vajra Gold is designed for the savvy traveler. With zero forex markup and significant cash back on travel and dining, it's the perfect companion for your global adventures."
  },
  {
    id: "virtual",
    name: "Pulse Virtual",
    theme: "linear-gradient(135deg, #1e1b4b, #312e81)",
    benefits: ["Instant Access", "Dynamic CVV", "Safe Online Pay", "Subscription Control"],
    limit: "Customizable",
    fees: "Free",
    eligibility: "Instant Approval",
    details: "Pulse Virtual is optimized for the digital age. Create instant virtual cards for online shopping, set one-time use limits, and manage all your subscriptions from a single dashboard."
  }
];

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [deckIndex, setDeckIndex] = useState(0);
  const [activeDeepDive, setActiveDeepDive] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({ users: 0, uptime: 0, growth: 0 });

  useEffect(() => {
    // Hero Auto-swipe
    const heroTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    // Stats counter animation
    const targets = { users: 2.8, uptime: 99.9, growth: 250 };
    const duration = 2000;
    const interval = 30;
    const steps = duration / interval;

    let currentStep = 0;
    const statsTimer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        users: (targets.users * progress).toFixed(1),
        uptime: (targets.uptime * progress).toFixed(1),
        growth: Math.floor(targets.growth * progress)
      });
      if (currentStep === steps) clearInterval(statsTimer);
    }, interval);

    return () => {
      clearInterval(heroTimer);
      clearInterval(statsTimer);
    };
  }, []);

  const handleAction = (path) => {
    if (user) navigate(path);
    else navigate("/login");
  };

  const getCardClass = (idx) => {
    if (idx === deckIndex) return 'active';
    if (idx === (deckIndex - 1 + STACKED_CARDS.length) % STACKED_CARDS.length) return 'prev';
    if (idx === (deckIndex + 1) % STACKED_CARDS.length) return 'next';
    return 'hidden';
  };

  return (
    <div className="about-v2">
      {/* 1️⃣ HERO CAROUSEL */}
      <section className="about-hero-viewport">
        <div
          className="about-hero-slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={idx}
              className="about-hero-slide"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="about-hero-overlay" />
            </div>
          ))}
        </div>
        <div className="hero-text-container">
          <h1 className="hero-reveal-h1">Modern Banking.<br />Redefined for You.</h1>
          <p className="hero-reveal-p">Experience a financial platform built for speed, transparency, and absolute security. Trusted by millions worldwide.</p>
        </div>
      </section>

      {/* 2️⃣ REFINED VAJRA EXPERIENCE */}
      <section className="timeline-v2">
        <div className="timeline-tracker" />
        <div style={{ textAlign: 'center', marginBottom: '100px' }}>
          <h2 style={{ fontSize: '42px', color: 'white' }}>The Vajra Experience</h2>
          <p style={{ color: '#94a3b8' }}>Our journey to building the future of finance</p>
        </div>

        {STORY_ITEMS.map((item, idx) => (
          <div key={idx} className="timeline-step">
            <div className="timeline-marker">
              {item.icon}
            </div>
            <div className="timeline-box">
              <span style={{ color: '#4da3ff', fontWeight: 600, fontSize: '12px', letterSpacing: '2px' }}>{item.label}</span>
              <h3 style={{ color: 'white', margin: '15px 0' }}>{item.title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{item.detail}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3️⃣ STACKED CARD DECK */}
      <section className="deck-section">
        <h2 style={{ color: 'white', fontSize: '42px' }}>Choose Your Identity</h2>
        <p style={{ color: '#94a3b8', marginTop: '10px' }}>Tap a card to bring it to focus or learn more.</p>

        <div className="deck-container">
          {STACKED_CARDS.map((card, idx) => (
            <div
              key={card.id}
              className={`deck-card ${getCardClass(idx)}`}
              style={{ background: card.theme }}
              onClick={() => setDeckIndex(idx)}
            >
              <div style={{ padding: '30px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>VAJRA</div>
                <div style={{ color: 'white', fontSize: '22px', fontWeight: 600 }}>{card.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  <div>{user?.displayName || "AUTHORIZED USER"}</div>
                  <div>12/28</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="deck-controls" style={{ marginTop: '50px' }}>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>{STACKED_CARDS[deckIndex].name}</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {STACKED_CARDS[deckIndex].benefits.map((b, i) => (
              <span key={i} className="mini-badge" style={{ background: 'rgba(77, 163, 255, 0.1)', color: '#4da3ff', borderColor: 'rgba(77, 163, 255, 0.2)' }}>
                <CheckCircleFill size={12} style={{ marginRight: '6px' }} /> {b}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>

            <button
              className="btn-primary"
              style={{ padding: '14px 40px' }}
              onClick={() => handleAction("/user/cards")}
            >
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* 4️⃣ FEATURE GRID */}
      <section className="tilt-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="tilt-card" onClick={() => setActiveDeepDive({ type: 'feature', ...f })}>
            <div style={{ marginBottom: '24px' }}>{f.icon}</div>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>{f.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>{f.desc}</p>

          </div>
        ))}
      </section>

      {/* 5️⃣ SECURITY SCANNER UI */}
      <section className="security-scanner-ui">
        <div className="scanner-overlay" />
        <div className="security-box">
          <h2 style={{ color: 'white', fontSize: '36px', marginBottom: '20px' }}>Bank-Grade Security. Always On.</h2>
          <p style={{ color: '#cfd8ff', fontSize: '18px', lineHeight: 1.8, marginBottom: '40px' }}>
            VajraBank leverages distributed hardware security modules and real-time behavioral analysis to detect and block threats before they reach your account.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            <div><strong style={{ color: 'white' }}>256-bit AES</strong><p style={{ fontSize: '12px', color: '#94a3b8' }}>Military encryption</p></div>
            <div><strong style={{ color: 'white' }}>24/7 Monitoring</strong><p style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time audit trails</p></div>
            <div><strong style={{ color: 'white' }}>Biometric Sync</strong><p style={{ fontSize: '12px', color: '#94a3b8' }}>Hardware key support</p></div>
          </div>
        </div>
      </section>

      {/* 6️⃣ METRIC IMPACT */}
      <section style={{ padding: '120px 40px', background: '#020617', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
          <div><div style={{ fontSize: '64px', fontWeight: 900, color: 'white' }}>{stats.users}M+</div><div style={{ color: '#4da3ff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Active Users</div></div>
          <div><div style={{ fontSize: '64px', fontWeight: 900, color: 'white' }}>{stats.uptime}%</div><div style={{ color: '#4da3ff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>System Uptime</div></div>
          <div><div style={{ fontSize: '64px', fontWeight: 900, color: 'white' }}>{stats.growth}%</div><div style={{ color: '#4da3ff', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '12px' }}>Annual Growth</div></div>
        </div>
      </section>

      {/* 7️⃣ CONFIDENCE CLOSE */}
      <section className="confidence-close" style={{ padding: '160px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', color: 'white', marginBottom: '20px' }}>Your Trust is Our Asset.</h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 50px' }}>
          Join a banking platform that values your time as much as your wealth. Borderless, secure, and built for the future.
        </p>
        <button className="btn-primary" style={{ padding: '16px 48px' }} onClick={() => handleAction("/login")}>Start Your Journey Today</button>
      </section>

      <Testimonials />

      {/* IMMERSIVE PRODUCT DEEP-DIVE */}
      {activeDeepDive && (
        <div className="deep-dive-overlay">
          <div className="dive-header">
            <div style={{ color: 'white', fontWeight: 800, fontSize: '24px' }}>VAJRA<span style={{ color: '#4da3ff' }}>PRODUCT</span></div>
            <button className="dive-close" onClick={() => setActiveDeepDive(null)}>
              <ArrowRight style={{ transform: 'rotate(180deg)' }} /> BACK TO ABOUT
            </button>
          </div>

          <div className="dive-hero">
            <span style={{ color: '#4da3ff', fontWeight: 600, fontSize: '14px', letterSpacing: '4px' }}>DEEP DIVE</span>
            <h1>{activeDeepDive.title || activeDeepDive.name}</h1>
            <p style={{ color: '#cfd8ff', fontSize: '20px' }}>{activeDeepDive.heroSubtitle || "Exclusive features for our members."}</p>
          </div>

          <div className="dive-mockup-area">
            {activeDeepDive.mockupType === 'transactions' && (
              <div className="mockup-transactions">
                <div style={{ marginBottom: '20px', color: 'white', fontWeight: 600 }}>Live Feed Previews</div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="txn-item" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <LightningCharge color="#10b981" />
                      <div><div style={{ color: 'white', fontSize: '14px' }}>Starbucks Coffee</div><div style={{ color: '#94a3b8', fontSize: '12px' }}>Processed via UPI 2.0</div></div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 600 }}>- ₹245.00</div>
                  </div>
                ))}
              </div>
            )}
            {activeDeepDive.mockupType === 'chart' && (
              <div className="mockup-chart">
                {[40, 70, 55, 90, 65, 85, 95].map((h, i) => (
                  <div key={i} className="chart-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
            {activeDeepDive.mockupType === 'cards' && (
              <div style={{ textAlign: 'center' }}>
                <div className="mini-card-preview" style={{ background: activeDeepDive.theme, width: '300px', height: '180px', margin: 'auto', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: '0.5s' }}>
                  <div style={{ color: 'white', fontWeight: 700 }}>{activeDeepDive.name}</div>
                </div>
              </div>
            )}
            {activeDeepDive.mockupType === 'business' && (
              <div className="mockup-business">
                <div className="biz-stat">
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>PAYROLL STATUS</div>
                  <div style={{ color: '#10b981', fontWeight: 600 }}>Active - 124 Paid</div>
                </div>
                <div className="biz-stat">
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>VENDOR CREDITS</div>
                  <div style={{ color: 'white', fontWeight: 600 }}>₹2,40,000</div>
                </div>
              </div>
            )}
            {activeDeepDive.mockupType === 'advisory' && (
              <div className="mockup-advisory">
                <div className="adv-avatar" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Platinum Advisor</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>Online - Ready to chat</div>
                </div>
              </div>
            )}
            {activeDeepDive.mockupType === 'currency' && (
              <div className="mockup-currency">
                {['USD', 'EUR', 'GBP', 'JPY'].map(curr => (
                  <div key={curr} className="curr-tile">{curr}</div>
                ))}
              </div>
            )}
          </div>

          <div className="dive-grid">
            {(activeDeepDive.capabilities || []).map((cap, idx) => (
              <div key={idx} className="dive-card">
                <div style={{ color: '#4da3ff', marginBottom: '15px' }}>{cap.icon}</div>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>{cap.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6 }}>{cap.desc}</p>
              </div>
            ))}
          </div>

          <div className="dive-steps">
            <h2 style={{ color: 'white' }}>How It Works</h2>
            <div className="step-row">
              {(activeDeepDive.steps || []).map((step, idx) => (
                <div key={idx} className="step-item">
                  <div className="step-num">{idx + 1}</div>
                  <div style={{ color: 'white', fontWeight: 600 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dive-trust">
            <ShieldLock size={40} color="#10b981" style={{ marginBottom: '20px' }} />
            <h3 style={{ color: 'white' }}>Built with Trust</h3>
            <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto' }}>{activeDeepDive.trust || "VajraBank uses AES-256 encryption and hardware security modules to protect every transaction."}</p>
          </div>

          <div className="dive-cta-bot">
            <button
              className="btn-primary"
              style={{ padding: '18px 64px', fontSize: '18px' }}
              onClick={() => handleAction(activeDeepDive.path || "/user/cards")}
            >
              {activeDeepDive.cta || "Apply Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
