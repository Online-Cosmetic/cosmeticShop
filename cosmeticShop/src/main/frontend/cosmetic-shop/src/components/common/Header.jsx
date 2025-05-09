import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const { isAuthenticated, logout } = useAuth();
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
            <nav className="flex justify-end border-b border-gray-300">
                <div className="flex space-x-10 py-2 pr-6 text-gray-500">
                    {isAuthenticated ? (
                        <>
                            <button onClick={handleLogout} className="hover:underline">
                                Log Out
                            </button>
                            <Link to="/myPage">My Page</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/logIn">LogIn</Link>
                            <Link to="/signUp">Sign Up</Link>
                            <Link to="/enterpriseLogIn">Enterprise LogIn</Link>
                        </>
                    )}
                    <span>Cart</span>
                    <span>Q&A</span>
                </div>
            </nav>
            {/* 하단 내비게이션 영역은 그대로 유지 */}
            <nav className="container mx-auto flex items-center justify-between py-4 px-6 border-b border-gray-300">
                <Link to="/" className="text-2xl text-black">
                    cosMall
                </Link>
                <div className="flex space-x-4 text-gray-500">
                    <Link to="/detail" className="no-underline">
                        Category
                    </Link>
                    <Link to="/event" className="no-underline">
                        Event
                    </Link>
                    <Link to="/faq" className="no-underline">
                        FAQ
                    </Link>
                </div>
            </nav>
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