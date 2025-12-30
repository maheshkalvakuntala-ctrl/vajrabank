import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import "../styles/UserSidebar.css";

export default function UserSidebar() {
  const { currentUser } = useCurrentUser();

  return (
    <aside className="user-sidebar">
      <div>
        <div className="sidebar-brand">
          <h2>SecureBank</h2>
          <p>Welcome, {currentUser ? currentUser.firstName : "User"}</p>
        </div>

        <ul className="sidebar-menu">
          <li><NavLink to="/user/dashboard">Dashboard</NavLink></li> <br></br>
          <li><NavLink to="/user/profile">Profile</NavLink></li> <br></br>
          <li><NavLink to="/user/transactions">Transactions</NavLink></li> <br></br>
          <li><NavLink to="/user/loans">Loans</NavLink></li> <br></br>
          <li><NavLink to="/user/cards">Credit Cards</NavLink></li> <br></br>
          <li><NavLink to="/user/feedback">Feedback</NavLink></li> <br></br>
        </ul>
      </div>


    </aside>

  );

}
