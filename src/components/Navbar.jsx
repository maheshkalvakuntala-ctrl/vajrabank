import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { List, X } from "react-bootstrap-icons";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`navbar ${isMenuOpen ? "menu-open" : ""}`}>
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          VAJRA<span>BANK</span>
        </Link>
      </div>

      {/* Hamburger Toggle */}
      <button
        className="mobile-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        {isMenuOpen ? <X size={30} /> : <List size={30} />}
      </button>

      {/* Navigation Overlay/Links */}
      <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
