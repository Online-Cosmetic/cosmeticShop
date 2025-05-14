import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function UserHeader() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header>
            {/* #1 nav */}
            <nav className="border-b border-gray-300">
                <div className="flex justify-end space-x-10 py-2 pr-6 text-gray-500">
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleLogout} className="hover:underline">Log Out</button>
                            <Link to="/myPage">My Page</Link>
                        </>
                    ) : (
                        <Link to="/logIn">Log In</Link>
                    )}

                    <Link to="/cart">Cart</Link>
                    <Link to="/qna">Q&A</Link>
                </div>
            </nav>
            {/* #2 nav */}
            <nav className="w-full border-b border-gray-300">
                <div className="max-w-screen-xl mx-auto px-16 flex items-center justify-between py-4">
                    <Link to="/" className="text-xl text-black">
                        cosMall
                    </Link>
                    {isAuthenticated && (
                        <span className="text-gray-600">
                            Welcome, {user?.name || "Customer"}
                        </span>
                    )}
                </div>
            </nav>
            {/* #3 nav */}
            <nav className="border-b border-gray-300">
                <div className="flex justify-center space-x-10 py-2 text-xl">
                    <span>Makeup</span>
                    <span>Skincare</span>
                    <span>Hair</span>
                    <span>Body</span>
                </div>
            </nav>
        </header>
    );
}