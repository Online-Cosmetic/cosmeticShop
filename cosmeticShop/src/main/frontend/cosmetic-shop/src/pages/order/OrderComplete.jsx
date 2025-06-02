import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userAPI } from '../../utils/customAxios';
import {getImageUrl} from "../../utils/imageUtils.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function OrderComplete() {
  const navigate = useNavigate();
  const query = useQuery();
  const orderId = query.get("orderId");
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!orderId) return;
      setLoading(true);
      try {
        // 주문 정보 조회
        const orderRes = await userAPI.order.getSingleOrderDetail(orderId);
        setOrder(orderRes.data.order);

        if (orderRes.data.order.orderItems && orderRes.data.order.orderItems.length > 0) {
          orderRes.data.order.orderItems[0].thumbnailUrl = orderRes.data.thumbnailUrl;
        }

        // 결제 정보 조회
        const paymentRes = await userAPI.payment.getPaymentStatus(orderId);
        setPayment(paymentRes.data);

      } catch (e) {
        console.error("주문/결제 정보를 불러오지 못했습니다.", e);
        alert("주문/결제 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId]);

  // yyyymmddhhmmss 포맷으로 현재날짜시간 출력하기
  function getCurrentDateTime() {
    const now = new Date();    // 년
    const year = now.getFullYear();  // 월
    const month = (now.getMonth() + 1).toString().padStart(2, '0');  // 일
    const day = now.getDate().toString().padStart(2, '0');  // 시
    const hours = now.getHours().toString().padStart(2, '0');  // 분
    const minutes = now.getMinutes().toString().padStart(2, '0');  // 초
    return year + "/" + month + "/" + day + "  " + hours + ":" + minutes;
  }

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'CARD': return '신용/체크카드';
      case 'BANK_TRANSFER': return '계좌이체';
      case 'KAKAO_PAY': return '카카오페이';
      default: return method;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (!order || !payment) {
    return <div className="flex justify-center items-center min-h-screen">주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-8">주문 완료</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 주문 정보 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">주문 정보</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">주문 금액</p>
              <p className="font-medium">{order.totalPrice.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-gray-600">주문 일시</p>
              <p className="font-medium">{getCurrentDateTime()}</p>
            </div>
            <div>
              <p className="text-gray-600">배송지 정보</p>
              <div className="pl-4 border-l-2 border-gray-200 mt-2">
                <p className="font-medium">{order.city + " " + order.street}</p>
                <p className="font-medium">{order.detail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">결제 방식</p>
              <p className="font-medium">{formatPaymentMethod(payment.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-gray-600">결제 금액</p>
              <p className="font-medium">{payment.amount?.toLocaleString()}원</p>
            </div>
            <div>
              <p className="text-gray-600">결제 상태</p>
              <p className="font-medium">{payment.status === 'COMPLETED' ? '결제 완료' : payment.status}</p>
            </div>
            <div>
              <p className="text-gray-600">구매자 정보</p>
              <p className="font-medium">{payment.buyerName} ({payment.buyerEmail})</p>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-4 border-b last:border-b-0">
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(item.thumbnailUrl)}
                  alt={item.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-gray-600">수량: {item.quantity}개</p>
                </div>
              </div>
              <p className="font-medium">{(item.price * item.quantity).toLocaleString()}원</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/user/orders')}
          className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors"
        >
          주문 목록으로
        </button>
      </div>
    </div>
  );
}

export default OrderComplete;