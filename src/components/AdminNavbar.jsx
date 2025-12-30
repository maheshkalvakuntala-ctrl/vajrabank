import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../styles/AdminNavbar.css";
import ThemeToggle from "./ThemeToggle";

export default function AdminNavbar({ admin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name
      ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
      : "AD";
  };

  return (
    <nav className="admin-navbar">
      {/* LEFT: Public Navigation */}
      <div className="admin-nav-links">
        <NavLink to="/" className="admin-nav-link">
          Home
        </NavLink>
        <NavLink to="/about" className="admin-nav-link">
          About
        </NavLink>
        <NavLink to="/contact" className="admin-nav-link">
          Contact
        </NavLink>
      </div>

      {/* RIGHT: Admin Profile */}
      {/* RIGHT: Admin Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <ThemeToggle />
        <div className="admin-profile-menu" ref={dropdownRef}>
          <button
            className="profile-trigger"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className="profile-avatar">
              {getInitials(admin?.name)}
            </div>
          </button>

          {isOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <strong>{admin?.name || "Admin"}</strong>
                <span>{admin?.email}</span>
              </div>

              <button className="logout-btn" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
