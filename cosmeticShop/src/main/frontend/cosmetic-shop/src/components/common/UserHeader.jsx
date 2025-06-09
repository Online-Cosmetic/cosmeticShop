// src/components/common/Header.jsx
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {authAPI, emitter} from "../../utils/customAxios.js";

export default function UserHeader() {
    const {user} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authAPI.logout(); // 이 함수가 내부적으로 emitter.emit('auth:logout')을 호출
            // 로컬 스토리지 정리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            // 로그인 페이지로 이동
            navigate('/login');
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // 상단 메뉴 렌더링 (로그인/비로그인 상태에 따라 다른 메뉴 표시)
    const renderTopMenu = () => {
        if (user) {
            if (user.role === "ROLE_COMPANY") {
                // 기업 회원이 일반 페이지에 접근하면 기업 대시보드로 리다이렉트
                navigate('/enterprise/dashboard');
                return null;
            }

            // 로그인 상태일 때 표시할 메뉴
            return (
                <div className="flex items-center space-x-6">
                    <Link to="/user/mypage" className="text-gray-700 hover:text-emerald-600">
                        My Page
                    </Link>
                    <Link to="/user/cart" className="text-gray-700 hover:text-emerald-600">
                        Cart
                    </Link>
                    <Link to="/qna" className="text-gray-700 hover:text-emerald-600">
                        Q&A
                    </Link>
                    <span className="text-gray-700">Hello, {user.userId}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Logout
                    </button>
                </div>
            );
        } else {
            // 비로그인 상태일 때 표시할 메뉴
            return (
                <div className="flex items-center space-x-6">
                    <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                        Login
                    </Link>
                    <Link to="/signup" className="text-gray-700 hover:text-emerald-600">
                        Sign Up
                    </Link>
                    <Link to="/qna" className="text-gray-700 hover:text-emerald-600">
                        Q&A
                    </Link>
                    <Link
                        to="/enterprise/login"
                        className="px-4 py-2 border border-gray-700 text-gray-700 rounded-lg hover:text-emerald-600 transition"
                    >
                        Business Login
                    </Link>
                </div>
            );
        }
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
                    {renderTopMenu()}
                </div>
            </div>
        </header>
    );
}