import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bell, BellFill, Check2All } from "react-bootstrap-icons";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, limit } from "firebase/firestore";
import { userDB } from "../firebaseUser";
import "../styles/AdminNavbar.css";

export default function AdminNavbar({ admin, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Admin Notifications
  useEffect(() => {
    const q = query(
      collection(userDB, "notifications"),
      where("role", "==", "admin"),
      where("read", "==", false),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(userDB, "notifications", notifId), {
        read: true
      });
      setShowNotifications(false);
      navigate("/admin/dashboard"); // Navigate to dashboard where approvals are
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllRead = async () => {
    try {
      const batchPromises = notifications.map(n =>
        updateDoc(doc(userDB, "notifications", n.id), { read: true })
      );
      await Promise.all(batchPromises);
      setShowNotifications(false);
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

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
        {/* <NavLink to="/" className="admin-nav-link">
          Home
        </NavLink>
        <NavLink to="/about" className="admin-nav-link">
          About
        </NavLink>
        <NavLink to="/contact" className="admin-nav-link">
          Contact
        </NavLink> */}
        <h1>Welcome to Admin panel👋</h1>
      </div>

      {/* RIGHT: Notifications & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* NOTIFICATIONS */}
        <div className="admin-notif-wrapper" ref={notifRef}>
          <button
            className="notif-trigger"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', display: 'flex', alignItems: 'center' }}
          >
            {notifications.length > 0 ? <BellFill style={{ color: '#3b82f6' }} /> : <Bell />}
            {notifications.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#ef4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
              }}>
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="profile-dropdown" style={{ right: 0, width: '320px', padding: '0' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: 'white' }}>Notifications</strong>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check2All /> Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                    No new requests
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                      <p style={{ margin: '0 0 4px 0', color: '#e2e8f0', fontSize: '13px' }}>{notif.message}</p>
                      <span style={{ color: '#64748b', fontSize: '11px' }}>
                        {notif.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
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
