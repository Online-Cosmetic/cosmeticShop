import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';
import { getImageUrl } from '../../../utils/imageUtils';
import { FaStar, FaRegStar, FaEdit, FaTrash } from 'react-icons/fa';
import ReviewWrite from './ReviewWrite';

export default function Review() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 리뷰 목록 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await userAPI.review.getMyProductReviews();
        setReviews(response.data);
      } catch (err) {
        console.error('❌ 리뷰 불러오기 실패:', err);
        setError('리뷰를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 리뷰 삭제 처리
  const handleDeleteReview = async (reviewId) => {
    if (confirmDelete !== reviewId) {
      setConfirmDelete(reviewId);
      return;
    }

    try {
      await userAPI.review.deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      setConfirmDelete(null);
    } catch (err) {
      console.error('❌ 리뷰 삭제 실패:', err);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 리뷰 수정 페이지로 이동
  const handleEditReview = (reviewId) => {
    navigate(`/user/review/edit/${reviewId}`);
  };

  if (loading) {
    return <div className="text-center py-10">리뷰를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }


  return (
    <section className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">내 리뷰</h2>
        <Link 
          to="/user/orders" 
          className="text-emerald-600 hover:text-emerald-700 font-medium"
        >
          구매 내역 보기
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">작성한 리뷰가 없습니다.</p>
          <Link 
            to="/user/orders" 
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 font-medium"
          >
            구매 내역에서 리뷰 작성하기
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <img
                    src={review.product.thumbnailImageUrl ? getImageUrl(review.product.thumbnailImageUrl) : "https://via.placeholder.com/80"}
                    alt={review.product.productName}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{review.product.productName}</h3>
                    <div className="flex text-yellow-400 my-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? <FaStar /> : <FaRegStar />}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditReview(review.id)}
                    className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                    title="리뷰 수정"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDeleteReview(review.id)}
                    className={`p-2 ${confirmDelete === review.id ? 'text-red-600' : 'text-gray-500 hover:text-red-600'} transition-colors`}
                    title={confirmDelete === review.id ? "삭제 확인" : "리뷰 삭제"}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* 리뷰 이미지 */}
              {review.reviewImages && review.reviewImages.length > 0 && (
                <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                  {review.reviewImages.map((image, idx) => (
                    <img 
                      key={idx}
                      src={getImageUrl(image.imageUrl)}
                      alt={`리뷰 이미지 ${idx + 1}`}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
                      }}
                    />
                  ))}
                </div>
              )}

              <p className="text-gray-700 mt-4">{review.content}</p>

              {/* 좋아요 수 표시 */}
              {review.liked > 0 && (
                <div className="mt-3 text-sm text-gray-500">
                  <span className="font-medium text-emerald-600">{review.liked}</span> 명이 이 리뷰를 좋아합니다
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
