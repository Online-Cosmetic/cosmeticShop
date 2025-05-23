import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
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
