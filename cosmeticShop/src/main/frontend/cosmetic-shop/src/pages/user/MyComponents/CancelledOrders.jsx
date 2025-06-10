// src/pages/user/MyComponents/CancelledOrders.jsx
import React, { useState, useEffect } from 'react';
// import { userAPI } from '../../../utils/customAxios';

export default function CancelledOrders() {
  const dummyData = [
    {
      id: 1,
      type: '취소',  // '취소' | '반품' | '교환'
      cancelDate: '2025-06-01',
      orderDate: '2025-05-30',
      brand: 'Brand A',
      productName: 'Product A',
      price: 1000000,
      count: 2,
      imageUrl: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      type: '반품',
      cancelDate: '2025-05-28',
      orderDate: '2025-05-25',
      brand: 'Brand B',
      productName: 'Product B',
      price: 250000,
      count: 1,
      imageUrl: 'https://via.placeholder.com/80',
    },
    {
      id: 3,
      type: '교환',
      cancelDate: '2025-05-20',
      orderDate: '2025-05-15',
      brand: 'Brand C',
      productName: 'Product C',
      price: 750000,
      count: 3,
      imageUrl: 'https://via.placeholder.com/80',
    },
  ];

  const [orders, setOrders] = useState(dummyData);

  // 如果要改成真实 API，取消下面注释即可：
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setLoading(true);
  //   userAPI.order.getCancelledOrders()  // 假设这是你的接口
  //     .then(res => setOrders(res.data))
  //     .catch(err => console.error('❌ 취소/반품/교환 내역 로드 실패:', err))
  //     .finally(() => setLoading(false));
  // }, []);
  //
  // if (loading) {
  //   return <div className="text-center py-8">로딩 중...</div>;
  // }

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold mb-6">취소/반품/교환 내역</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-2xl p-4">
            <div className="mb-3 text-sm text-gray-600 flex justify-between">
              <span>접수일: {order.cancelDate}</span>
              <span>주문일: {order.orderDate}</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={order.imageUrl}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{order.brand}</div>
                  <div>{order.productName}</div>
                  <div>{order.price.toLocaleString()}원</div>
                  <div>수량: {order.count}</div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 text-right">
                <div className="text-lg font-semibold">
                  {order.price.toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">
                  {order.type === '취소'
                    ? '취소완료'
                    : order.type === '반품'
                    ? '반품완료'
                    : '교환완료'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}