import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}
        <div className="footer-brand">
          <h2>VajraBank</h2>
          <p>
            India's most trusted digital bank. Secure, seamless, and
            designed for the modern lifestyle.
          </p>

          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <a href="/about">About Us</a>
          <a href="/careers">Careers</a>
          <a href="/press">Press & Media</a>
          <a href="/contact">Contact</a>
        </div>

        {/* PRODUCTS */}
        <div className="footer-links">
          <h4>Products</h4>
          <a href="#">Savings Account</a>
          <a href="#">Credit Cards</a>
          <a href="#">Personal Loans</a>
          <a href="#">Investments</a>
          <a href="#">Insurance</a>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>📞 1800-VAJRA-BANK</p>
          <span>24/7 Customer Support</span>
          <p>✉ support@vajrabank.com</p>
          <p>📍 VajraBank Tower, BKC, Mumbai 400051</p>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        <p>© 2024 VajraBank. All rights reserved.</p>
        <div className="footer-policy">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}
