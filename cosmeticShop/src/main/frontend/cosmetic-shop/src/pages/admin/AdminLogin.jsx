// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/customAxios';  // adminAPI를 authAPI로 변경

export default function AdminLogin() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !password) {
            setError('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // 일반 로그인 API 사용
            const response = await authAPI.login({
                userId,
                password,
                role: 'ROLE_ADMIN'  // ROLE_ 접두사 추가
            });

            // 응답 처리
            if (response.data.accessToken) {
                // 토큰 저장
                localStorage.setItem('accessToken', response.data.accessToken);
                
                // 사용자 정보 저장
                const userData = {
                    userId: response.data.userId,
                    role: response.data.role,
                    // 관리자는 이메일과 이름이 없을 수 있으므로 조건부로 추가
                    ...(response.data.email && { email: response.data.email }),
                    ...(response.data.username && { username: response.data.username })
                };
                localStorage.setItem('user', JSON.stringify(userData));
                
                // 관리자 대시보드로 이동
                navigate('/admin/main');
            } else {
                setError('로그인에 실패했습니다. 응답에 토큰이 없습니다.');
            }
        } catch (err) {
            console.error('관리자 로그인 실패:', err);
            if (err.response?.status === 403) {
                setError('관리자 계정이 아닙니다.');
            } else {
                setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 나머지 JSX 코드는 그대로 유지
    return (
        // 기존 코드 유지
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">관리자 로그인</h2>
                </div>
                
                {error && (
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="user-id" className="sr-only">아이디</label>
                            <input
                                id="user-id"
                                name="userId"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="관리자 아이디"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}