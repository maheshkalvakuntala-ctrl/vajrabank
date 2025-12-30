import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/UserNavbar.css";

export default function UserNavbar({ user, onLogout }) {
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
            : "US";
    };

    return (
        <nav className="user-navbar">
            {/* LEFT: Public Navigation */}
            <div className="user-nav-links">
                <NavLink to="/" className="user-nav-link">Home</NavLink>
                <NavLink to="/about" className="user-nav-link">About</NavLink>
                <NavLink to="/contact" className="user-nav-link">Contact</NavLink>
            </div>

            {/* RIGHT: User Profile */}
            {/* RIGHT: User Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <ThemeToggle />
                <div className="user-profile-menu" ref={dropdownRef}>
                    <button className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
                        <div className="profile-avatar">{getInitials(user?.name)}</div>
                    </button>

                    {isOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-user-info">
                                <strong>{user?.name || "User"}</strong>
                                <span>{user?.email}</span>
                            </div>
                            <button className="logout-btn" onClick={onLogout}>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
