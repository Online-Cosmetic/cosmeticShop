import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../../utils/customAxios.js';
import { getImageUrl } from '../../../utils/imageUtils.js';
import customAxios from '../../../utils/customAxios.js';

export default function OrderHistory() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        userAPI.order.getMyOrders()
            .then(res => {
                console.log('주문 데이터:', res.data);
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Orders load failed:', err);
                setError('주문 내역을 불러오지 못했습니다. 다시 시도해주세요.');
                setLoading(false);
            });
    }, []);

    // Format price with commas
    const formatPrice = (price) => {
        return price?.toLocaleString() || '0';
    };

    // 배송상태에 따른 텍스트와 스타일 반환
    const getDeliveryStatusInfo = (status) => {
        switch (status) {
            case 'READY':
                return { text: '배송준비중', className: 'bg-orange-100 text-orange-800' };
            case 'PROG':
                return { text: '배송중', className: 'bg-blue-100 text-blue-800' };
            case 'COMP':
                return { text: '배송완료', className: 'bg-emerald-100 text-emerald-800' };
            case 'CANC':
                return { text: '주문취소', className: 'bg-red-100 text-red-800' };
            default:
                return { text: '상태 미정', className: 'bg-gray-100 text-gray-800' };
        }
    };

    // 주문 취소 처리 함수
    const handleCancelOrder = (orderItemId, orderId) => {
        console.log('취소하려는 주문 아이템 ID:', orderItemId);

        if (!orderItemId) {
            console.error('주문 아이템 ID가 없습니다.');
            alert('주문 취소에 실패했습니다. 주문 아이템 ID가 없습니다.');
            return;
        }

        if (window.confirm('정말로 이 주문을 취소하시겠습니까?')) {
            customAxios.delete(`/api/orders/${orderItemId}`)
                .then(() => {
                    alert('주문이 취소되었습니다.');
                    // 취소 성공 후 주문 목록 새로고침
                    userAPI.order.getMyOrders()
                        .then(res => {
                            setOrders(res.data);
                        })
                        .catch(err => {
                            console.error('Orders refresh failed:', err);
                        });
                })
                .catch(err => {
                    console.error('Order cancellation failed:', err);
                    alert('주문 취소에 실패했습니다. 다시 시도해주세요.');
                });
        }
    };

    // 주소 정보 포맷팅
    const formatAddress = (order) => {
        if (!order) return '주소 정보 없음';
        const { city, street, detail } = order;
        if (!city && !street && !detail) return '주소 정보 없음';
        return `${city || ''} ${street || ''} ${detail || ''}`;
    };

    // 해당 주문에 취소되지 않은 아이템이 있는지 확인
    const hasActiveItems = (order) => {
        if (!order.orderItems || order.orderItems.length === 0) return false;
        return order.orderItems.some(item => item.deliveryStatus !== 'CANC');
    };

    return (
        <section className="bg-white rounded-2xl shadow-sm border p-6">

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="text-xl text-gray-500">주문 내역을 불러오는 중...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-40">
                    <div className="text-xl text-red-500">{error}</div>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
                    <div className="text-xl text-gray-500">주문 내역이 없습니다.</div>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.filter(hasActiveItems).map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Order header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex flex-col gap-1">
                                    <div className="text-lg font-semibold text-neutral-800">
                                        {formatAddress(order)}
                                    </div>
                                </div>
                            </div>

                            {/* Order items */}
                            <div className="divide-y divide-gray-200">
                                {order.orderItems
                                    ?.filter(item => item.deliveryStatus !== 'CANC')
                                    .map(item => (
                                        <div
                                            key={item.orderItemId || `${order.id}-${item.productId}`}
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
                                                    <div className="text-sm text-gray-500 mt-1">
                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${getDeliveryStatusInfo(item.deliveryStatus).className}`}>
                                                        {getDeliveryStatusInfo(item.deliveryStatus).text}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 md:mt-0 flex flex-col md:flex-row gap-3">
                                                {item.deliveryStatus === 'COMP' && (
                                                    <button
                                                        onClick={() => navigate(`/user/review/write/${item.productId}`)}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                                                    >
                                                        리뷰 작성하기
                                                    </button>
                                                )}
                                                {item.deliveryStatus !== 'COMP' && item.deliveryStatus !== 'CANC' && (
                                                    <button
                                                        onClick={() => handleCancelOrder(item.orderItemId, order.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                                    >
                                                        주문취소
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Order footer */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                                <div className="text-lg font-semibold text-neutral-800">
                                    총 결제금액: ₩{formatPrice(order.totalPrice ||
                                    order.orderItems
                                        ?.filter(item => item.deliveryStatus !== 'CANC')
                                        .reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
                                )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}