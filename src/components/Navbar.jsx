import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        FIN<span>TECH</span>
      </div>

      {/* Navigation */}
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Single Login Button */}
      <div className="navbar-actions">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </nav>
  );
}
