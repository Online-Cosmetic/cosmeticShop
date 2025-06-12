import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

function ThanksForReview() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-emerald-500 flex justify-center mb-6">
          <FaCheckCircle className="w-20 h-20" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          소중한 리뷰 감사합니다!
        </h1>
        
        <p className="text-gray-600 mb-8">
          고객님의 리뷰는 다른 고객들의 현명한 선택에 큰 도움이 됩니다.
          앞으로도 저희 서비스를 이용해 주셔서 감사합니다.
        </p>
        
        <button
          onClick={() => navigate('/products')}
          className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 font-medium"
        >
          쇼핑 계속하기
        </button>
      </div>
    </div>
  );
}

export default ThanksForReview;