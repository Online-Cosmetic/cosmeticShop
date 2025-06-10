// src/pages/user/MyComponents/ReviewWrite.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { userAPI } from '../../../utils/customAxios';
import { getImageUrl } from '../../../utils/imageUtils';

export default function ReviewWrite({ onCancel, reviewData }) {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [rating, setRating] = useState(reviewData?.rating || 0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState(reviewData?.content || '');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  // 상품 정보 가져오기
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId && !reviewData) return;

      try {
        setLoading(true);
        const response = await userAPI.product.getById(productId || reviewData.productId);
        setProduct(response.data.productDTO);
      } catch (err) {
        console.error("상품 정보 로딩 중 오류 발생:", err);
        setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, reviewData]);

  const renderStar = idx => {
    const fill = hover || rating;
    if (fill >= idx) return <FaStar />;
    if (fill + 0.5 >= idx) return <FaStarHalfAlt />;
    return <FaRegStar />;
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files).slice(0, 4 - images.length);

    // 이미지 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`파일 '${file.name}'이(가) 크기 제한(5MB)을 초과했습니다.`);
        return false;
      }
      return true;
    });

    const previews = validFiles.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = idx => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (content.length < 20) return;
    if (!rating) {
      alert('별점을 선택해주세요.');
      return;
    }

    try {
      setSubmitting(true);

      // 이미지 업로드 처리
      let imageUrls = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((file, i) => formData.append(`images`, file));

        const imageResponse = await userAPI.review.uploadImages(formData);
        imageUrls = imageResponse.data;
      }

      // 리뷰 데이터 생성
      const reviewPostData = {
        productId: productId || reviewData?.productId,
        content: content,
        rating: Math.round(rating), // 정수로 변환
        imageUrls: imageUrls
      };

      if (reviewData?.id) {
        // 리뷰 수정
        await userAPI.review.updateReview(reviewData.id, reviewPostData);
      } else {
        // 새 리뷰 작성
        await userAPI.review.createReview(reviewPostData);
      }

      // 성공 페이지로 이동
      navigate('/user/review/thanks');
    } catch (err) {
      console.error("리뷰 제출 중 오류 발생:", err);
      alert('리뷰 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">상품 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10">상품 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <section className="px-4">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">리뷰 작성</h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            취소
          </button>
        )}
      </div>

      <div className="flex items-center mb-6">
        <img 
          src={product.thumbnailImageUrl ? getImageUrl(product.thumbnailImageUrl) : "https://via.placeholder.com/80"} 
          alt={product.productName} 
          className="w-20 h-20 rounded-lg object-cover mr-4"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
          }}
        />
        <div className="flex-1">
          <p className="font-semibold">{product.productName}</p>
          <p className="text-gray-600">{product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}</p>
          <p>{product.price.toLocaleString()}원</p>
        </div>
        <div className="flex items-center space-x-1 text-2xl">
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              type="button"
              className="focus:outline-none text-yellow-400 hover:text-yellow-500"
              onClick={() => setRating(rating === i ? i - 0.5 : i)}
              onMouseEnter={() => setHover(i - 0.5)}
              onMouseLeave={() => setHover(0)}
            >
              {renderStar(i)}
            </button>
          ))}
          <span className="ml-2 text-base text-gray-600">{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block font-medium mb-2">
          상세한 상품 리뷰를 작성해주세요. (20자 이상)
        </label>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring"
          placeholder="상세한 리뷰를 작성해주세요!"
          maxLength={500}
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="text-right text-sm text-gray-500">{content.length} / 500</div>
      </div>

      <div className="mb-8">
        <label className="block font-medium mb-2">사진을 첨부해주세요. (선택)</label>
        <div className="grid grid-cols-4 gap-2">
          {images.map((file, idx) => (
            <div key={idx} className="relative">
              <img src={file.preview} alt={`upload-${idx}`} className="w-full h-20 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
              >×</button>
            </div>
          ))}
          {images.length < 4 && (
            <div
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center border border-dashed rounded-md cursor-pointer text-gray-400"
              style={{ height: '80px' }}
            >
              + {images.length} / 4
            </div>
          )}
        </div>
        <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleImageChange} />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={content.length < 20 || !rating || submitting}
        className={`w-full py-3 rounded-md text-white ${
          content.length < 20 || !rating || submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        }`}
      >
        {submitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            제출 중...
          </span>
        ) : (
          '등록'
        )}
      </button>
    </section>
  );
}
