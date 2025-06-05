import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../utils/customAxios';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function EnterpriseLogin() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ userId: '', password: '', role: 'ROLE_COMPANY' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setCreds(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 직접 API 호출 대신 authAPI 사용 (리다이렉트 방지)
      const response = await authAPI.login(creds);
      const { userId, role, accessToken, email, username } = response.data;
      
      if (response.data.errorMessage) {
        setError(response.data.errorMessage);
        return;
      }
      
      // 역할 검증
      if (role !== 'ROLE_COMPANY') {
        setError('기업 회원 전용 로그인 페이지입니다. 일반 회원은 일반 로그인을 이용해주세요.');
        return;
      }
      
      // 사용자 정보 로컬 스토리지에 저장
      const userData = { userId, role, email, username };
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', username);
      
      // 페이지 이동
      navigate('/company/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 403) {
        setError('기업 회원 전용 로그인 페이지입니다. 일반 회원은 일반 로그인을 이용해주세요.');
      } else {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
          <div className="w-[816px] bg-white rounded-[30px] p-12 shadow-md">
            <div className="mb-12 text-center">
              <h1 className="text-4xl font-semibold">Welcome Back 👋</h1>
              <p className="text-2xl mt-4">Let's grow your business.</p>
            </div>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2">ID</label>
                <input
                    name="userId"
                    value={creds.userId}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                    placeholder="User ID"
                    required
                />
              </div>
              <div>
                <label className="block mb-2">Password</label>
                <input
                    name="password"
                    type="password"
                    value={creds.password}
                    onChange={handleChange}
                    className="w-full h-12 px-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-400"
                    placeholder="Password"
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
                  className="w-full py-4 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600"
                  disabled={loading}
              >
                {loading ? '로그인 중...' : 'Sign in'}
              </button>
            </form>
            <div className="text-center mt-10">
              <span>Don't have an account? </span>
              <Link to="/enterpriseSignUp" className="text-emerald-600 hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-gray-500 text-sm mt-10">
              © 2025 CosMall, LLC. All rights reserved.
            </div>
          </div>
        </div>
      </>
  );
}