import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Testimonials from "../components/Testimonials";
import testimonials from "../data/testimonialsData";

export default function About() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleFeatureClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="about-hero">
        <h1 style={{ color: "white" }}>Simple and Safe Banking</h1>
        <p>Approved by millions of users worldwide</p>
      </section>

      {/* ================= FEATURE BENTO ================= */}
      <section className="about-bento">
        {/* BIG CARD */}
        <strong><h1 className="about-container">VajraBank is a modern digital banking platform designed to simplify financial management for individuals and businesses.
          Our goal is to bridge the gap between traditional banking systems and modern technology by delivering a fast, intuitive, and reliable platform that meets today’s financial needs.</h1>  </strong>
        <div className="bento-card large light-blue" onClick={() => handleFeatureClick("/user/payments")} style={{ cursor: 'pointer' }}>
          <div>
            <h2>Easy payments with one tap</h2>
            <p style={{ color: "white" }}>
              Send and request money easily with anyone. No extra fees.
            </p>
            <button className="btn-outline-dark">Explore products</button>
          </div>
          <div className="bento-icon">👆</div>
        </div>

        {/* SMALL CARDS */}
        <div className="bento-grid">
          <div className="bento-card green" onClick={() => handleFeatureClick("/user/rewards")} style={{ cursor: 'pointer' }}>
            <h3 >Get cash back and rewards</h3>
            <p style={{ color: "white" }}>Hundreds of deals and rewards are waiting for you.</p>
            <div className="mini-badge">+10 points cashback!</div>
          </div>

          <div className="bento-card purple" onClick={() => handleFeatureClick("/user/international")} style={{ cursor: 'pointer' }}>
            <h3>Send & receive from abroad</h3>
            <p style={{ color: "white" }}>Supporting 100+ countries. No hidden fees.</p>
            <div className="mini-badge">🌍 Worldwide support</div>
          </div>
        </div>
      </section>

      {/* ================= CREDIT CARD ================= */}
      <section className="about-split">
        <div className="text">
          <h2 style={{ color: "white" }}>Personalize your credit card</h2>
          <p>
            Choose from unique designs, add your own artwork, and select
            rewards that match your spending habits.
          </p>
          <a href="#" className="learn-link">
            Learn more →
          </a>
        </div>

        <div className="image">
          <img
            src="https://images.unsplash.com/photo-1589758438368-0ad531db3366"
            alt="Credit Card"
          />
        </div>
      </section>

      {/* ================= INVESTMENTS ================= */}
      <section className="about-split reverse">
        <div className="image">
          <img
            src="https://images.unsplash.com/photo-1580519542036-c47de6196ba5"
            alt="Investments"
          />
        </div>

        <div className="text">
          <h2 style={{ color: "white" }}>Investments made simple</h2>
          <p>
            Mutual funds, ETFs, stocks, and bonds — guided by experts
            to help you grow your wealth confidently.
          </p>
          <a href="#" className="learn-link">
            Learn more →
          </a>
        </div>
      </section>

      <Testimonials></Testimonials>



    </>
  );
}
