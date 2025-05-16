import React from 'react';

const OrderHistory = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500">아직 주문 내역이 없습니다.</p>
            </div>
        </div>
    );
};

export default OrderHistory; 