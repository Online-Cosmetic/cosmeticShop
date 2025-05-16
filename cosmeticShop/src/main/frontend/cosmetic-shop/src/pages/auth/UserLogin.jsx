// src/pages/user/UserLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

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
                    <div className="text-right space-y-2">
                        <p className="text-sm">
                            Don't have an account?
                            <Link to="/signUp" className="text-base text-black hover:underline ml-2">Sign Up</Link>
                        </p>
                        <p className="text-sm">
                            Are you a business user?
                            <Link to="/enterpriseLogin" className="ml-2 hover:underline">Business Login</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
