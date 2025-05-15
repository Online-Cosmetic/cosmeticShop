// // src/pages/logout/Logout.jsx
// import { useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext.jsx";
//
// function Logout() {
//     const { logout } = useAuth();
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const performLogout = async () => {
//             try {
//                 await logout();
//                 navigate("/");
//             } catch (error) {
//                 console.error("Logout failed:", error);
//                 navigate("/");
//             }
//         };
//         performLogout();
//     }, [logout, navigate]);
//
//     return <div className="p-4">Logging out...</div>;
// }
//
// export default Logout;
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/customAxios';
import {useAuth} from "../../context/AuthContext.jsx";

const Logout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        // 서버 쪽 로그아웃 요청 (에러는 콘솔에 출력)
        customAxios.post('/api/auth/logout').catch((error) => {
            console.error('일반회원 로그아웃 에러:', error);
        });
        // AuthContext를 통해 토큰과 관련 상태 정리
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return null;
};

export default Logout;