import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 로그인 함수
    const login = async (credentials) => {
        try {
            const res = await axios.post("/api/auth/login", credentials);
            // if (!role || role.toUpperCase() !== role) {
            //     alert('해당 로그인 페이지에서 로그인할 수 없는 계정입니다.');
            //     return;
            // }
            if (res.status === 200) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            await axios.post("/api/auth/logout", { refreshToken: "your-refresh-token" });
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
            throw error;
        }
    };

    // 애플리케이션 초기 로드시 인증 상태 확인 (옵션)
    useEffect(() => {
        // 예: 토큰이 있다면 setIsAuthenticated(true) 등을 구현
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);