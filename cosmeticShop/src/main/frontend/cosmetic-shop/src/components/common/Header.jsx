// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Header() {
    const { user, role, loading, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="w-full bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* 로고 또는 사이트명 */}
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    CosMall
                </Link>

                {/* 내비게이션 메뉴 */}
                <nav className="space-x-6">
                    <Link to="/" className="hover:text-emerald-600">
                        Home
                    </Link>
                    <Link to="/products" className="hover:text-emerald-600">
                        Products
                    </Link>
                    {role === 'ADMIN' && (
                        <Link to="/admin" className="hover:text-emerald-600">
                            Admin
                        </Link>
                    )}
                    {role === 'COMPANY' && (
                        <Link to="/enterprise/dashboard" className="hover:text-emerald-600">
                            Enterprise
                        </Link>
                    )}
                </nav>

                {/* 인증 상태에 따른 우측 버튼 */}
                <div className="flex items-center space-x-4">
                    {loading ? (
                        <span>Loading...</span>
                    ) : user ? (
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
                                to="/signUp"
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
        </header>
    );
}
