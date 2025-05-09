// src/pages/signUp/SignUp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";

function SignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userId: "",
        password: "",
        username: "",
        age: "",
        gender: "MALE",
        nickName: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // await axios.post("/api/users", {
            await axios.post("/api/auth/signup/user", {
                userId: form.userId,
                password: form.password,
                username: form.username,
                age: Number(form.age),
                gender: form.gender,
                nickName: form.nickName,
                email: form.email,
            });
            navigate("/login");
        } catch (err) {
            console.error(err);
            alert("회원가입에 실패했습니다.");
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-full max-w-sm space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">Create An Account</h1>
                    <div className="space-y-4">
                        <input
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            type="text"
                            placeholder="ID"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            type="text"
                            placeholder="User Name"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            type="number"
                            placeholder="Age"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded"
                        >
                            <option value="MALE">남성</option>
                            <option value="FEMALE">여성</option>
                        </select>
                        <input
                            name="nickName"
                            value={form.nickName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Nick Name"
                            className="w-full px-4 py-2 border rounded"
                        />
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-3 rounded font-semibold hover:bg-gray-800"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default SignUp;

