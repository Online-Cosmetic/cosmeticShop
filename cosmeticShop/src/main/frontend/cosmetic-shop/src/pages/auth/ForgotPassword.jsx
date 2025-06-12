import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../utils/customAxios.js';

export default function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ userId: '', email: '', code: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [timer, setTimer] = useState(180);
    const [canResend, setCanResend] = useState(false);
    const timerRef = useRef(null);

    // 타이머 시작
    const startTimer = () => {
        setTimer(180);
        setCanResend(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // 1단계: ID, 이메일 확인
    const handleCheckUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await userAPI.profile.checkUser({
                userId: form.userId, 
                email: form.email 
            });
            if (res.data.exists) {
                setStep(2);
            } else {
                setError('일치하는 회원 정보가 없습니다.');
            }
        } catch {
            setError('서버 오류가 발생했습니다.');
        }
    };

    // 2단계: 인증번호 발송
    const handleSendCode = async () => {
        setError('');
        try {
            await userAPI.profile.sendCode( {
                userId: form.userId,
                email: form.email
            });
            setCodeSent(true);
            startTimer();
        } catch {
            setError('인증번호 발송에 실패했습니다.');
        }
    };

    // 2단계: 인증번호 확인
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await userAPI.profile.verifyCode({
                userId: form.userId,
                code: form.code
            });
            if (res.data.verified) {
                setStep(3);
                clearInterval(timerRef.current);
            } else {
                setError('인증번호가 올바르지 않습니다.');
            }
        } catch {
            setError('서버 오류가 발생했습니다.');
        }
    };

    // 3단계: 비밀번호 변경
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        if (form.newPassword !== form.confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            await userAPI.profile.changePassword({
                userId: form.userId,
                newPassword: form.newPassword
            });
            alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.');
            window.location.href = '/login';
        } catch {
            setError('비밀번호 변경에 실패했습니다.');
        }
    };

    // 입력값 변경 핸들러
    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    // 타이머 표시
    const formatTime = sec => `${Math.floor(sec / 60)}:${('0' + (sec % 60)).slice(-2)}`;

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-white py-16 px-4">
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                        {/* 왼쪽: 단계 표시 (모바일에서는 위쪽) */}
                        <div className="md:col-span-2 flex md:flex-col justify-center items-center md:items-start gap-6 md:gap-10 py-4 md:py-0 md:border-r md:border-gray-200 md:pr-10">
                            <div className="text-center md:text-left mb-0 md:mb-6">
                                <div className="mx-auto md:mx-0 h-16 w-16 bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center rounded-xl mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h2>
                                <p className="text-gray-500 hidden md:block">계정 정보를 확인하고 비밀번호를 재설정하세요</p>
                            </div>

                            <div className="flex md:flex-col gap-6 justify-around w-full">
                                {[
                                    { step: 1, title: "계정 확인" },
                                    { step: 2, title: "인증하기" },
                                    { step: 3, title: "비밀번호 변경" }
                                ].map((s) => (
                                    <div key={s.step} className="flex flex-col items-center md:flex-row md:items-center gap-2 md:gap-3">
                                        <div 
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                s.step === step 
                                                    ? 'bg-teal-600 text-white' 
                                                    : s.step < step 
                                                        ? 'bg-teal-100 text-teal-600 border border-teal-600' 
                                                        : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {s.step}
                                        </div>
                                        <span className={`text-xs md:text-sm ${s.step === step ? 'font-medium text-teal-700' : 'text-gray-500'}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽: 단계별 폼 */}
                        <div className="md:col-span-3">
                            {step === 1 && (
                                <form onSubmit={handleCheckUser} className="space-y-6">
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
                                                value={form.userId} 
                                                onChange={handleChange} 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors" 
                                                placeholder="아이디를 입력하세요" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                </svg>
                                            </div>
                                            <input 
                                                id="email"
                                                name="email" 
                                                value={form.email} 
                                                onChange={handleChange} 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors" 
                                                placeholder="가입시 등록한 이메일" 
                                                required 
                                                type="email" 
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
                                        className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium text-lg shadow-md mt-2"
                                    >
                                        다음
                                    </button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleVerifyCode} className="space-y-6">
                                    <div>
                                        <label htmlFor="email-display" className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                </div>
                                                <input 
                                                    id="email-display"
                                                    name="email" 
                                                    value={form.email} 
                                                    disabled 
                                                    className="w-full h-12 pl-10 pr-4 bg-gray-100 border border-gray-300 rounded-xl text-gray-500" 
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={handleSendCode} 
                                                className={`py-2 px-4 rounded-xl text-white font-medium shadow-md ${
                                                    codeSent && !canResend 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 transition-all'
                                                }`} 
                                                disabled={codeSent && !canResend}
                                            >
                                                {canResend ? '재전송' : codeSent ? '재전송' : '인증번호 받기'}
                                            </button>
                                        </div>
                                    </div>

                                    {codeSent && (
                                        <div>
                                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <input 
                                                    id="code"
                                                    name="code" 
                                                    value={form.code} 
                                                    onChange={handleChange} 
                                                    className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors" 
                                                    placeholder="인증번호 6자리" 
                                                    required 
                                                />
                                            </div>
                                            <div className="text-xs text-gray-500 text-right mt-2">
                                                남은 시간: <span className={`font-medium ${timer < 30 ? 'text-red-500' : 'text-teal-600'}`}>{formatTime(timer)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="text-red-500 text-sm text-center py-3 px-4 bg-red-50 rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(1)} 
                                            className="w-full md:w-auto py-2 px-4 mb-3 md:mb-0 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            이전
                                        </button>
                                        <button 
                                            type="submit" 
                                            className={`w-full md:w-auto md:float-right py-2 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium shadow-md ${!codeSent && 'opacity-50 cursor-not-allowed'}`} 
                                            disabled={!codeSent}
                                        >
                                            다음
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">새 비밀번호</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input 
                                                id="newPassword"
                                                name="newPassword" 
                                                type="password" 
                                                value={form.newPassword} 
                                                onChange={handleChange} 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors" 
                                                placeholder="새 비밀번호 입력" 
                                                required 
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 ml-2">8자 이상, 영문+숫자+특수문자 조합</p>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input 
                                                id="confirmPassword"
                                                name="confirmPassword" 
                                                type="password" 
                                                value={form.confirmPassword} 
                                                onChange={handleChange} 
                                                className="w-full h-12 pl-10 pr-4 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition-colors" 
                                                placeholder="비밀번호 확인" 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 text-sm text-center py-3 px-4 bg-red-50 rounded-lg border border-red-100">
                                            {error}
                                        </div>
                                    )}

                                    <div className="pt-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setStep(2)} 
                                            className="w-full md:w-auto py-2 px-4 mb-3 md:mb-0 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            이전
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="w-full md:w-auto md:float-right py-2 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium shadow-md"
                                        >
                                            비밀번호 변경
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}