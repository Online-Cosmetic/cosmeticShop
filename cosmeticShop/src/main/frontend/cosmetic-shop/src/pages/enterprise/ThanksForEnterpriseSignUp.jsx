import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaChartLine } from 'react-icons/fa';

function ThanksForEnterpriseSignUp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-blue-600 flex justify-center mb-6">
          <div className="relative">
            <FaBuilding className="w-20 h-20" />
            <FaChartLine className="w-10 h-10 absolute -top-2 -right-2 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          회원가입이 완료되었습니다!
        </h1>
        
        <p className="text-gray-600 mb-8">
          cosMall Enterprise의 파트너가 되신 것을 환영합니다!<br />
          cosMall과 함께 성공적인 비즈니스를 시작해보세요.
        </p>
        
        <div className="flex flex-col space-y-3">
          {/*<button*/}
          {/*  onClick={() => navigate('/enterprise/dashboard')}*/}
          {/*  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"*/}
          {/*>*/}
          {/*  대시보드로 이동*/}
          {/*</button>*/}
          
          <button
            onClick={() => navigate('/enterprise/login')}
            className="w-full py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-medium"
          >
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThanksForEnterpriseSignUp;