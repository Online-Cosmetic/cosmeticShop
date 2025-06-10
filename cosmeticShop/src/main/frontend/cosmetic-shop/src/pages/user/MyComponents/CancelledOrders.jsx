// src/pages/user/MyComponents/CancelledOrders.jsx
import React, { useState } from 'react';

export default function CancelledOrders() {
  const dummyData = Array.from({ length: 3 }, (_, idx) => ({
    id: idx + 1,
    type: idx === 0 ? '취소' : idx === 1 ? '반품' : '교환',
    cancelDate: '0000.00.00',
    orderDate: '0000.00.00',
    brand: 'Product brand',
    productName: 'Product name',
    price: 10000000,
    count: null,
    imageUrl: 'https://via.placeholder.com/80',
  }));

  const [orders] = useState(dummyData);

  const getPrefix = type => {
    switch (type) {
      case '취소': return '취소접수일';
      case '반품': return '반품접수일';
      case '교환': return '교환접수일';
      default: return '접수일';
    }
  };

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold mb-6">취소/반품/교환 내역</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-2xl p-4">
            {/* 上方日期信息 */}
            <div className="mb-3 text-sm text-gray-600 flex justify-between w-full">
              <span>{getPrefix(order.type)}: {order.cancelDate}</span>
              <span>주문일: {order.orderDate}</span>
            </div>

            {/* 商品详情与状态 */}
            <div className="flex items-center justify-between">
              {/* 左侧：图片 + 文字信息 */}
              <div className="flex items-center space-x-4">
                <img
                  src={order.imageUrl}
                  alt={order.productName}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{order.brand}</div>
                  <div>{order.productName}</div>
                  <div>Price</div>
                  <div>Count</div>
                </div>
              </div>

              {/* 右侧：大号价格 + 完成状态 */}
              <div className="flex flex-col items-end gap-1">
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

      {/* 分页按钮 */}
      <div className="flex justify-center mt-6 space-x-4">
        <button className="px-4 py-2 border rounded">이전 페이지</button>
        <button className="px-4 py-2 border rounded">다음 페이지</button>
      </div>
    </section>
  );
}