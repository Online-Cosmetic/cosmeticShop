// src/components/common/Header.jsx
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";

export default function Header() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderUserMenu = () => {
        if (!user) return null;

        if (user.role === 'ROLE_USER') {
            return (
                <nav className="border-b border-gray-300">
                    <div className="flex justify-end space-x-10 py-2 pr-6 text-gray-500">
                        <Link
                            to="/user/mypage"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-user mr-1"></i> My Page
                        </Link>
                        <Link
                            to="/user/cart"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-shopping-cart mr-1"></i> Cart
                        </Link>
                        <Link
                            to="/user/orders"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-history mr-1"></i> Order History
                        </Link>
                        <Link to="/qna">Q&A</Link>
                    </div>
                </nav>
            );
        }

        if (user.role === "ROLE_COMPANY") {
            return (
                <nav className="border-b border-gray-300">
                    <div className="flex justify-end space-x-10 py-2 pr-6 text-gray-500">
                        <Link
                            to="/company/dashboard"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                        </Link>
                        <Link
                            to="/company/product/register"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-plus-circle mr-1"></i> Add Product
                        </Link>
                        <Link
                            to="/company/products"
                            className="text-gray-700 hover:text-emerald-600"
                        >
                            <i className="fas fa-box mr-1"></i> Products
                        </Link>
                    </div>
                </nav>
            );
        }

        return null;
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* 로고 */}
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    CosMall
                </Link>

                {/* 기본 내비게이션 메뉴 */}
                <nav className="border-b border-gray-300">
                    <div className="flex justify-center space-x-10 py-2 text-xl">
                        <Link to="/" className="hover:text-emerald-600">
                            Home
                        </Link>
                        <Link to="/products/all" className="hover:text-emerald-600">
                            Products
                        </Link>
                        <Link to="/products/makeup" className="hover:text-emerald-600">
                            Makeup
                        </Link>
                        <Link to="/products/skincare" className="hover:text-emerald-600">
                            Skincare
                        </Link>
                        <Link to="/products/hair" className="hover:text-emerald-600">
                            Hair
                        </Link>
                        <Link to="/products/body" className="hover:text-emerald-600">
                            Body
                        </Link>
                    </div>
                </nav>

                {/* 사용자 상태별 메뉴 */}
                <div className="flex items-center space-x-6">
                    {renderUserMenu()}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700">Hello, {user.userId}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-50 transition"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/enterpriseLogin"
                                    className="px-4 py-2 border border-gray-700 text-gray-700 rounded-lg hover:text-emerald-600 transition"
                                >
                                    Business Login
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
