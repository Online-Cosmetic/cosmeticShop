import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";

function UserLogin() {
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
            await login(creds);
            navigate("/"); // 상태가 업데이트되면 헤더도 변경됨
        } catch (err) {
            console.error(err);
            alert("로그인에 실패했습니다.");
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">User Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="userId"
                            value={creds.userId}
                            onChange={handleChange}
                            type="text"
                            placeholder="User ID"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            name="password"
                            value={creds.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800"
                        >
                            Log In
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UserLogin;