import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignupForm = () => {
    const navigate = useNavigate();
    const { registerUser, registerCompany, error: authError, loading, isAuthenticated, user } = useAuth();

    const [userType, setUserType] = useState('user');
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
        passwordConfirm: '',
        email: '',
        nickName: '',
        companyName: '',
        phoneNumber: '',
    });
    const [error, setError] = useState('');

    // 인증 에러 감지
    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);


    // 이미 로그인한 사용자는 적절한 페이지로 리다이렉트
    if (isAuthenticated) {
        if (user.role === 'ROLE_USER') {
            return <Navigate to="/user/mypage" replace />;
        } else if (user.role === 'ROLE_COMPANY') {
            return <Navigate to="/company" replace />;
        }
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        // 비밀번호 일치 여부만 확인
        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }

        // 이메일 유효성 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return false;
        }

        if (userType === 'user') {
            if (!formData.userId || !formData.nickName) {
                setError('모든 필수 항목을 입력해주세요.');
                return false;
            }
            // 아이디 유효성 검사
            if (formData.userId.length < 4) {
                setError('아이디는 4자 이상이어야 합니다.');
                return false;
            }
        } else {
            if (!formData.companyName || !formData.phoneNumber) {
                setError('모든 필수 항목을 입력해주세요.');
                return false;
            }
            // 전화번호 유효성 검사
            const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
            if (!phoneRegex.test(formData.phoneNumber)) {
                setError('전화번호 형식이 올바르지 않습니다. (예: 02-123-4567)');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            if (userType === 'user') {
                await registerUser({
                    userId: formData.userId,
                    password: formData.password,
                    email: formData.email,
                    nickName: formData.nickName,
                });
            } else {
                await registerCompany({
                    companyName: formData.companyName,
                    password: formData.password,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                });
            }
        } catch (err) {
            // 에러 처리는 AuthContext에서 처리됨
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        회원가입
                    </h2>
                </div>

                <div className="flex justify-center space-x-4 mb-4">
                    <button
                        type="button"
                        onClick={() => {
                            setUserType('user');
                            setError('');
                        }}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md ${
                            userType === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        일반 회원
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setUserType('company');
                            setError('');
                        }}
                        disabled={loading}
                        className={`px-4 py-2 rounded-md ${
                            userType === 'company'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        기업 회원
                    </button>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {userType === 'user' ? (
                            <>
                                <div>
                                    <label htmlFor="userId" className="sr-only">아이디</label>
                                    <input
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="아이디 (4자 이상)"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="nickName" className="sr-only">닉네임</label>
                                    <input
                                        id="nickName"
                                        name="nickName"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="닉네임"
                                        value={formData.nickName}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="companyName" className="sr-only">기업명</label>
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="기업명"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="sr-only">전화번호</label>
                                    <input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="tel"
                                        required
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="전화번호 (예: 02-123-4567)"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label htmlFor="email" className="sr-only">이메일</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="이메일"
                                value={formData.email}
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="passwordConfirm" className="sr-only">비밀번호 확인</label>
                            <input
                                id="passwordConfirm"
                                name="passwordConfirm"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="비밀번호 확인"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
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
                            {loading ? '가입 중...' : '가입하기'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="font-medium text-blue-600 hover:text-blue-500"
                            disabled={loading}
                        >
                            이미 계정이 있으신가요? 로그인
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;