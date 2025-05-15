import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignupForm = () => {
    const navigate = useNavigate();
    const { registerUser, registerCompany } = useAuth();
    
    const [userType, setUserType] = useState('user'); // 'user' or 'company'
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
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.passwordConfirm) {
            setError('비밀번호가 일치하지 않습니다.');
            return false;
        }
        
        if (userType === 'user') {
            if (!formData.userId || !formData.password || !formData.email || !formData.nickName) {
                setError('모든 필수 항목을 입력해주세요.');
                return false;
            }
        } else {
            if (!formData.companyName || !formData.password || !formData.email || !formData.phoneNumber) {
                setError('모든 필수 항목을 입력해주세요.');
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

        setLoading(true);

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
            
            navigate('/login', { 
                state: { message: '회원가입이 완료되었습니다. 로그인해주세요.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
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
                        onClick={() => setUserType('user')}
                        className={`px-4 py-2 rounded-md ${
                            userType === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        일반 회원
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType('company')}
                        className={`px-4 py-2 rounded-md ${
                            userType === 'company'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
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
                                        placeholder="아이디"
                                        value={formData.userId}
                                        onChange={handleChange}
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
                                        placeholder="전화번호"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
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