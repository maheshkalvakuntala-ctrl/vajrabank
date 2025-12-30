import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/public.css"; // Ensure public styles are loaded here or globally if needed

export default function PublicLayout() {
    return (
        <div className="public-layout public-page">
            <Navbar />
            <main className="public-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
