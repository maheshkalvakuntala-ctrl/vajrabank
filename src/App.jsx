import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/public.css";
import "./styles/ThemeVariables.css";
import "./styles/GlassTheme.css";

/* COMMON */
import PublicLayout from "./layouts/PublicLayout";
// Navbar and Footer are now inside PublicLayout

/* PUBLIC PAGES */
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";


/* ADMIN */
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminLayout from "./layouts/AdminLayout";

/* ADMIN PAGES */
import AdminProfile from "./pages/admin/Profile";
import Customers from "./pages/admin/Customers";
import Accounts from "./pages/admin/Accounts";
import AdminCards from "./pages/admin/Cards";
import AdminLoans from "./pages/admin/Loans";
import KYC from "./pages/admin/KYC";
import Reports from "./pages/admin/Reports";

/* USER */
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import Profile from "./pages/user/Profile";
import Transactions from "./pages/user/Transactions";
import Loans from "./pages/user/Loans";
import Cards from "./pages/user/Cards";
import Feedback from "./pages/user/Feedback";

import LoanCalculatorPage from "./pages/LoanCalculatorPage";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 🌍 PUBLIC ROUTES (LAYOUT BASED) */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/features/loan-calculator" element={<LoanCalculatorPage />} />
            </Route>

            {/* 🔐 ADMIN LOGIN (No Layout) */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* 🔐 ADMIN ROUTES (LAYOUT + PROTECTED) */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="customers" element={<Customers />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="cards" element={<AdminCards />} />
              <Route path="loans" element={<AdminLoans />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            {/* 👤 USER ROUTES (LAYOUT BASED) */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="loans" element={<Loans />} />
              <Route path="cards" element={<Cards />} />
              <Route path="feedback" element={<Feedback />} />
            </Route>

            {/* ❌ FALLBACK */}
            <Route
              path="*"
              element={<h2 style={{ padding: 40 }}>Page Not Found</h2>}
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
