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
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center bg-white py-16">
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
                            className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
                            onClick={() => handleSocialLogin('google')}
                        >
                            Google로 로그인
                        </button>
                        <button
                            type="button"
                            className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600"
                            onClick={() => handleSocialLogin('naver')}
                        >
                            Naver로 로그인
                        </button>
                    </div>

                    <div className="text-right space-y-2">
                        <p className="text-sm">
                            Don't have an account?
                            <Link to="/signUp" className="text-base text-black hover:underline ml-2">Sign Up</Link>
                        </p>
                        <p className="text-sm">
                            Are you a business user?
                            <Link to="/enterprise/login" className="ml-2 hover:underline">Business Login</Link>
                        </p>
                        <p className="text-sm">
                            <Link to="/forgotPassword" className="ml-2 text-emerald-600 hover:underline">Forgot password?</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
