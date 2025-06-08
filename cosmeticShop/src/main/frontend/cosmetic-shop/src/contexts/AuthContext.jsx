import React, {createContext, useContext, useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {authAPI} from '../utils/customAxios';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 앱 시작시 토큰 확인
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // 토큰이 있다면 저장된 사용자 정보 복원
                const savedUser = JSON.parse(localStorage.getItem('user'));
                if (savedUser) {
                    setUser(savedUser);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    // 사용자 정보 갱신이 필요한 경우 호출
    const refreshUserInfo = async () => {
        try {
            const response = await authAPI.me();
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error('Failed to refresh user info:', error);
            // 토큰이 유효하지 않은 경우
            if (error.response?.status === 401) {
                logout();
            }
        }
    };

    // 로그인
    const login = async (credentials) => {
        try {
            setLoading(true);
            // AJAX 요청임을 명시하는 헤더 추가 (리다이렉트 방지)
            const response = await authAPI.login(credentials);
            const {userId, role, accessToken, email, username} = response.data;

            if (response.data.errorMessage) {
                throw new Error(response.data.errorMessage);
            }

            const userData = {userId, role, email, username};
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', username);
            setUser(userData);

            // 사용자 역할에 따른 리다이렉트
            if (role === 'ROLE_USER') {
                navigate('/user/mypage');
            } else if (role === 'ROLE_COMPANY') {
                navigate('/enterprise/dashboard');
            } else {
                navigate('/');
            }

            return response.data;
        } catch (error) {
            if (error.response?.status === 403) {
                throw new Error(error.response.data.errorMessage || '잘못된 로그인 페이지입니다.');
            }
            console.error('Login failed:', error);
            setError(error.response?.data?.message || '로그인에 실패했습니다.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃 처리를 위한 헬퍼 함수 (모든 로그아웃 상황에서 공통으로 사용)
    const performLocalLogout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
    };

    // 로그아웃 함수
    const logout = async () => {
        // 현재 사용자 역할 저장 (리다이렉트에 사용)
        const currentRole = user?.role;

        // 로컬 스토리지 정리 (먼저 수행)
        performLocalLogout();

        try {
            // API 호출 (성공 여부와 관계없이 사용자는 이미 로그아웃됨)
            await authAPI.logout();
        } catch (error) {
            console.error('백엔드 로그아웃 API 호출 실패:', error);
            // 실패해도 프론트엔드에서는 이미 로그아웃 처리됨
        } finally {
            // 사용자 역할에 따른 리다이렉트
            if (currentRole === 'ROLE_COMPANY') {
                navigate('/enterpriseLogin');
            } else {
                navigate('/login');
            }
        }
    };

    // 회원가입 - 일반 사용자
    const registerUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.signup.user(userData);
            navigate('/login', {
                state: {message: '회원가입이 완료되었습니다. 로그인해주세요.'}
            });
            return response.data;
        } catch (err) {
            console.error('User registration failed:', err);
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 회원가입 - 기업 사용자
    const registerCompany = async (companyData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authAPI.signup.company(companyData);
            // 리다이렉트 경로 수정 - 기업용 로그인 페이지로 이동
            navigate('/enterpriseLogin', {
                state: {message: '회원가입이 완료되었습니다. 로그인해주세요.'}
            });
            return response.data;
        } catch (err) {
            console.error('Company registration failed:', err);
            setError(err.response?.data?.message || '회원가입에 실패했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 권한 확인
    const hasRole = (requiredRole) => {
        return user?.role === requiredRole;
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        registerUser,
        registerCompany,
        hasRole,
        refreshUserInfo,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;