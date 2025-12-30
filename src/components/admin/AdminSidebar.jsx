import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      {/* Logo / Title */}
      <div className="sidebar-header">
        <h2>BankAdmin</h2>
        <span className="subtitle">Admin Portal</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink to="/admin" end className="nav-item">
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className="nav-item">
          Customers
        </NavLink>

        <NavLink to="/admin/accounts" className="nav-item">
          Accounts
        </NavLink>

        <NavLink to="/admin/cards" className="nav-item">
          Cards
        </NavLink>

        <NavLink to="/admin/transactions" className="nav-item">
          Transactions
        </NavLink>

        <NavLink to="/admin/loans" className="nav-item">
          Loans
        </NavLink>

        <NavLink to="/admin/reports" className="nav-item">
          Reports
        </NavLink>
      </nav>

      {/* Admin Info */}
      <div className="sidebar-footer">
        <div className="admin-info">
          <strong>{user?.name || "Admin User"}</strong>
          <p>{user?.email || "admin@vajra.com"}</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
