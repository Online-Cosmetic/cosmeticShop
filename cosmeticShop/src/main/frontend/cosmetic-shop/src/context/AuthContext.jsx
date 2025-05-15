// // import React, { createContext, useContext, useState, useEffect } from "react";
// // // import axios from "axios";
// // //
// // // export const AuthContext = createContext();
// // //
// // // export const AuthProvider = ({ children }) => {
// // //     const [isAuthenticated, setIsAuthenticated] = useState(false);
// // //
// // //     // 로그인 함수
// // //     const login = async (credentials) => {
// // //         try {
// // //             const res =
// // //                 await axios.post("/api/auth/login", credentials);
// // //             // if (!role || role.toUpperCase() !== role) {
// // //             //     alert('해당 로그인 페이지에서 로그인할 수 없는 계정입니다.');
// // //             //     return;
// // //             // }
// // //             if (res.status === 200) {
// // //                 setIsAuthenticated(true);
// // //             }
// // //         } catch (error) {
// // //             console.error("Login error:", error);
// // //             throw error;
// // //         }
// // //     };
// // //
// // //     // 로그아웃 함수
// // //     const logout = async () => {
// // //         try {
// // //             await axios.post("/api/auth/logout", { refreshToken: "your-refresh-token" });
// // //             setIsAuthenticated(false);
// // //         } catch (error) {
// // //             console.error("Logout error:", error);
// // //             throw error;
// // //         }
// // //     };
// // //
// // //     // 애플리케이션 초기 로드시 인증 상태 확인 (옵션)
// // //     useEffect(() => {
// // //         // 예: 토큰이 있다면 setIsAuthenticated(true) 등을 구현
// // //     }, []);
// // //
// // //     return (
// // //         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
// // //             {children}
// // //         </AuthContext.Provider>
// // //     );
// // // };
// // //
// // // export const useAuth = () => useContext(AuthContext);
//
// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from '../utils/customAxios.js'; // withCredentials: true 설정된 axios 인스턴스
//
// export const AuthContext = createContext({
//     user: null,
//     role: null,
//     loading: true,
//     login: async () => {},
//     logout: async () => {},
//     hasRole: () => false,
// });
//
// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [role, setRole] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     // 1) 앱 시작 시 현재 로그인된 사용자 정보 확인
//     useEffect(() => {
//         const fetchCurrentUser = async () => {
//             try {
//                 const res = await axios.get('/api/auth/me', { withCredentials: true });
//                 // { user: { userId, username, role, ... } }
//                 setUser(res.data.user);
//                 setRole(res.data.user.role);
//             } catch (err) {
//                 // 로그인 안 된 상태
//                 setUser(null);
//                 setRole(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchCurrentUser();
//     }, []);
//
//     // 2) 로그인 함수
//     const login = async (userId, password) => {
//         const res = await axios.post(
//             '/api/auth/login',
//             { userId, password },
//             { withCredentials: true }
//         );  // 로그인 후 HTTP-only 쿠키에 토큰이 세팅됨
//         // 로그인 응답에 user 정보가 포함되어야 합니다 :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
//         const { userId: id, role, accessToken } = res.data;
//         setUser({ userId: id });       // 필요하다면 username 등 추가 필드 포함
//         setRole(role);
//
//         axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//         return res;
//     };
//
//     // 3) 로그아웃 함수
//     const logout = async () => {
//         await axios.post('/api/auth/logout', {}, { withCredentials: true });
//         setUser(null);
//         setRole(null);
//     };
//
//     // 4) 역할 검증 헬퍼
//     const hasRole = (requiredRole) => {
//         return role === requiredRole;
//     };
//
//     return (
//         <AuthContext.Provider
//             value={{ user, role, loading, login, logout, hasRole }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };
//
// // Hook으로 간편하게 사용
// export const useAuth = () => useContext(AuthContext);

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 앱 시작시 로그인 상태 확인
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            checkAuthStatus();
        } else {
            setLoading(false);
        }
    }, []);

    // 현재 인증 상태 확인
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
            setError(null);
        } catch (err) {
            setUser(null);
            localStorage.removeItem('accessToken');
        } finally {
            setLoading(false);
        }
    };

    // 로그인
    const login = async (userId, password) => {
        try {
            setLoading(true);
            const response = await axios.post('/auth/login', { userId, password });
            const { accessToken, ...userData } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            setUser(userData);
            setError(null);
            
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            setLoading(true);
            await axios.post('/auth/logout');
        } catch (err) {
            console.error('로그아웃 중 오류:', err);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
            setLoading(false);
        }
    };

    // 회원가입 - 일반 사용자
    const registerUser = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('/auth/signup/user', userData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 회원가입 - 기업 사용자
    const registerCompany = async (companyData) => {
        try {
            setLoading(true);
            const response = await axios.post('/auth/signup/company', companyData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
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

// 커스텀 훅
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
    }
    return context;
};

export default AuthContext;

