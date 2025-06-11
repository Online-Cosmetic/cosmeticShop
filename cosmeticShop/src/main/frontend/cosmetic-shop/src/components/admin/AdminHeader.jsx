import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../utils/customAxios";

export default function AdminHeader() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            navigate("/"); // 쇼핑몰 홈페이지로 이동
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="w-full border-b border-neutral-200">
            <div className="w-full px-12 py-4 flex items-center justify-between">
                <Link to="/admin/main" className="text-2xl text-black">
                    cosMall Admin
                </Link>
                {isAuthenticated && (
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        로그아웃
                    </button>
                )}
            </div>
        </header>
    );
}