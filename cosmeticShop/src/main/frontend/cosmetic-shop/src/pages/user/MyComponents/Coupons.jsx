import React, { useState, useEffect } from 'react';

// TODO: 실제 API 호출을 통해 쿠폰 데이터를 받아오도록 수정
// 예시: axios.get('/api/coupons').then(res => setCoupons(res.data));
const mockCoupons = [
  { id: 1, discount: '99%', brand: '브랜드명', expiry: '만료 20일 전' },
  { id: 2, discount: '99%', brand: '브랜드명', expiry: '만료 20일 전' },
  { id: 3, discount: '99%', brand: '브랜드명', expiry: '만료 20일 전' },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    // API 호출 부분 (주석 유지)
    // fetch('/api/coupons')
    //   .then(res => res.json())
    //   .then(data => setCoupons(data));

    // 현재는 mock 데이터 사용
    setCoupons(mockCoupons);
  }, []);

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-2">쿠폰</h1>
      <p className="text-sm text-gray-500 mb-4">{coupons.length}장 보유중</p>

      <div className="space-y-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="border border-gray-200 rounded-xl p-4 flex justify-between items-start"
          >
            <div>
              <p className="text-lg font-semibold">{coupon.discount} 할인쿠폰</p>
              <p className="text-sm text-gray-500 mt-1">{coupon.brand}</p>
            </div>

            <div className="flex flex-col justify-between items-end">
              <p className="text-lg font-bold text-red-500">{coupon.discount}</p>
              <p className="text-sm text-gray-400 mt-1">{coupon.expiry}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coupons;
