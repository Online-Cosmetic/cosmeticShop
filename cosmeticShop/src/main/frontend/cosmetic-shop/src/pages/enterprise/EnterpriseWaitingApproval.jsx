import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaEnvelope } from 'react-icons/fa';
import Footer from '../../components/common/Footer';

function EnterpriseWaitingApproval() {
  const navigate = useNavigate();

  return (
    <>
      {/* header */}
      <header className="w-full border-b border-neutral-200">
        <div className="max-w-screen-xl px-12 py-4 flex items-center justify-between">
          <div className="text-2xl text-black">
            cosMall Enterprise
          </div>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="text-yellow-500 flex justify-center mb-6">
            <FaClock className="w-20 h-20" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            승인 대기 중입니다
          </h1>
          
          <p className="text-gray-600 mb-6">
            기업 회원 가입 신청이 완료되었습니다.<br />
            관리자 승인 후 서비스를 이용하실 수 있습니다.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center text-blue-600 mb-2">
              <FaEnvelope className="w-5 h-5 mr-2" />
              <span className="font-semibold">알림 안내</span>
            </div>
            <p className="text-sm text-blue-700">
              승인 완료 시 등록하신 이메일로 알림을 드립니다.
            </p>
          </div>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                navigate('/enterprise/login');
              }}
              className="w-full py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300 font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default EnterpriseWaitingApproval;

