import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    userAPI.coupon.getMyCoupons()
      .then(response => {
        setCoupons(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('쿠폰 데이터 불러오기 실패:', err);
        setError('쿠폰 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      });
  }, []);

  // 남은 일수 계산 함수
  const calculateDaysLeft = (expirationDate) => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-white flex justify-center items-center h-40">
        <p className="text-gray-500">쿠폰 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white flex justify-center items-center h-40">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <p className="text-sm text-gray-500 mb-4">현재 {coupons.length}장 보유중</p>

      {coupons.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">보유한 쿠폰이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => {
            const daysLeft = calculateDaysLeft(coupon.expirationDate);
            const isExpired = daysLeft <= 0;
            const isUsed = coupon.isUsed;

            return (
              <div
                key={coupon.id}
                className={`border border-gray-200 rounded-xl p-4 flex justify-between items-start ${isExpired || isUsed ? 'opacity-60' : ''}`}
              >
                <div>
                  <p className="text-lg font-semibold">{coupon.couponName}</p>
                  <p className="text-sm text-gray-500 mt-1">{coupon.companyName}</p>
                  {isUsed && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      사용완료
                    </span>
                  )}
                  {!isUsed && isExpired && (
                    <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                      만료됨
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between items-end">
                  <p className="text-lg font-bold text-red-500">{coupon.discountRate}% 할인</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {isExpired ? '만료: ' : '만료일: '} 
                    {formatDate(coupon.expirationDate)}
                  </p>
                  {!isExpired && !isUsed && (
                    <p className="text-xs text-green-600 mt-1">
                      {daysLeft}일 남음
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Coupons;
