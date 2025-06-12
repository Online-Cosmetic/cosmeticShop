import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios.js';
import { getImageUrl } from '../../../utils/imageUtils.js';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        userAPI.order.getMyOrders()
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Orders load failed:', err);
                setError('Failed to load orders. Please try again.');
                setLoading(false);
            });
    }, []);

    const filteredOrders = orders.filter(order => {
        if (!order) return false; // order가 undefined인 경우 필터링

        const term = search.toLowerCase();
        return (
            (order.id?.toString() || '').includes(term) || // optional chaining 사용
            (order.orderDate && new Date(order.orderDate).toLocaleDateString().includes(term))
        );
    });

    // Format price with commas
    const formatPrice = (price) => {
        return price?.toLocaleString() || '0';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold mb-6 text-neutral-800">주문 내역</h2>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="주문번호 또는 날짜로 검색"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-white border border-gray-300 px-4 py-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                    <svg 
                        className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fillRule="evenodd" 
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                            clipRule="evenodd" 
                        />
                    </svg>
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="text-xl text-gray-500">주문 내역을 불러오는 중...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-40">
                    <div className="text-xl text-red-500">{error}</div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
                    <div className="text-xl text-gray-500">주문 내역이 없습니다.</div>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Order header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-semibold text-neutral-800">주문번호: #{order.id}</span>
                                    <span className="text-gray-600">{formatDate(order.orderDate)}</span>
                                </div>
                                <div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-medium rounded-full text-sm">
                                        {order.status || '배송완료'}
                                    </span>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="divide-y divide-gray-200">
                                {order.orderItems?.map(item => (
                                    <div
                                        key={item.id}
                                        className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <img
                                                    src={getImageUrl(item.mainImageUrl)}
                                                    alt={item.productName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm text-gray-600">{item.brand}</div>
                                                <div className="font-medium text-lg text-neutral-800">{item.productName}</div>
                                                <div className="text-emerald-600 font-semibold">₩{formatPrice(item.price)}</div>
                                                <div className="text-sm text-gray-500">수량: {item.quantity || 1}개</div>
                                            </div>
                                        </div>
                                        <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-3">
                                            <button className="px-4 py-2 bg-white border border-gray-300 text-neutral-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                                배송조회
                                            </button>
                                            <button className="px-4 py-2 bg-white border border-gray-300 text-neutral-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                                교환/반품
                                            </button>
                                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                                                장바구니 담기
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                                <div className="text-lg font-semibold text-neutral-800">
                                    총 결제금액: ₩{formatPrice(order.orderItems?.reduce((sum, item) => sum + (item.price || 0), 0))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
