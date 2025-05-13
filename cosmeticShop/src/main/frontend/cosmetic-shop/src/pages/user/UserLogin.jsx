import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function UserLogin() {

    const expectedRole = 'USER';

    const navigate = useNavigate();
    const { login } = useAuth();
    const [creds, setCreds] = useState({ userId: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreds((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            // 인증 API 호출 후 AuthContext 내 login 함수로 상태 업데이트
            // await login(creds, expectedRole);  이거 어떻게 꾸겨넣지..
            await login(creds);
            navigate("/"); // 상태가 업데이트되면 헤더도 변경됨
        } catch (err) {
            console.error(err);
            alert("로그인에 실패했습니다.");
        }
    };



    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow flex items-center justify-center bg-white py-16">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900 text-center">User Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* ID */}
                        <div>
                            <input
                                name="userId"
                                value={creds.userId}
                                onChange={handleChange}
                                type="text"
                                placeholder="User ID"
                                className="w-full h-12 px-4 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                name="password"
                                value={creds.password}
                                onChange={handleChange}
                                type="password"
                                placeholder="At least 8 characters"
                                className="w-full h-12 px-4 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
                        >
                            Log In
                        </button>
                    </form>

                    {/* 회원가입 / 기업회원 유도 */}
                    <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">
                            Don’t have an account?
                            <Link to="/signUp" className="text-base text-black hover:underline ml-2">Sign Up</Link>
                        </p>
                        <p className="text-sm text-gray-500">
                            Are you a business user?
                            <Link to="/enterpriseLogIn" className="text-base text-black hover:underline ml-2">Business Login</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default UserLogin;