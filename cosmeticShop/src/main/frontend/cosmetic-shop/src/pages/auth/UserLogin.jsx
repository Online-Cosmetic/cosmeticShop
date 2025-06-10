// src/pages/user/UserLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

// const OAUTH2_REDIRECT_URI = 'http://localhost:9000/oauth2/authorization';

export default function UserLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [creds, setCreds] = useState({ userId: '', password: '', role: 'ROLE_USER' });
    const [error, setError] = useState('');

    const handleChange = e => {
        const { name, value } = e.target;
        setCreds(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await login(creds);
            if (response.success) {
                navigate('/');
            } else {
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.status === 403) {
                setError('일반 회원 전용 로그인 페이지입니다. 기업 회원은 기업 로그인을 이용해주세요.');
            } else {
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        }
    };

    // 소셜 로그인 버튼 클릭 시 백엔드 OAuth2 엔드포인트로 이동
    const handleSocialLogin = provider => {
        window.location.href = `${OAUTH2_REDIRECT_URI}/${provider}`;
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <main className="flex flex-grow items-center justify-center">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold text-center">User Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="userId"
                            value={creds.userId}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            placeholder="User ID"
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            value={creds.password}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            placeholder="Password"
                            required
                        />
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <button type="submit" className="w-full py-3 bg-black text-white rounded-xl">
                            Log In
                        </button>
                    </form>
                    
                    {/* 소셜 로그인 버튼 추가 */}
                    <div className="flex flex-col gap-2 mt-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="flex items-center justify-center w-full py-3 px-4 border border-[#747775] rounded-xl bg-white text-[#1f1f1f] font-medium text-sm hover:shadow-md transition"
                        >
                            {/* Google 아이콘 */}
                            <svg
                                className="w-5 h-5 mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            Sign in with Google
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('naver')}
                            style={{ backgroundColor: '#03C75A' }}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-white font-medium text-sm hover:shadow-md transition"
                        >
                            {/* Naver 아이콘 */}
                            <svg
                                className="w-6 h-6 mr-3"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="2 4 14 16"
                            >
                                <rect width="24" height="24" rx="4" fill="#03C75A" />
                                <path
                                    d="M8 8h2.5l3.5 4.5V8H16v8h-2.5l-3.5-4.5V16H8V8z"
                                    fill="white"
                                />
                            </svg>
                            Sign in with Naver
                        </button>
                    </div>

                    <div className="text-right space-y-2">
                        <p className="text-sm">
                            Don't have an account?
                            <Link to="/signUp" className="text-base hover:underline ml-2">Sign Up</Link>
                        </p>
                        <p className="text-sm">
                            Are you a business user?
                            <Link to="/enterprise/login" className="text-base hover:underline ml-2">Business Login</Link>
                        </p>
                        <p className="pt-2 text-sm">
                            <Link to="/forgotPassword" className="ml-2 text-emerald-600 hover:underline">Forgot password?</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
