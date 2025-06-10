import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
// import { userAPI } from '../../../utils/customAxios';  // 真实 API，请在上线前取消注释
import ReviewWrite from './ReviewWrite';

// 假数据示例
const mockReviews = [
  { id: 1, image: 'https://via.placeholder.com/80', brand: 'Product brand', name: 'Product name', price: 25000, date: '2025.06.10' },
  { id: 2, image: 'https://via.placeholder.com/80', brand: 'Another brand', name: 'Another product', price: 33000, date: '2025.05.22' },
  { id: 3, image: 'https://via.placeholder.com/80', brand: 'Sample brand', name: 'Sample item', price: 18000, date: '2025.04.30' },
];

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [writingId, setWritingId] = useState(null);

  useEffect(() => {
    setReviews(mockReviews);
    /*
    userAPI.review.getMyReviews()
      .then(res => setReviews(res.data))
      .catch(err => console.error('❌ 리뷰 불러오기 실패:', err));
    */
  }, []);

  if (writingId !== null) {
    return <ReviewWrite onCancel={() => setWritingId(null)} />;
  }


  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold mb-6">리뷰</h2>
      <div className="space-y-6">
        {reviews.map(r => (
          <div key={r.id} className="flex items-center justify-between border-t pt-6">
            <div className="flex items-center">
              <img
                src={r.image}
                alt={r.name}
                className="w-20 h-20 rounded-lg object-cover mr-4"
              />
              <div className="space-y-1">
                <p className="font-semibold">{r.brand}</p>
                <p>{r.name}</p>
                <p>{r.price.toLocaleString()}원</p>
                <p className="text-gray-500 text-sm">{r.date}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => setWritingId(r.id)}
            >
              리뷰 작성
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}