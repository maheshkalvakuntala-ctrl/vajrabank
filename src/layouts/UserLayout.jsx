import { Outlet, useNavigate } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../context/AuthContext";
import "../styles/UserLayout.css";

export default function UserLayout() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/"); // Redirect to home on logout
  };

  return (
    <div className="user-layout">
      <UserSidebar />
      <div className="user-main">
        <UserNavbar user={user} onLogout={handleLogout} />
        <main className="user-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
