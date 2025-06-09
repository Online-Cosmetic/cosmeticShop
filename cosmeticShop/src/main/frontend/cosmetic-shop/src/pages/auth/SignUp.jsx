// src/pages/signUp/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";

function SignUp() {
    useNavigate();
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || "회원가입에 실패했습니다.");
        }
    };

    return (
        <>
            <div className="flex items-center justify-center bg-white">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl text-center font-bold text-gray-900">Create your
                        Account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            type="text"
                            placeholder="ID"
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            type="text"
                            placeholder="User Name"
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        <input
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            type="number"
                            placeholder="Age"
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        <div className="relative">
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full h-12 px-4 pr-10 bg-slate-50 border rounded-xl text-gray-700 appearance-none focus:ring-2 focus:ring-emerald-400"
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
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                            required
                        />
                        {error && (
                            <div className="text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;

