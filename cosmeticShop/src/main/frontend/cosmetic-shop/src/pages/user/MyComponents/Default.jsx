import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../../../utils/customAxios.js';

// 배송상황
const fakeDeliveries = [
  {
    id: 1,
    productName: '피부 진정 에센스',
    imageUrl: '/images/essence.jpg',
    status: '배송중',
    courier: 'CJ대한통운',
    trackingNumber: '1234-5678-9999',
    date: '2025-06-10',
  },
  {
    id: 2,
    productName: '촉촉 크림',
    imageUrl: '/images/cream.jpg',
    status: '배송완료',
    courier: '우체국택배',
    trackingNumber: '9876-5432-1111',
    date: '2025-06-09',
  },
];

// 찜목록
const fakeWishlist = [
  {
    id: 1,
    productName: '산뜻 토너',
    brand: 'Brand A',
    price: 12000,
    imageUrl: '/images/toner.jpg',
  },
  {
    id: 2,
    productName: '비타민C 세럼',
    brand: 'Brand B',
    price: 32000,
    imageUrl: '/images/serum.jpg',
  },
  {
    id: 3,
    productName: '미백 마스크',
    brand: 'Brand C',
    price: 10000,
    imageUrl: '/images/mask.jpg',
  },
  {
    id: 4,
    productName: '수분 로션',
    brand: 'Brand D',
    price: 18000,
    imageUrl: '/images/lotion.jpg',
  },
];

// 리뷰
const fakeReviews = [
  {
    id: 1,
    brand: 'Brand A',
    productName: 'Product A',
    price: 20000,
    imageUrl: '/images/productA.jpg',
    orderDate: '2025.06.01',
  },
  {
    id: 2,
    brand: 'Brand B',
    productName: 'Product B',
    price: 35000,
    imageUrl: '/images/productB.jpg',
    orderDate: '2025.05.20',
  },
];

export default function Default() {

  // 리뷰 api 
  // const [reviews, setReviews] = useState([]);
  // useEffect(() => {
  //   userAPI.review.getMyReviews()
  //     .then(res => setReviews(res.data))
  //     .catch(err => console.error('리뷰 불러오기 실패:', err));
  // }, []);

  // 찜목록 api 
  // const [wishlist, setWishlist] = useState([]);
  // useEffect(() => {
  //   userAPI.wishlist.getMyWishlist()
  //     .then(res => setWishlist(res.data))
  //     .catch(err => console.error('찜 목록 불러오기 실패:', err));
  // }, []);

  // 배송상황 api 
  // const [deliveries, setDeliveries] = useState([]);
  // useEffect(() => {
  //   userAPI.order.getMyDeliveries()
  //     .then(res => setDeliveries(res.data))
  //     .catch(err => console.error('배송상황 불러오기 실패:', err));
  // }, []);

  const [qnas, setQnas] = useState([]);
  const [loadingQna, setLoadingQna] = useState(true);

  useEffect(() => {
    userAPI.qna.getMyQnas()
      .then(res => {
        console.log("QnA response:", res.data);
        setQnas(res.data);
        setLoadingQna(false);
      })
      .catch(err => {
        setQnas([]);
        setLoadingQna(false);
      });
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* 배송상황 */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">배송상황</h2>
          <Link to="/user?section=orderHistory" className="text-blue-500 text-sm hover:underline">전체보기</Link>
        </div>
        <div className="bg-gray-200 rounded-xl p-6 flex gap-10 overflow-x-auto">
          {fakeDeliveries.map(d => (
            <div key={d.id} className="flex flex-col items-center min-w-[170px]">
              <img src={d.imageUrl} alt={d.productName} className="w-20 h-20 object-cover rounded mb-2" />
              <div className="font-bold text-center">{d.productName}</div>
              <div className="text-gray-600 text-sm text-center">{d.status}</div>
              <div className="text-xs text-gray-500 text-center">{d.courier}</div>
              <div className="text-xs text-gray-500 text-center mb-1">{d.trackingNumber}</div>
              <button className="border px-3 py-1 text-xs rounded hover:bg-gray-100">배송추적</button>
            </div>
          ))}
        </div>
      </section>

      {/* 찜목록 */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">찜목록</h2>
          <Link to="/user?section=wishlist" className="text-blue-500 text-sm hover:underline">전체보기</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {fakeWishlist.map(item => (
            <div key={item.id} className="border rounded-xl p-4 flex flex-col items-center min-w-[140px] bg-gray-50">
              <img src={item.imageUrl} alt={item.productName} className="w-20 h-20 object-cover rounded mb-2" />
              <div className="font-bold text-center">{item.brand}</div>
              <div className="text-center">{item.productName}</div>
              <div className="text-pink-500 font-bold">{item.price.toLocaleString()}원</div>
              <button className="mt-2 text-xs border px-3 py-1 rounded hover:bg-gray-100">장바구니</button>
            </div>
          ))}
        </div>
      </section>

      {/* 리뷰 */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">리뷰</h2>
          <Link to="/user?section=review" className="text-blue-500 text-sm hover:underline">전체보기</Link>
        </div>
        <div className="bg-white border rounded-2xl p-6">
          {fakeReviews.map((r, i) => (
            <div key={r.id} className={`flex items-center py-6 ${i !== 0 ? 'border-t' : ''}`}>
              <img
                src={r.imageUrl || '/images/noimg.png'}
                alt={r.productName}
                className="w-16 h-16 rounded object-cover mr-5"
              />
              <div className="flex-1">
                <div className="font-bold">{r.brand}</div>
                <div>{r.productName}</div>
                <div className="font-semibold">{Number(r.price).toLocaleString()}원</div>
                <div className="text-gray-400 text-xs">{r.orderDate}</div>
              </div>
              <button className="border px-6 py-2 rounded text-sm hover:bg-gray-50">리뷰 작성</button>
            </div>
          ))}
        </div>
      </section>

      {/* Q&A */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">Q&A</h2>
          <Link to="/user?section=qna" className="text-blue-500 text-sm hover:underline">
            전체보기
          </Link>
        </div>
        <div className="overflow-x-auto border rounded-xl bg-white">
          <table className="min-w-full text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium">#</th>
                <th className="px-4 py-3 text-sm font-medium">상태</th>
                <th className="px-4 py-3 text-sm font-medium">제목</th>
                <th className="px-4 py-3 text-sm font-medium">작성자</th>
                <th className="px-4 py-3 text-sm font-medium">날짜</th>
              </tr>
            </thead>
            <tbody>
              {loadingQna ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    로딩중...
                  </td>
                </tr>
              ) : qnas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    등록된 QnA가 없습니다.
                  </td>
                </tr>
              ) : (
                qnas.slice(0, 3).map((qna, idx) => (
                  <tr key={qna.id} className="border-t">
                    <td className="px-4 py-3 text-sm">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      {qna.answered ? '답변 완료' : '답변 대기중'}
                    </td>
                    <td className="px-4 py-3 text-sm">{qna.questionTitle}</td>
                    <td className="px-4 py-3 text-sm">{qna.nickname}</td>
                    <td className="px-4 py-3 text-sm">
                      {qna.questionedAt.slice(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


