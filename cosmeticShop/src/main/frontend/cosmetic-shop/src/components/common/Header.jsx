// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderUserMenu = () => {
        if (!user) return null;

        if (user.role === 'ROLE_USER') {
            return (
                <div className="flex items-center space-x-4">
                    <Link to="/user/mypage" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-user mr-1"></i> My Page
                    </Link>
                    <Link to="/user/cart" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-shopping-cart mr-1"></i> Cart
                    </Link>
                    <Link to="/user/orders" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-history mr-1"></i> Order History
                    </Link>
                </div>
            );
        }

        if (user.role === 'ROLE_COMPANY') {
            return (
                <div className="flex items-center space-x-4">
                    <Link to="/company/dashboard" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                    </Link>
                    <Link to="/company/product/register" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-plus-circle mr-1"></i> Add Product
                    </Link>
                    <Link to="/company/products" className="text-gray-700 hover:text-emerald-600">
                        <i className="fas fa-box mr-1"></i> Products
                    </Link>
                </div>
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
                <nav className="space-x-6">
                    <Link to="/" className="hover:text-emerald-600">
                        Home
                    </Link>
                    <Link to="/products" className="hover:text-emerald-600">
                        Products
                    </Link>
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
                                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 transition"
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