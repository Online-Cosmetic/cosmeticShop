import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../../utils/customAxios";

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

    const inputClass =
        "w-full h-12 px-4 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // authAPI 사용 (리다이렉트 방지)
            await authAPI.signup.company({
                userId: form.userId,
                password: form.password,
                companyName: form.companyName,
                email: form.email,
                phoneNumber: form.phoneNumber
            });

            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            navigate("/enterpriseLogin");
        } catch (err) {
            console.error("회원가입 오류:", err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("회원가입에 실패했습니다. 입력 정보를 확인해주세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="w-[816px] bg-white rounded-[30px] p-12 shadow-md">
                    {/* 헤더 */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-semibold text-gray-900">Sign Up 👋</h1>
                        <p className="text-2xl text-slate-700 mt-4">
                            Your seller journey starts here.
                        </p>
                    </div>

                    {/* 회원가입 폼 */}
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-gray-900 text-base block mb-2">ID</label>
                            <input
                                name="userId"
                                value={form.userId}
                                onChange={handleChange}
                                type="text"
                                placeholder="User ID"
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-base block mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="At least 8 characters"
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-base block mb-2">
                                Company Name
                            </label>
                            <input
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                type="text"
                                placeholder="ex) CosMall Co."
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-base block mb-2">
                                Business Email
                            </label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                type="email"
                                placeholder="example@email.com"
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-gray-900 text-base block mb-2">
                                Business Phone Number
                            </label>
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                type="tel"
                                placeholder="+82 2-123-4567 or 010-1234-5678"
                                className={inputClass}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-emerald-500 text-white text-xl font-medium rounded-xl hover:bg-emerald-600 transition"
                            disabled={loading}
                        >
                            {loading ? "처리 중..." : "Sign Up"}
                        </button>

                        <div className="text-center mt-4">
                            <span className="text-slate-700 mr-1">Already have an account?</span>
                            <Link
                                to="/enterpriseLogin"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </div>
                    </form>

                    {/* 푸터 */}
                    <div className="text-center text-gray-500 text-sm mt-10">
                        © 2025 CosMall, LLC. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
}

export default EnterpriseSignUp;