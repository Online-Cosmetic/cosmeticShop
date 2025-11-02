// src/components/common/Header.jsx
import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../contexts/AuthContext.jsx";
import {authAPI, emitter} from "../../utils/customAxios.js";
import { Bars3Icon } from "@heroicons/react/24/outline";


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
            localStorage.removeItem('nickName');
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
                        마이페이지
                    </Link>
                    <Link to="/user/cart" className="text-gray-700 hover:text-emerald-600">
                        장바구니
                    </Link>
                    <Link to="/qna" className="text-gray-700 hover:text-emerald-600">
                        문의하기
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        로그아웃
                    </button>
                </div>
            );
        } else {
            // 비로그인 상태
            return (
                <div className="flex items-center space-x-6">
                    <Link to="/login" className="text-gray-700 hover:text-emerald-600">
                        로그인
                    </Link>
                    <Link to="/signup" className="text-gray-700 hover:text-emerald-600">
                        회원가입
                    </Link>
                    <Link to="/qna" className="text-gray-700 hover:text-emerald-600">
                        문의하기
                    </Link>
                    <Link
                        to="/enterprise/login"
                        className="px-4 py-2 border border-gray-700 text-gray-700 rounded-lg hover:text-emerald-600 transition"
                    >
                        기업 로그인
                    </Link>
                </div>
            );
        }
    };

    return (
        <header className="w-full bg-white shadow-md">
            {/* 첫째줄 */}
            <section className="border-b border-gray-400">
                {/* 사용자 상태별 메뉴 */}
                <div className="container mx-auto px-10 py-2 flex justify-end">
                    {renderTopMenu()}
                </div>
            </section>
            {/* 둘째줄 */}
            <section className="border-b border-gray-400">
                <div className="container mx-auto px-6 py-4 relative flex items-center justify-between">
                    {/* 좌측: 로고 */}
                    <div className="flex items-center space-x-4 z-10">
                        <Link to="/" className="text-2xl font-bold text-gray-800">
                            CosMall
                        </Link>
                    </div>

                    {/* 우측: 사용자 인사말 */}
                    {user && (
                        <div className="flex items-center">
                            <span className="text-gray-700 font-medium">안녕하세요, {user.nickname} 님</span>
                        </div>
                    )}
                </div>
            </section>
            {/* 셋째줄 */}
            <section>
                <nav>
                    <div className="flex justify-end py-2 px-10 text-lg relative">
                        {/* 드롭다운 메뉴 */}
                        <Link
                            to="/products/all"
                            className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition text-sm font-semibold"
                        >
                            쇼핑하러 가기 →
                        </Link>
    {/*                    <div className="relative group flex items-center space-x-1 cursor-pointer">*/}
    {/*                        <Bars3Icon className="w-5 h-5 text-gray-700" />*/}
    {/*                        <span className="px-2 py-2 rounded text-gray-700 hover:text-emerald-600 font-semibold">*/}
    {/*    Categories*/}
    {/*</span>*/}

    {/*                        <div className="absolute top-full -translate-x-5 left-0 mt-2 w-56 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50">*/}
    {/*                            <Link to="/products/all" className="block px-4 py-2 hover:bg-emerald-50">All</Link>*/}
    {/*                            <Link to="/products/makeup" className="block px-4 py-2 hover:bg-emerald-50">Makeup</Link>*/}
    {/*                            <Link to="/products/skincare" className="block px-4 py-2 hover:bg-emerald-50">Skincare</Link>*/}
    {/*                            <Link to="/products/hair" className="block px-4 py-2 hover:bg-emerald-50">Hair</Link>*/}
    {/*                            <Link to="/products/body" className="block px-4 py-2 hover:bg-emerald-50">Body</Link>*/}
    {/*                        </div>*/}
    {/*                    </div>*/}
                    </div>
                </nav>
            </section>
        </header>
    );
}