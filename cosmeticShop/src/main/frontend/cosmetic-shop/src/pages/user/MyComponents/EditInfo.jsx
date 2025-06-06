import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';

export default function EditInfo() {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    userAPI.profile.getProfile()
      .then(response => {
        const data = response.data;
        console.log(data)
      })
      .catch(error => {
        console.error("프로필 조회 실패:", error);
        alert("접근 권한이 없거나 프로필을 불러올 수 없습니다.");
      });
  }, []);
  return (
    <section>
      <div className="max-w-[600px] mx-auto mt-6 transform -translate-x-4">
        <h3 className="text-2xl font-bold mb-4">회원정보 수정</h3>
        <hr className="border-gray-300 mb-6" />

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-[120px] text-lg">이름</div>
            <div className="flex-1 text-lg">{name || 'Name'}</div>
          </div>

          <div className="flex items-center">
            <div className="w-[120px] text-lg">아이디</div>
            <div className="flex-1 text-lg">{userId || 'User ID'}</div>
          </div>

          <div className="flex items-center">
            <div className="w-[120px] text-lg">비밀번호</div>
            <div className="flex-1 text-lg">{password ? '******' : '*******'}</div>
            <button
              type="button"
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              변경하기
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-[120px] text-lg">전화번호</div>
            <div className="flex-1 text-lg">{phone || '000-0000-0000'}</div>
            <button
              type="button"
              className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              변경하기
            </button>
          </div>

          <div className="flex items-center">
            <div className="w-[120px] text-lg">이메일</div>
            <div className="flex-1 text-lg">{email || 'abcd@gmail.com'}</div>
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
