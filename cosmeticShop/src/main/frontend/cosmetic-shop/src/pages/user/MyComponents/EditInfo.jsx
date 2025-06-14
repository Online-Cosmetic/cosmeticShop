// src/pages/user/MyComponents/EditInfo.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userAPI } from '../../../utils/customAxios';

export default function EditInfo() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 닉네임 변경 관련 상태
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await userAPI.profile.getProfile();
        setProfile(response.data);
        setNewNickname(response.data.nickname || '');
      } catch (err) {
        console.error('프로필 정보 불러오기 실패:', err);
        setError('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 닉네임 변경 처리
  const handleNicknameChange = async () => {
    if (!newNickname.trim()) {
      setNicknameError('닉네임을 입력해주세요.');
      return;
    }

    try {
      await userAPI.profile.changeNickname({ nickNameToChange: newNickname });
      // 성공 시 프로필 업데이트
      setProfile(prev => ({ ...prev, nickname: newNickname }));
      setIsEditingNickname(false);
      setNicknameError('');
    } catch (err) {
      console.error('닉네임 변경 실패:', err);
      setNicknameError('닉네임 변경에 실패했습니다. 이미 사용 중인 닉네임일 수 있습니다.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded">
        <p className="text-center text-red-500">
          먼저 <a href="/login" className="underline">로그인</a> 해주세요.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded">
        <p className="text-center">정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 border border-gray-300 rounded">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <section>
      <div className="max-w-[600px] mx-auto mt-6 transform -translate-x-4">

        <div className="space-y-4">
          {/* 이름 (username) - userId를 사용 (실제 이름 필드가 없음) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">이름</div>
            <div className="flex-1 text-lg">{user.username || 'Name'}</div>
          </div>

          {/* 아이디 (userId) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">아이디</div>
            <div className="flex-1 text-lg">{profile?.userId || 'User ID'}</div>
          </div>

          {/* 닉네임 (nickname) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">닉네임</div>
            {isEditingNickname ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="새 닉네임 입력"
                />
                {nicknameError && <p className="text-red-500 text-sm mt-1">{nicknameError}</p>}
                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={handleNicknameChange}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingNickname(false);
                      setNewNickname(profile?.nickname || '');
                      setNicknameError('');
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 text-lg">{profile?.nickname || 'Nickname'}</div>
                <button
                  type="button"
                  onClick={() => setIsEditingNickname(true)}
                  className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                >
                  변경하기
                </button>
              </>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">비밀번호</div>
            <div className="flex-1 text-lg">*******</div>
          </div>

          {/* 이메일 (email) */}
          <div className="flex items-center">
            <div className="w-[120px] text-lg">이메일</div>
            <div className="flex-1 text-lg">{profile?.email || 'abcd@gmail.com'}</div>
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
