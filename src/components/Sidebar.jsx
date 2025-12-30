import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";

export default function Sidebar() {

  return (
    <aside className="admin-sidebar">
      <div>
        {/* HEADER */}
        <div className="admin-sidebar-header">
          <h2>BankAdmin</h2>
          <p>Admin Dashboard</p>
        </div>

        {/* MENU */}
        <ul className="admin-sidebar-menu">
          <li><NavLink to="dashboard">Dashboard</NavLink></li>
          <li><NavLink to="profile">Profile</NavLink></li>
          <li><NavLink to="customers">Customers</NavLink></li>
          <li><NavLink to="accounts">Accounts</NavLink></li>
          <li><NavLink to="cards">Cards</NavLink></li>
          <li><NavLink to="loans">Loans</NavLink></li>
          <li><NavLink to="kyc">KYC</NavLink></li>
          <li><NavLink to="reports">Reports</NavLink></li>
        </ul>
      </div>
    </aside>
  );
}
