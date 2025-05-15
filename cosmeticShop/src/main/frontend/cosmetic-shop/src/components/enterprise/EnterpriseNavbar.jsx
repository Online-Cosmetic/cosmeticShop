// // // EnterpriseNavbar.jsx
// // import React, { useContext } from 'react';
// // import { AuthContext } from '../../context/AuthContext'; // 전역 상태 관리 Context 예시
// // import EnterpriseLogout from "./EnterpriseLogout.jsx";
// //
// // const EnterpriseNavbar = () => {
// //     // const { authState, setAuthState } = useContext(AuthContext);
// //     const { user } = useContext(AuthContext);
// //     // const navigate = useNavigate();
// //
// //     const handleLogout = EnterpriseLogout();
// //     //     async () => {
// //     //     try {
// //     //         // 백엔드 로그아웃 엔드포인트 호출 (필요 시 LogoutRequest 객체 형태에 맞춰 수정)
// //     //         await axios.post('/api/auth/logout', { refreshToken: authState.refreshToken });
// //     //         // 전역 상태 초기화 이후 홈페이지(또는 로그인 페이지)로 리다이렉트
// //     //         setAuthState({ isLoggedIn: false, role: null, refreshToken: null });
// //     //         navigate('/login');
// //     //     } catch (error) {
// //     //         console.error('Logout 실패:', error);
// //     //     }
// //     // };
// //
// //     // 로그인 응답 헤더의 "ROLE" 값을 추출해 비교 (존재하지 않으면 undefined)
// //     // const enterpriseRole = user.hasRole() === 'COMPANY';
// //     const enterpriseRole = user.role;
// //
// //     // 기업회원 로그인 상태일 때만 네비게이션 바에 Enterprise Logout 만 보이게 함
// //     // if (authState.isLoggedIn && enterpriseRole === 'COMPANY') {
// //     if (enterpriseRole === 'COMPANY') {
// //         return (
// //             <nav>
// //                 <button onClick={handleLogout}>Enterprise Logout</button>
// //             </nav>
// //         );
// //     }
// //
// //
// //     // 그 외의 경우 기존 네비게이션 혹은 다른 컴포넌트 렌더링
// //     return (
// //         <nav>
// //             {/* 기본 네비게이션 메뉴 */}
// //             <a href="/">Home</a>
// //             <a href="/about">About</a>
// //         </nav>
// //     );
// // };
// //
// // export default EnterpriseNavbar;
//
// // src/components/enterprise/EnterpriseNavbar.jsx
// import React from 'react';
// import { useAuth } from '../../context/AuthContext.jsx';
// import { useNavigate } from 'react-router-dom';
//
// const EnterpriseNavbar = () => {
//     const { role, logout } = useAuth();
//     const navigate = useNavigate();
//
//     const handleLogout = async () => {
//         await logout();
//         navigate('/enterprise/login');
//     };
//
//     // Context의 role이 'COMPANY'일 때만 렌더
//     if (role === 'COMPANY') {
//         return (
//             <nav>
//                 <button onClick={handleLogout}>Enterprise Logout</button>
//             </nav>
//         );
//     }
//
//     // 일반 사용자/비로그인 시 기본 네비게이션
//     return (
//         <nav>
//             <a href="/frontend/cosmetic-shop/public"> Home </a>
//             <a href="/about"> About </a>
//         </nav>
//     );
// };
//
// export default EnterpriseNavbar;
// src/components/enterprise/EnterpriseNavbar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseNavbar() {
    const { role, logout } = useAuth();
    const nav = useNavigate();

    const onLogout = async () => {
        await logout();
        nav('/enterprise/login');
    };

    return (
        <nav className="p-4 bg-white shadow">
            {role === 'COMPANY' ? (
                <button onClick={onLogout} className="text-red-500">
                    Enterprise Logout
                </button>
            ) : (
                <>
                    <a href="/" className="mr-4">Home</a>
                    <a href="/about">About</a>
                </>
            )}
        </nav>
    );
}

