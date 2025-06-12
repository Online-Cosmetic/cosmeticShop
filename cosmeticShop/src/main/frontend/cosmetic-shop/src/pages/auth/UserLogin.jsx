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
        <div className="w-full min-h-[80vh] bg-gradient-to-br from-slate-50 via-emerald-50 to-white">
            <main className="flex flex-grow items-center justify-center min-h-[80vh] px-4 py-12">
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* 왼쪽: 로그인 소개 섹션 */}
                        <div className="hidden md:flex flex-col justify-center">
                            <div className="mb-6">
                                <div className="h-20 w-20 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center rounded-2xl shadow-lg mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 mb-4">환영합니다</h2>
                                <p className="text-slate-600 mb-6">회원 로그인을 통해 다양한 화장품과 특별한 혜택을 만나보세요.</p>
                            </div>
                            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-xl">
                                <p className="text-teal-800 text-sm">
                                    "아름다움을 위한 가장 완벽한 선택, 지금 로그인하고 경험해 보세요."
                                </p>
                            </div>
                        </div>

                        {/* 오른쪽: 로그인 폼 */}
                        <div>
                            <div className="text-center mb-8 md:hidden">
                                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center rounded-xl mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">로그인</h1>
                                <p className="text-gray-500">계정에 로그인하여 쇼핑을 시작하세요</p>
                            </div>

                            <div className="md:hidden">
                                <h1 className="text-2xl font-bold text-gray-800 mb-4">로그인</h1>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">아이디</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            id="userId"
                                            name="userId"
                                            value={creds.userId}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
                                            placeholder="아이디를 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={creds.password}
                                            onChange={handleChange}
                                            className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors"
                                            placeholder="비밀번호를 입력하세요"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm text-center py-3 px-4 bg-red-50 rounded-lg border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium text-lg shadow-md"
                                >
                                    로그인
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            계정이 없으신가요?
                                        </p>
                                        <Link to="/signUp" className="text-teal-600 hover:underline font-medium block mt-1">
                                            회원가입
                                        </Link>
                                    </div>
                                    
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            비밀번호를 잊으셨나요?
                                        </p>
                                        <Link to="/forgotPassword" className="text-teal-600 hover:underline font-medium block mt-1">
                                            비밀번호 찾기
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="text-center mt-6">
                                    <p className="text-sm text-gray-600">
                                        기업 회원이신가요?
                                    </p>
                                    <Link to="/enterprise/login" className="text-teal-600 hover:underline font-medium block mt-1">
                                        기업 로그인
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}