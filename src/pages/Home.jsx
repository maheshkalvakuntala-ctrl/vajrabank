import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import FeaturesShowcase from "../components/FeaturesShowcase";
import features from "../data/featuresData";
import "./Home.css";

const heroImages = [
  "https://cdn.prod.website-files.com/67b7abfbb037e687d0a415ec/67db95411df971225cd735e7_emerging_technologies_in_finance.webp",
  "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1",
  "https://images.unsplash.com/photo-1581091012184-5c7b8b78c8e3",
  "https://img.freepik.com/free-photo/finance-business-accounting-analysis-management-concept_53876-15817.jpg",
];

/* ================= TRACKS (UNCHANGED) ================= */
const tracks = [
  {
    id: "students",
    title: "Students & early-career learners",
    desc:
      "Follow a structured path through fundamental topics with glossaries and diagrams.",
    detail: {
      heading: "Foundational finance & banking orientation",
      text:
        "This track introduces core banking, payments, and financial concepts using simplified explanations designed for learners.",
      points: [
        "Overview of banking systems and financial products",
        "Conceptual diagrams instead of technical jargon",
        "Learning-first explanations with examples",
      ],
    },
  },
  {
    id: "banking",
    title: "Banking, risk & compliance professionals",
    desc:
      "Domain-specific explainers on risk, fraud, regulation, and analytics.",
    detail: {
      heading: "Risk, fraud, and compliance orientation",
      text:
        "A high-level overview of financial risks, fraud typologies, and control frameworks used by regulated institutions.",
      points: [
        "Risk management and internal controls",
        "Fraud detection concepts and typologies",
        "Regulatory and compliance context",
      ],
    },
  },
  {
    id: "sme",
    title: "Entrepreneurs & SMEs",
    desc:
      "Understand lending, cash flow, accounting, and tax basics.",
    detail: {
      heading: "Business finance orientation",
      text:
        "Designed to help business owners understand financing, working capital, and financial decision-making.",
      points: [
        "Loan structures and repayment concepts",
        "Cash-flow and working capital basics",
        "Tax and compliance awareness",
      ],
    },
  },
  {
    id: "investors",
    title: "Investors & individuals",
    desc:
      "Review risk-return concepts and investment growth scenarios.",
    detail: {
      heading: "Investment fundamentals orientation",
      text:
        "Covers return calculations, compounding, and portfolio risk concepts.",
      points: [
        "ROI and CAGR fundamentals",
        "Risk profiling concepts",
        "Scenario-based illustrations",
      ],
    },
  },
  {
    id: "fintech",
    title: "FinTech builders",
    desc:
      "Explore payment flows, analytics, and AI concepts.",
    detail: {
      heading: "FinTech ecosystem orientation",
      text:
        "A product-level overview of how modern digital banking systems are built.",
      points: [
        "Payments and transaction flows",
        "Analytics and data pipelines",
        "AI and automation concepts",
      ],
    },
  },
  {
    id: "audit",
    title: "Compliance & audit teams",
    desc:
      "High-level orientation to control frameworks and audit trails.",
    detail: {
      heading: "Audit & governance orientation",
      text:
        "Focuses on governance, controls, and regulatory oversight models.",
      points: [
        "Audit trails and reporting",
        "Control frameworks",
        "Regulatory alignment",
      ],
    },
  },
];

export default function Home() {
  const [active, setActive] = useState(null);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ================= HERO (UPDATED ONLY) ================= */}
      <section className="hero-glass">
        <div
          className="hero-slider"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {heroImages.map((img, i) => (
            <div
              key={i}
              className="hero-slide"
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="hero-overlay" />

        <div className="hero-inner">
          <h1 style={{ color: "white" }}>
            Banking that's <span>Secure</span>, <span>Smart</span> & Built for India
          </h1>
          <p>
            VajraBank brings next-generation digital banking with enterprise-grade
            security and powerful financial tools.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Create Account
            </button>
            <button className="btn-outline" onClick={scrollToFeatures}>
              Explore Features
            </button>
          </div>
          <div className="trust-strip">
            <span style={{ color: "white" }}>🔐 RBI-Compliant</span>
            <span style={{ color: "white" }}>🛡️ 256-bit Encryption</span>
            <span style={{ color: "white" }}>⚡ Instant Transfers</span>
            <span style={{ color: "white" }}>📞 24/7 Support</span>
          </div>
        </div>
      </section>

      {/* ================= REMAINING CODE (UNCHANGED) ================= */}
      <FeaturesShowcase />

      <section className="features-section" id="features">
        <h2>Tools and calculators</h2>
        <p className="section-sub">
          These calculators are intended for scenario analysis and illustration only.
        </p>

        <div className="features-grid">
          {features.map((item) => (
            <FeatureCard key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section className="track-section">
        <h2 style={{ color: "white" }}>Choose the track that matches your context</h2>
        <p className="track-sub">Different visitors use this site for different goals.</p>

        <div className="track-grid">
          {tracks.map((t) => (
            <div
              key={t.id}
              className={`track-card ${active === t.id ? "active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <h3 style={{ color: "white" }}>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>

        {active && (
          <div className="track-detail glass">
            <h3 style={{ color: "white" }}>
              {tracks.find((t) => t.id === active).detail.heading}
            </h3>
            <p>{tracks.find((t) => t.id === active).detail.text}</p>
            <ul>
              {tracks
                .find((t) => t.id === active)
                .detail.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
            </ul>

            <div className="disclaimer">
              This content is informational and educational only and should not be treated as advice.
            </div>
          </div>
        )}
      </section>
    </>
  );
}
