// src/pages/logIn/userLogin.jsx
import React, { useState } from "react";
import {useNavigate, Link, redirect} from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

function UserLogin() {
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ userId: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreds((c) => ({ ...c, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/auth/login",
            {
                    userId: creds.userId,
                    password: creds.password
                });
            // const token = res.data.accessToken;
            // localStorage.setItem("accessToken", token);
            // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            navigate("/");
            window.location.reload(); // 윈도우 창 수동 새로고침
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
                    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
                    <div className="space-y-4">
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
                        <div className="text-right">
                            <Link className="text-sm text-gray-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <div className="text-right">
                            <Link to="/signUp" className="text-sm text-gray-500 hover:underline">
                                Don't Have Account?
                            </Link>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800"
                    >
                        Log In
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default UserLogin;
