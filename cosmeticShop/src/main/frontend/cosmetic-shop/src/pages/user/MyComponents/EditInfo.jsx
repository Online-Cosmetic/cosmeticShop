// src/pages/user/MyComponents/EditInfo.jsx
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export default function EditInfo() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded">
        <p className="text-center text-red-500">
          먼저 <a href="/login" className="underline">로그인</a> 해주세요.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-[600px] mx-auto mt-6 transform -translate-x-4">
        <h3 className="text-2xl font-bold mb-4">회원정보 수정</h3>
        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          {/* 이름 (username) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">이름</div>
            <div className="flex-1 text-lg">{user.username || 'Name'}</div>
          </div>

          {/* 아이디 (userId) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">아이디</div>
            <div className="flex-1 text-lg">{user.userId || 'User ID'}</div>
          </div>

          {/* 닉네임 (nickname) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">닉네임</div>
            <div className="flex-1 text-lg">{user.nickname || 'Nickname'}</div>
            <button
              type="button"
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              변경하기
            </button>
          </div>

          {/* 비밀번호 (占位，不展示明文) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">비밀번호</div>
            <div className="flex-1 text-lg">*******</div>
            <button
              type="button"
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              변경하기
            </button>
          </div>

          {/* 이메일 (email) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">이메일</div>
            <div className="flex-1 text-lg">{user.email || 'abcd@gmail.com'}</div>
            <button
              type="button"
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              변경하기
            </button>
          </div>
        </div>

        <div className="h-8" />

        <div className="mt-6">
          <div className="text-lg font-medium">마케팅 정보 수신 동의</div>
          <div className="mt-2 flex space-x-6">
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm">전체 동의</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm">이메일</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm">SMS</span>
            </label>
            <label className="flex items-center space-x-1">
              <input type="checkbox" className="form-checkbox" />
              <span className="text-sm">휴대전화</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
