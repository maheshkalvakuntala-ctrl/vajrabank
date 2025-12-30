import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../styles/AdminLayout.css";
// import "../styles/admin.css"; // REMOVED: Caused conflicts and overflow issues


export default function AdminLayout() {
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        <AdminNavbar admin={admin} onLogout={handleLogout} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
