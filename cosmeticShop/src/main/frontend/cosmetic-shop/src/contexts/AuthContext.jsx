import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 앱 시작시 로그인 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/auth/me');
                setUser(response.data.user);
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('accessToken');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // 로그인
    const login = async (credentials) => {
        try {
            const response = await axios.post('/auth/login', credentials);
            const { userId, role, accessToken } = response.data;

            if (response.data.errorMessage) {
                throw new Error(response.data.errorMessage);
            }

            localStorage.setItem('accessToken', accessToken);
            setUser({ userId, role });
            // Access token을 Authorization 헤더에 설정
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // 사용자 역할에 따른 리다이렉트
            if (role === 'ROLE_USER') {
                navigate('/user/mypage');
            } else if (role === 'ROLE_COMPANY') {
                navigate('/company/dashboard');
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
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(null);
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('accessToken');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    // 회원가입 - 일반 사용자
    const registerUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('/auth/signup/user', userData);
            navigate('/login', {
                state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
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
            const response = await axios.post('/auth/signup/company', companyData);
            navigate('/login', {
                state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
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