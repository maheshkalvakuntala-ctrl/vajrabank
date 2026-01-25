import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  List,
  X,
  BoxArrowRight,
  Grid,
  Person,
  ShieldCheck,
  House,
  Envelope,
  InfoCircle,
  Gem
} from "react-bootstrap-icons";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./common/NotificationBell";
import "../styles/NewNavbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin/dashboard";
    if (user.role === 'partner') return "/partner/dashboard";
    return "/user/dashboard";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="premium-nav">
      {/* Brand Logo */}
      <Link to="/" className="nav-brand">
        <div className="brand-logo">
          <ShieldCheck size={20} />
        </div>
        <div className="brand-name">
          VAJRA<span>BANK</span>
        </div>
      </Link>

      {/* Desktop Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <House size={16} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <InfoCircle size={16} /> About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Envelope size={16} /> Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/partner-plans" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}>
            <Gem size={16} /> Partner Plans
          </NavLink>
        </li>
      </ul>

      {/* Right Side Actions */}
      <div className="nav-actions">
        {user ? (
          <>
            {(user.role === 'admin') && (
              <NotificationBell user={user} />
            )}
            <div className="position-relative" ref={profileRef}>
              <div className="nav-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="profile-info d-none d-md-flex">
                  <span className="profile-name">{user.name || user.fullName || "User"}</span>
                  <span className="profile-role">{user.role}</span>
                </div>
                <div className="profile-avatar">
                  {getInitials(user.name || user.fullName || user.email)}
                </div>
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="profile-dropdown-menu" style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '220px',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                  zIndex: 1001,
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setIsProfileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#f8fafc',
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s'
                  }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    <Grid size={16} /> Dashboard
                  </Link>
                  <Link to="/user/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#f8fafc',
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s'
                  }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    <Person size={16} /> My Profile
                  </Link>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '8px 0' }}></div>
                  <button onClick={handleLogout} className="dropdown-item" style={{
                    width: '100%', border: 'none', background: 'transparent', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#ef4444',
                    borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.05)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}>
                    <BoxArrowRight size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn nav-btn-outline d-none d-md-flex">
              Sign In
            </Link>
            <Link to="/signup" className="nav-btn nav-btn-primary">
              Get Started
            </Link>
          </>
        )}

        {/* Mobile Toggle */}
        <button className="nav-mobile-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <List size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Overlay) */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" style={{
          position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 32, 0.98)', backdropFilter: 'blur(10px)',
          zIndex: 999, padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '24px'
        }}>
          <NavLink to="/" className="nav-link-item" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
          <NavLink to="/about" className="nav-link-item" onClick={() => setIsMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" className="nav-link-item" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/partner-plans" className="nav-link-item" onClick={() => setIsMenuOpen(false)}>Partner Plans</NavLink>
          {!user && (
            <Link to="/login" className="nav-btn nav-btn-primary" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}

