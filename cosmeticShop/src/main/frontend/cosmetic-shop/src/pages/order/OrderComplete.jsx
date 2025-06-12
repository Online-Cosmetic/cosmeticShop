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

  // 리뷰 작성 페이지로 이동
  const goToReviewWrite = (productId) => {
    navigate(`/user/review/write/${productId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (!order || !payment) {
    return <div className="flex justify-center items-center min-h-screen">주문 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      {/* 감사 메시지 섹션 추가 */}
      <div className="text-center mb-10 bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-xl shadow-sm">
        <div className="flex justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-emerald-700">주문이 완료되었습니다!</h1>
        <p className="text-lg text-gray-600">소중한 주문에 진심으로 감사드립니다. 빠른 시간 내에 배송해드리겠습니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 주문 정보 */}
        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-emerald-500 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-emerald-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            주문 정보
          </h2>
          <div className="space-y-5">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">주문 금액</p>
              <p className="font-medium text-lg">{order.totalPrice.toLocaleString()}원</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">주문 일시</p>
              <p className="font-medium">{getCurrentDateTime()}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">배송지 정보</p>
              <div className="pl-4 border-l-2 border-emerald-300 mt-2">
                <p className="font-medium">{order.city + " " + order.street}</p>
                <p className="font-medium">{order.detail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white p-8 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-6 flex items-center text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            결제 정보
          </h2>
          <div className="space-y-5">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">결제 방식</p>
              <p className="font-medium">{formatPaymentMethod(payment.paymentMethod)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">결제 금액</p>
              <p className="font-medium text-lg text-blue-600">{payment.amount?.toLocaleString()}원</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">결제 상태</p>
              <p className="font-medium">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {payment.status === 'COMPLETED' ? '결제 완료' : payment.status}
                </span>
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-600 text-sm">구매자 정보</p>
              <p className="font-medium">{payment.buyerName} ({payment.buyerEmail})</p>
            </div>
          </div>
        </div>
      </div>

      {/* 주문 상품 목록 */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          주문 상품
        </h2>
        <div className="space-y-4">
          {order.orderItems?.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b last:border-b-0 hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <img
                  src={getImageUrl(item.mainImageUrl)}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <p className="font-medium text-lg">{item.productName}</p>
                  <p className="text-gray-600">수량: {item.quantity}개</p>
                  <p className="font-medium text-emerald-700">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={() => goToReviewWrite(item.productId)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium shadow-sm hover:shadow flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  리뷰 작성하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate('/user/orders')}
          className="px-6 py-3 bg-neutral-800 text-white font-semibold rounded-lg hover:bg-neutral-700 transition-colors shadow-md hover:shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          주문 목록으로
        </button>
      </div>
    </div>
  );
}

export default OrderComplete;