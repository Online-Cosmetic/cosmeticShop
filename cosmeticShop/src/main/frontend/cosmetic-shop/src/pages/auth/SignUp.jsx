// src/pages/signUp/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const baseClass = "w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2";
        if (errorFields.includes(fieldName)) {
            return `${baseClass} border-red-500 focus:ring-red-400 animate-pulse`;
        }
        return `${baseClass} focus:ring-emerald-400`;
    };

    return (
        <>
            <div className="flex items-center justify-center bg-white">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl text-center font-bold text-gray-900">Create your
                        Account</h1>
                    
                    {/* 오류 메시지 표시 섹션 */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-600 font-medium">회원가입 실패</span>
                            </div>
                            <p className="text-red-500 mt-1 ml-7">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            type="text"
                            placeholder="ID"
                            className={getFieldClass("userId")}
                            required
                        />
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className={getFieldClass("password")}
                            required
                        />
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            type="text"
                            placeholder="User Name"
                            className={getFieldClass("username")}
                            required
                        />
                        <input
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            type="number"
                            placeholder="Age"
                            className={getFieldClass("age")}
                            required
                        />
                        <div className="relative">
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={`${getFieldClass("gender")} pr-10 text-gray-700 appearance-none`}
                                required
                            >
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                            {/* 화살표 아이콘 */}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                ▼
                            </div>
                        </div>
                        <input
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Nick Name"
                            className={getFieldClass("nickName")}
                            required
                        />
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            className={getFieldClass("email")}
                            required
                        />
                        
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
                            disabled={loading}
                        >
                            {loading ? "처리 중..." : "Sign Up"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;