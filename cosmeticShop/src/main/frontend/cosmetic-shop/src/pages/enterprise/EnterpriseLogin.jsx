// src/pages/enterprise/EnterpriseLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../../components/common/Footer.jsx";

function EnterpriseLogin() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ userId: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/auth/login",
          {
              userId: creds.userId,
              password: creds.password,
        });
      // EnterpriseMain 페이지로 이동
      navigate("/enterpriseMain");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="w-[816px] bg-white rounded-[30px] p-12 shadow-md">
          {/* 헤더 */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-semibold text-gray-900">Welcome Back 👋</h1>
            <p className="text-2xl text-slate-700 mt-4">Let’s grow your business.</p>
          </div>

          {/* 로그인 폼 */}
          <form
            className="space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* ID */}
            <div>
              <label className="text-gray-900 text-base block mb-2">ID</label>
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
              <label className="text-gray-900 text-base block mb-2">Password</label>
              <input
                name="password"
                value={creds.password}
                onChange={handleChange}
                type="password"
                placeholder="At least 8 characters"
                className="w-full h-12 px-4 bg-slate-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-4 bg-emerald-500 text-white text-xl font-medium rounded-xl hover:bg-emerald-600 transition"
            >
              Sign in
            </button>
          </form>

          {/* 회원가입 안내 */}
          <div className="text-center mt-10">
            <span className="text-slate-700 text-lg">Don't have an account? </span>
            <Link to="/enterpriseSignUp" className="text-emerald-600 font-medium hover:underline">
              Sign up
            </Link>
          </div>

          {/* 푸터 */}
          <div className="text-center text-gray-500 text-sm mt-10">
            © 2025 CosMall, LLC. All rights reserved.
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EnterpriseLogin;