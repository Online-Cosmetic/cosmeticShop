import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../utils/customAxios";
import Footer from "../../components/common/Footer.jsx";

function EnterpriseSignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userId: "",
        password: "",
        companyName: "",
        email: "",
        phoneNumber: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    // 오류가 발생한 필드를 시각적으로 표시
    const [errorFields, setErrorFields] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
        
        // 해당 필드의 오류 하이라이트 제거
        if (errorFields.includes(name)) {
            setErrorFields(prev => prev.filter(field => field !== name));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setErrorFields([]);

        try {
            // authAPI 사용 (리다이렉트 방지)
            await authAPI.signup.company({
                userId: form.userId,
                password: form.password,
                companyName: form.companyName,
                email: form.email,
                phoneNumber: form.phoneNumber
            });

            // 회원가입 성공 시 감사 페이지로 이동
            navigate("/thanks-for-enterprise-signup");
        } catch (err) {
            console.error("회원가입 오류:", err);

            // 백엔드에서 전송된 오류 메시지 확인
            if (err.response && err.response.data) {
                // 백엔드에서 반환된 오류 메시지가 문자열인 경우 직접 사용
                const errorMessage = err.response.data;
                
                // 특정 오류 메시지에 따라 필드 하이라이트
                if (errorMessage.includes("아이디")) {
                    highlightField("userId");
                } else if (errorMessage.includes("전화번호")) {
                    highlightField("phoneNumber");
                } else if (errorMessage.includes("이메일")) {
                    highlightField("email");
                } else if (errorMessage.includes("회사")) {
                    highlightField("companyName");
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
    
    // 필드 하이라이트 함수
    const highlightField = (fieldName) => {
        setErrorFields(prev => [...prev, fieldName]);
        // 3초 후 하이라이트 제거
        setTimeout(() => {
            setErrorFields(prev => prev.filter(field => field !== fieldName));
        }, 3000);
    };
    
    // 입력 필드 클래스 결정 함수
    const getFieldClass = (fieldName) => {
        const baseClass = "w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2";
        if (errorFields.includes(fieldName)) {
            return `${baseClass} border-red-500 focus:ring-red-400 animate-pulse`;
        }
        return `${baseClass} focus:ring-emerald-400`;
    };

    return (
        <>
            <header className="w-full border-b border-neutral-200">
                <div className="max-w-screen-xl px-12 py-4 flex items-center justify-between">
                    <Link to="/company/dashboard" className="text-2xl text-black">
                        cosMall Enterprise
                    </Link>
                </div>
            </header>
            <div className="flex justify-center items-center bg-gray-100 py-6">
                <div className="w-[700px] bg-white rounded-[30px] my-8 px-8 py-16 shadow-md">
                    {/* 헤더 */}
                    <div className="mb-12 text-center">
                        <h1 className="text-3xl font-semibold text-gray-900">Sign Up</h1>
                        <p className="text-xl text-slate-700 mt-4">
                            Your seller journey starts here.
                        </p>
                    </div>

                    {/* 오류 메시지 표시 섹션 - 상단에 배치 */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-600 font-medium">회원가입 실패</span>
                            </div>
                            <p className="text-red-500 mt-1 ml-7">{error}</p>
                        </div>
                    )}

                    {/* 회원가입 폼 */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-gray-900 text-sm block mb-2">ID</label>
                            <input
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                type="text"
                                placeholder="User ID"
                                className={getFieldClass("userId")}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-sm block mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="At least 8 characters"
                                className={getFieldClass("password")}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-sm block mb-2">
                                Company Name
                            </label>
                            <input
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                type="text"
                                placeholder="ex) CosMall Co."
                                className={getFieldClass("companyName")}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-sm block mb-2">
                                Business Email
                            </label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="example@email.com"
                                className={getFieldClass("email")}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-sm block mb-2">
                                Business Phone Number
                            </label>
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                type="tel"
                                placeholder="+82 2-123-4567 or 010-1234-5678"
                                className={getFieldClass("phoneNumber")}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full h-14 bg-emerald-500 text-white text-lg font-medium rounded-xl hover:bg-emerald-600"
                            disabled={loading}
                        >
                            {loading ? "처리 중..." : "Sign Up"}
                        </button>

                        <div className="text-right mt-10">
                            <span className="text-slate-700 mr-1">Already have an account?</span>
                            <Link
                                to="/enterprise/login"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* 푸터 */}
            <Footer/>
        </>
    );
}

export default EnterpriseSignUp;