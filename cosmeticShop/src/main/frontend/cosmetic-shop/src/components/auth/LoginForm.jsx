import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error: authError, loading, isAuthenticated, user } = useAuth();

    // 이미 로그인한 사용자는 적절한 페이지로 리다이렉트
    if (isAuthenticated) {
        if (user.role === 'ROLE_USER') {
            return <Navigate to="/user/mypage" replace />;
        } else if (user.role === 'ROLE_COMPANY') {
            return <Navigate to="/company" replace />;
        }
        return <Navigate to="/" replace />;
    }

    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });
    const [error, setError] = useState('');

    // 회원가입 완료 메시지 표시
    useEffect(() => {
        if (location.state?.message) {
            setError(location.state.message);
            // 메시지를 표시한 후 state 초기화
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // 인증 에러 감지
    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 입력 시작하면 에러 메시지 초기화
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData);
        } catch (err) {
            // 에러 처리는 AuthContext에서 처리됨
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        로그인
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="userId" className="sr-only">아이디</label>
                            <input
                                id="userId"
                                name="userId"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="아이디"
                                value={formData.userId}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className={`text-sm text-center ${
                            error.includes('완료') ? 'text-green-600' : 'text-red-500'
                        }`}>
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => navigate('/signup')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                                disabled={loading}
                            >
                                회원가입
                            </button>
                        </div>
                        <div className="text-sm">
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="font-medium text-blue-600 hover:text-blue-500"
                                disabled={loading}
                            >
                                비밀번호 찾기
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;