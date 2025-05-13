import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function EnterpiseHeader() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/enterprise/overview");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
            <header className="w-full border-b border-gray-300">
                <div className="max-w-screen-xl px-12 py-4 flex items-center justify-between ">
                    <Link to="/enterprise/overview" className="text-2xl text-black">
                        cosMall Enterprise
                    </Link>
                    {isAuthenticated && (
                        <span className="text-gray-600">
                            Welcome, {user?.name || "Customer"}
                        </span>
                    )}
                </div>
            </header>
    );
}