import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGift, FaShoppingBag } from 'react-icons/fa';

function ThanksForSignUp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-emerald-500 flex justify-center mb-6">
          <div className="relative">
            <FaShoppingBag className="w-20 h-20" />
            <FaGift className="w-10 h-10 absolute -top-2 -right-2 text-pink-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          회원가입이 완료되었습니다!
        </h1>
        
        <p className="text-gray-600 mb-8">
          cosMall의 가족이 되신 것을 환영합니다!<br />
          다양한 화장품을 둘러보고 나만의 스타일을 찾아보세요.
        </p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 font-medium"
          >
            쇼핑 시작하기
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-white text-emerald-600 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors duration-300 font-medium"
          >
            로그인 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThanksForSignUp;