import React, { useState } from 'react';
import BankTransferPayment from '../../components/payment/BankTransferPayment';
import CardPaymentForToss from '../../components/payment/CardPaymentForToss';
import EasyPayment from '../../components/payment/EasyPayment';
import { useNavigate } from 'react-router-dom';
import customAxios from '../../utils/customAxios';

const Checkout = () => {
    const [orderId, setOrderId] = useState(null);
    const [method, setMethod] = useState('card');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 주문 생성 예시 (실제 데이터는 장바구니/주문정보에서 받아와야 함)
    const handleCreateOrder = async () => {
        setLoading(true);
        try {
            // 예시: 단일 상품 주문
            const orderRequest = {
                orderItemDTO: {
                    productId: 1, // 실제 상품 ID로 대체
                    quantity: 1,
                    price: 1000,
                },
                addressDTO: {
                    city: '서울특별시',
                    street: '강남구',
                    detail: '신사동',
                },
            };
            const res = await customAxios.post('/api/orders', orderRequest);
            // orderId는 응답에서 받아온다고 가정
            const newOrderId = res.data.orderId || 1; // 실제 응답 구조에 맞게 수정
            setOrderId(newOrderId);
        } catch (e) {
            alert('주문 생성 실패');
        } finally {
            setLoading(false);
        }
    };

    // 결제 성공 후 이동 콜백 예시
    const handlePaymentSuccess = () => {
        navigate(`/user/order/complete?orderId=${orderId}`);
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            {!orderId ? (
                <button className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg" onClick={handleCreateOrder} disabled={loading}>
                    {loading ? '주문 생성 중...' : '주문 생성 및 결제 진행'}
                </button>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-semibold">결제수단 선택</label>
                        <select value={method} onChange={e => setMethod(e.target.value)} className="w-full border rounded p-2">
                            <option value="card">카드결제</option>
                            <option value="bank">실시간 계좌이체</option>
                            <option value="simple">간편결제</option>
                        </select>
                    </div>
                    {method === 'card' && <CardPaymentForToss orderId={orderId} onSuccess={handlePaymentSuccess} />}
                    {method === 'bank' && <BankTransferPayment orderId={orderId} onSuccess={handlePaymentSuccess} />}
                    {method === 'simple' && <EasyPayment orderId={orderId} onSuccess={handlePaymentSuccess} />}
                </div>
            )}
        </div>
    );
};

export default Checkout;
