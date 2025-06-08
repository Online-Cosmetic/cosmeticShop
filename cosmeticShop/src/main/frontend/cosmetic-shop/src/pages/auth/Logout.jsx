// export default Logout;
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/customAxios.js';
import {useAuth} from "../../contexts/AuthContext.jsx";

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