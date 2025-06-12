// src/pages/signUp/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

function SignUp() {
    const navigate = useNavigate();
    const { registerUser } = useAuth();
    const [form, setForm] = useState({
        userId: "",
        password: "",
        username: "",
        age: "",
        gender: "MALE",
        nickName: "",
        email: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setError("");

        // 해당 필드의 오류 하이라이트 제거
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(field => field !== name));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerUser({
                userId: form.userId,
                password: form.password,
                username: form.username,
                age: Number(form.age),
                gender: form.gender,
                nickName: form.nickName,
                email: form.email,
            });

            // 회원가입 성공 시 감사 페이지로 이동
            navigate('/thanks-for-signup');
        } catch (err) {
            console.error('Signup error:', err);

            // 백엔드에서 전송된 오류 메시지 확인
            if (err.response && err.response.data) {
                // 백엔드에서 반환된 오류 메시지가 문자열인 경우 직접 사용
                const errorMessage = err.response.data;

                // 특정 오류 메시지에 따라 필드 하이라이트
                if (errorMessage.includes("아이디")) {
                    highlightField("userId");
                } else if (errorMessage.includes("닉네임")) {
                    highlightField("nickName");
                } else if (errorMessage.includes("이메일")) {
                    highlightField("email");
                }

                setError(errorMessage);
            } else if (err.message === "Network Error") {
                setError("네트워크 연결에 문제가 발생했습니다. 인터넷 연결을 확인해주세요.");
            } else {
                setError("회원가입에 실패했습니다. 입력 정보를 확인하거나 잠시 후 다시 시도해주세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 오류가 발생한 필드를 시각적으로 표시
    const [errorFields, setErrorFields] = useState([]);

    const highlightField = (fieldName) => {
        setErrorFields([fieldName]);
        // 3초 후 하이라이트 제거
        setTimeout(() => {
            setErrorFields([]);
        }, 3000);
    };

    const getFieldClass = (fieldName) => {
        const baseClass = "w-full h-12 px-4 bg-slate-50/80 border rounded-xl focus:ring-2";
        if (errorFields.includes(fieldName)) {
            return `${baseClass} border-red-500 focus:ring-red-400 animate-pulse`;
        }
        return `${baseClass} focus:ring-teal-400`;
    };

    return (
        <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-white py-10 px-4">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* 왼쪽: 회원가입 소개 섹션 (데스크톱에서만 표시) */}
                    <div className="hidden md:flex flex-col justify-center">
                        <div className="mb-6">
                            <div className="h-20 w-20 bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center rounded-2xl shadow-lg mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">회원가입</h2>
                            <p className="text-slate-600 mb-6">코스몰의 회원이 되어 다양한 혜택과 서비스를 경험해보세요.</p>
                        </div>
                        <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-6 rounded-xl">
                            <h3 className="text-teal-800 font-medium mb-2">회원 혜택</h3>
                            <ul className="text-teal-700 text-sm space-y-2">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    신규 가입 특별 할인 쿠폰
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    구매 금액의 2% 적립
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    정기적인 회원 전용 이벤트
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 오른쪽: 회원가입 폼 */}
                    <div>
                        <div className="text-center md:text-left mb-8">
                            <div className="mx-auto md:mx-0 h-16 w-16 bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center rounded-xl mb-4 md:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">회원가입</h1>
                            <p className="text-gray-500 mb-6 md:hidden">계정을 만들고 쇼핑을 시작하세요</p>
                        </div>

                        {/* 오류 메시지 표시 섹션 */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-red-600 font-medium">회원가입 실패</span>
                                </div>
                                <p className="text-red-500 mt-1 ml-7">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-1 md:col-span-2">
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
                                        type="text"
                                        placeholder="아이디를 입력하세요"
                                        className={`${getFieldClass("userId")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
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
                                        value={form.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        className={`${getFieldClass("password")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="이름을 입력하세요"
                                        className={`${getFieldClass("username")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="nickName" className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        id="nickName"
                                        name="nickName"
                                        value={form.nickName}
                                        onChange={handleChange}
                                        type="text"
                                        placeholder="닉네임을 입력하세요"
                                        className={`${getFieldClass("nickName")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">나이</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="age"
                                        name="age"
                                        value={form.age}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="나이를 입력하세요"
                                        className={`${getFieldClass("age")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className={`${getFieldClass("gender")} pl-10 pr-10 text-gray-700 appearance-none`}
                                        required
                                    >
                                        <option value="MALE">남성</option>
                                        <option value="FEMALE">여성</option>
                                    </select>
                                    {/* 화살표 아이콘 */}
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
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
                                        type="email"
                                        placeholder="이메일을 입력하세요"
                                        className={`${getFieldClass("email")} pl-10`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all font-medium text-lg shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? '처리 중...' : '회원가입'}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-8 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                이미 계정이 있으신가요?
                                <Link to="/login" className="text-teal-600 hover:underline ml-2 font-medium">로그인하기</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;