// src/pages/user/MyComponents/ReviewWrite.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { IoMdWarning } from 'react-icons/io';
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

  // 이미지 업로드 관련 설정
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB (서버 설정에 맞춤)
  const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8MB (총 업로드 크기 제한)
  const MAX_FILES = 4; // 최대 파일 개수

  // 현재 업로드된 이미지의 총 크기
  const [totalSize, setTotalSize] = useState(0);
  const [sizeError, setSizeError] = useState(null);

  // 상품 정보 가져오기 - useCallback으로 감싸서 불필요한 재생성 방지
  const fetchProductData = useCallback(async () => {
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
  }, [productId, reviewData]); // 의존성 배열에는 productId와 reviewData만 포함

  // 컴포넌트 마운트 시 한 번만 상품 정보 가져오기
  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]); // fetchProductData가 변경될 때만 실행

  // 이미지 변경 시 총 크기 계산
  useEffect(() => {
    const newTotalSize = images.reduce((acc, img) => acc + img.size, 0);
    setTotalSize(newTotalSize);

    if (newTotalSize > MAX_TOTAL_SIZE) {
      setSizeError(`총 이미지 크기가 제한(${formatSize(MAX_TOTAL_SIZE)})을 초과했습니다.`);
    } else {
      setSizeError(null);
    }
  }, [images]);

  // 파일 크기 형식화 함수
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderStar = idx => {
    const fill = hover || rating;
    if (fill >= idx) return <FaStar />;
    if (fill + 0.5 >= idx) return <FaStarHalfAlt />;
    return <FaRegStar />;
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files).slice(0, MAX_FILES - images.length);
    let hasError = false;
    let newTotalSize = totalSize;

    // 이미지 크기 검증
    const validFiles = files.filter(file => {
      // 개별 파일 크기 검사
      if (file.size > MAX_FILE_SIZE) {
        alert(`파일 '${file.name}'이(가) 개별 크기 제한(${formatSize(MAX_FILE_SIZE)})을 초과했습니다.`);
        hasError = true;
        return false;
      }

      // 총 크기 검사
      newTotalSize += file.size;
      if (newTotalSize > MAX_TOTAL_SIZE) {
        alert(`총 이미지 크기가 제한(${formatSize(MAX_TOTAL_SIZE)})을 초과했습니다.`);
        hasError = true;
        return false;
      }

      return true;
    });

    if (hasError) {
      // 에러가 있으면 새로운 파일 추가하지 않음
      return;
    }

    const previews = validFiles.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = idx => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // 리뷰 내용 변경 처리 - 디바운스 적용하지 않음 (불필요한 API 호출 없음)
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    if (content.length < 20) return;
    if (!rating) {
      alert('별점을 선택해주세요.');
      return;
    }

    // 총 이미지 크기 검사
    if (totalSize > MAX_TOTAL_SIZE) {
      alert(`총 이미지 크기가 제한(${formatSize(MAX_TOTAL_SIZE)})을 초과했습니다. 일부 이미지를 제거해주세요.`);
      return;
    }

    try {
      setSubmitting(true);

      // 이미지 업로드 처리
      let imageUrls = [];
      if (images.length > 0) {
        const formData = new FormData();

        // Content-Type 헤더를 설정하지 않도록 함 (브라우저가 자동으로 처리)
        // 각 이미지 파일에 대해 개별적으로 압축 적용
        const compressedImages = await Promise.all(
            images.map(async (file) => {
              // 이미 작은 파일은 그대로 사용
              if (file.size < 500 * 1024) { // 500KB 미만
                return file;
              }

              // 압축이 필요한 경우에만 수행
              try {
                // 이미지가 이미 압축된 형태(JPEG, WebP 등)라면 그대로 사용
                return file;
              } catch (err) {
                console.warn("이미지 압축 실패, 원본 사용:", err);
                return file;
              }
            })
        );

        compressedImages.forEach((file) => formData.append('images', file));

        try {
          const imageResponse = await userAPI.review.uploadImages(formData);
          imageUrls = imageResponse.data;
          console.log("업로드된 이미지 URL:", imageUrls);
        } catch (err) {
          console.error("이미지 업로드 중 오류 발생:", err);
          console.error("오류 응답:", err.response);

          // 이미지 업로드 실패 원인 확인
          if (err.response?.status === 413) {
            throw new Error("이미지 크기가 서버 제한을 초과했습니다. 더 작은 이미지를 사용해주세요.");
          } else if (err.response?.status === 403) {
            throw new Error("이미지 업로드 권한이 없습니다.");
          } else if (err.response?.data?.message) {
            throw new Error(err.response.data.message);
          }
          throw new Error("이미지 업로드에 실패했습니다.");
        }
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
      alert(err.message || '리뷰 제출에 실패했습니다. 다시 시도해주세요.');
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

        <div className="mb-6">
          <div className="flex items-start mb-4">
            <img
                src={product.thumbnailImageUrl ? getImageUrl(product.thumbnailImageUrl) : "https://via.placeholder.com/80"}
                alt={product.productName}
                className="w-20 h-20 rounded-lg object-cover mr-4 flex-shrink-0"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80x80.png?text=No+Image";
                }}
            />
            <div className="flex-1">
              <p className="font-semibold text-lg mb-1">{product.productName}</p>
              <p className="text-gray-600 text-sm mb-2">{product.description?.substring(0, 50)}{product.description?.length > 50 ? '...' : ''}</p>
              <p className="text-emerald-600 font-semibold">{product.price.toLocaleString()}원</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-2xl border-t pt-4">
            <span className="text-sm text-gray-700 mr-2">별점:</span>
            {[1,2,3,4,5].map(i => (
                <button
                    key={i}
                    type="button"
                    className="focus:outline-none text-yellow-400 hover:text-yellow-500 transition-colors"
                    onClick={() => setRating(rating === i ? i - 0.5 : i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                >
                  {renderStar(i)}
                </button>
            ))}
            <span className="ml-2 text-base text-gray-600 font-medium">{rating.toFixed(1)}</span>
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
              onChange={handleContentChange} // 전용 핸들러 사용
          />
          <div className="text-right text-sm text-gray-500">{content.length} / 500</div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-medium">사진을 첨부해주세요. (선택)</label>
            <span className="text-sm text-gray-500">
            현재 사용량: {formatSize(totalSize)} / {formatSize(MAX_TOTAL_SIZE)}
          </span>
          </div>

          {/* 이미지 업로드 가이드라인 */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3 text-sm text-blue-700">
            <p>• 이미지는 최대 {MAX_FILES}개까지 첨부 가능합니다.</p>
            <p>• 개별 이미지는 {formatSize(MAX_FILE_SIZE)} 이하여야 합니다.</p>
            <p>• 총 이미지 크기는 {formatSize(MAX_TOTAL_SIZE)} 이하여야 합니다.</p>
          </div>

          {/* 사이즈 오류 표시 */}
          {sizeError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3 text-sm text-red-700 flex items-center">
                <IoMdWarning className="text-red-500 mr-2 text-lg" />
                {sizeError}
              </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {images.map((file, idx) => (
                <div key={idx} className="relative">
                  <img src={file.preview} alt={`upload-${idx}`} className="w-full h-20 object-cover rounded-md" />
                  <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
                  >×</button>
                  <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-0.5">
                {formatSize(file.size)}
              </span>
                </div>
            ))}
            {images.length < MAX_FILES && !sizeError && (
                <div
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center justify-center border border-dashed rounded-md cursor-pointer text-gray-400"
                    style={{ height: '80px' }}
                >
                  + {images.length} / {MAX_FILES}
                </div>
            )}
          </div>
          <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={sizeError !== null}
          />
        </div>

        <div className="mb-4">
          {content.length < 20 && (
            <div className="mb-2 text-sm text-orange-600">
              리뷰 내용을 20자 이상 입력해주세요. (현재: {content.length}자)
            </div>
          )}
          {!rating && (
            <div className="mb-2 text-sm text-orange-600">
              별점을 선택해주세요.
            </div>
          )}
        </div>

        <button
            type="button"
            onClick={handleSubmit}
            disabled={content.length < 20 || !rating || submitting || sizeError !== null}
            className={`w-full py-4 rounded-lg text-white font-semibold text-lg shadow-lg transition-all ${
                content.length < 20 || !rating || submitting || sizeError !== null 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
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
              '리뷰 작성하기'
          )}
        </button>
      </section>
  );
}