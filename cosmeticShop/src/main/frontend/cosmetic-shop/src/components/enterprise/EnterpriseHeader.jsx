import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../utils/customAxios";

export default function EnterpiseHeader() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // authAPI.logout 함수 사용 (직접 API 호출)
            await authAPI.logout(); // 이 함수가 내부적으로 emitter.emit('auth:logout')을 호출
            // 로컬 스토리지 정리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            navigate("/enterpriseLogin");
        } catch (error) {
            console.error("로그아웃 실패:", error);
            navigate("/enterpriseLogin");
        }
    };

    // 기업 회원 확인 및 리다이렉트
    React.useEffect(() => {
        if (isAuthenticated && user?.role !== 'ROLE_COMPANY') {
            // 일반 회원이 기업 페이지에 접근하면 홈페이지로 리다이렉트
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <header className="w-full border-b border-neutral-200">
            <div className="max-w-screen-xl px-12 py-4 flex items-center justify-between">
                <Link to="/company/dashboard" className="text-2xl text-black">
                    cosMall Enterprise
                </Link>
                {isAuthenticated && user?.role === 'ROLE_COMPANY' ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">
                            환영합니다, {user.username || user.userId}님
                        </span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/enterpriseLogin"
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
}