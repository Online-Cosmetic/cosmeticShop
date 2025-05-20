import React, { useState, useRef } from 'react';
import {userAPI} from '../../utils/customAxios.js';

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
            <main className="flex-1 flex items-center justify-center bg-white py-16">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold text-center">비밀번호 찾기</h1>
                    {step === 1 && (
                        <form onSubmit={handleCheckUser} className="space-y-4">
                            <input name="userId" value={form.userId} onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border rounded-xl" placeholder="User ID" required />
                            <input name="email" value={form.email} onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border rounded-xl" placeholder="Email" required type="email" />
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl">확인</button>
                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div className="flex gap-2">
                                <input name="email" value={form.email} disabled className="w-full h-12 px-4 bg-slate-100 border rounded-xl" />
                                <button type="button" onClick={handleSendCode} className="py-2 px-3 bg-emerald-500 text-white rounded-xl" disabled={codeSent && !canResend}>
                                    {canResend ? '인증번호 재전송' : '이메일로 인증번호 받기'}
                                </button>
                            </div>
                            {codeSent && (
                                <>
                                    <input name="code" value={form.code} onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border rounded-xl" placeholder="인증번호 입력" required />
                                    <div className="text-xs text-gray-500 text-right">남은 시간: {formatTime(timer)}</div>
                                </>
                            )}
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl" disabled={!codeSent}>인증번호 확인</button>
                        </form>
                    )}
                    {step === 3 && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border rounded-xl" placeholder="새 비밀번호" required />
                            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full h-12 px-4 bg-slate-50 border rounded-xl" placeholder="새 비밀번호 확인" required />
                            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                            <button type="submit" className="w-full py-3 bg-black text-white rounded-xl" disabled={form.newPassword !== form.confirmPassword}>비밀번호 변경</button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
