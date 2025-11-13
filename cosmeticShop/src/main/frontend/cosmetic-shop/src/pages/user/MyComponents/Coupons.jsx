import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Modal 상태는 컴포넌트 내부에 위치해야 함
  const [showModal, setShowModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');

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

  //  쿠폰코드 등록
  const handleAddCoupon = async () => {
    if (!couponCode.trim()) {
      alert('쿠폰 코드를 입력해주세요.');
      return;
    }

    try {
      await userAPI.coupon.addCouponByCode(couponCode);
      alert('쿠폰이 성공적으로 등록되었습니다!');

      // 최신 데이터 다시 불러오기（API 수정!!!!!)
      const refreshed = await userAPI.coupon.getMyCoupons();
      setCoupons(refreshed.data);

      setShowModal(false);
      setCouponCode('');
    } catch (err) {
      console.error('쿠폰 등록 실패:', err);
      alert('유효하지 않은 쿠폰 코드입니다.');
    }
  };

  // 남은 일수 계산
  const calculateDaysLeft = (expirationDate) => {
    const expiry = new Date(expirationDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 날짜 포맷팅
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
      {/* 상단 영역 */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">
          현재 {coupons.length}장 보유중
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          쿠폰추가
        </button>
      </div>

      {/* 쿠폰 목록 */}
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
                className={`border border-gray-200 rounded-xl p-4 flex justify-between items-start 
                ${isExpired || isUsed ? 'opacity-60' : ''}`}
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

                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold text-red-500">
                    {coupon.discountRate}% 할인
                  </p>

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

      {/*  Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">쿠폰 코드 입력</h3>

            <input
              type="text"
              placeholder="쿠폰 코드를 입력하세요"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                취소
              </button>

              <button
                onClick={handleAddCoupon}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
