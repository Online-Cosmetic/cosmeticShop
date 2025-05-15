// import { useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import customAxios from '../../utils/customAxios';
// import { AuthContext } from '../../context/AuthContext';
//
// const EnterpriseLogout = () => {
//     const navigate = useNavigate();
//     const { logout } = useContext(AuthContext);
//
//     useEffect(() => {
//         // 기업회원 로그아웃 엔드포인트 호출
//         customAxios.post('/api/auth/logout').catch((error) => {
//             console.error('기업회원 로그아웃 에러:', error);
//         });
//         // 인증 상태 초기화
//         logout();
//         navigate('/enterpriseLogin');
//     }, [logout, navigate]);
//
//     return null;
// };
//
// export default EnterpriseLogout;
// src/components/enterprise/EnterpriseLogout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import customAxios from '../../utils/customAxios.js';

export default function EnterpriseLogout() {
    const { logout } = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        // 서버 로그아웃 호출 (refresh-cookie 제거)
        customAxios.post('/api/auth/logout').finally(async () => {
            await logout();
            nav('/enterprise/login');
        });
    }, [logout, nav]);

    return null;
}
