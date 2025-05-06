// import { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
//
// const ACCESS_TOKEN_KEY = "accessToken";
// const AUTH_HEADER = "Authorization";
//
// export const AuthContext = createContext();
//
// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

  // // 앱 최초 로드 시 로컬스토리지 토큰이 있으면 자동 로그인 처리
  // useEffect(() => {
  //   const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  //   if (token) {
  //     axios.defaults.headers.common[AUTH_HEADER] = `Bearer ${token}`;
  //     setIsAuthenticated(true);
  //   }
  // }, []);

//   // 로그인: 토큰 저장 + Axios 헤더 셋팅 + 상태 업데이트
//   const login = async (username, password) => {
//     const res = await axios.post("/api/auth/login", { username, password });
//     const token = res.data.accessToken;
//     localStorage.setItem(ACCESS_TOKEN_KEY, token);
//     axios.defaults.headers.common[AUTH_HEADER] = `Bearer ${token}`;
//     setIsAuthenticated(true);
//   };
//
//   // 로그아웃: 서버 호출(쿠키 삭제) + 로컬 스토리지 클리어 + 상태 업데이트
//   const logout = async () => {
//     await axios.post("/api/auth/logout");
//     localStorage.removeItem(ACCESS_TOKEN_KEY);
//     delete axios.defaults.headers.common[AUTH_HEADER];
//     setIsAuthenticated(false);
//   };
//
//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
//
// // 커스텀 훅: AuthContext에 쉽게 접근할 수 있도록 제공
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth는 AuthProvider 내에서만 사용되어야 합니다.");
//   }
//   return context;
// }

// import { createContext, useState, useEffect, useContext } from "react";
// import axios from "axios";
//
// const ACCESS_TOKEN_KEY = "accessToken";
// const REFRESH_TOKEN_KEY = "refreshToken";
// const AUTH_HEADER = "Authorization";
//
// export const AuthContext = createContext();
//
// export function AuthProvider({ children }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//
//     // 로그인: Access, Refresh 토큰 모두 저장
//     const login = async (username, password) => {
//         const res = await axios.post("/api/auth/login", { username, password });
//         const { accessToken, refreshToken } = res.data;
//         localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
//         localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
//         axios.defaults.headers.common[AUTH_HEADER] = `Bearer ${accessToken}`;
//         setIsAuthenticated(true);
//     };
//
//     // 로그아웃: localStorage의 Access 토큰 삭제 후, 저장된 Refresh 토큰으로 백엔드 로그아웃 API 호출
//     const logout = async () => {
//         try {
//             const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";
//             await axios.post("/api/auth/logout", { refreshToken });
//         } catch (error) {
//             console.error("로그아웃 API 호출 중 오류 발생:", error);
//         } finally {
//             localStorage.removeItem(ACCESS_TOKEN_KEY);
//             localStorage.removeItem(REFRESH_TOKEN_KEY);
//             delete axios.defaults.headers.common[AUTH_HEADER];
//             setIsAuthenticated(false);
//         }
//     };
//
//     return (
//         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }
//
// // 커스텀 훅: AuthContext에 쉽게 접근할 수 있도록 제공
// export function useAuth() {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth는 AuthProvider 내에서만 사용되어야 합니다.");
//     }
//     return context;
// }

import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_HEADER = "Authorization";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 앱 최초 로드시, localStorage에 Access 토큰이 존재하면 인증 상태로 설정
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            axios.defaults.headers.common[AUTH_HEADER] = `Bearer ${token}`;
            setIsAuthenticated(true);
        }
    }, []);

    // 로그인: Access, Refresh 토큰 모두 저장 후, 인증 상태 업데이트
    const login = async (username, password) => {
        const res = await axios.post("/api/auth/login", { username, password });
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        axios.defaults.headers.common[AUTH_HEADER] = `Bearer ${accessToken}`;
        setIsAuthenticated(true);
    };

    // 로그아웃: 로컬 스토리지의 토큰 삭제 후, 백엔드 API 호출
    const logout = async () => {
        try {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";
            await axios.post("/api/auth/logout", { refreshToken });
        } catch (error) {
            console.error("로그아웃 API 호출 중 오류 발생:", error);
        } finally {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            delete axios.defaults.headers.common[AUTH_HEADER];
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 인증 컨텍스트에 쉽게 접근할 수 있도록 제공하는 커스텀 훅
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth는 AuthProvider 내에서만 사용되어야 합니다.");
    }
    return context;
}