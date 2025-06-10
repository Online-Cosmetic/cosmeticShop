// src/pages/user/MyComponents/ReviewWrite.jsx
import React, { useState, useRef } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
// import { userAPI } from '../../../utils/customAxios'; // 实际提交 API，请上线前取消注释

const mockProduct = {
  image: 'https://via.placeholder.com/80',
  brand: 'Sample Brand',
  name: 'Sample Product',
  price: 28000,
};

export default function ReviewWrite({ onCancel }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  const renderStar = idx => {
    const fill = hover || rating;
    if (fill >= idx) return <FaStar />;
    if (fill + 0.5 >= idx) return <FaStarHalfAlt />;
    return <FaRegStar />;
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files).slice(0, 4 - images.length);
    const previews = files.map(f => Object.assign(f, { preview: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...previews]);
  };

  const removeImage = idx => {
    URL.revokeObjectURL(images[idx].preview);
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    if (content.length < 20) return;
    // TODO: 提交到后端
    /*
    const form = new FormData();
    form.append('rating', rating);
    form.append('content', content);
    images.forEach((file, i) => form.append(`images[${i}]`, file));
    userAPI.review.submitReview(form)
      .then(() => { ... })
      .catch(err => console.error(err));
    */
    alert('리뷰가 등록되었습니다!');
    onCancel?.();
  };

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold border-b pb-4 mb-6">리뷰 작성</h2>
      <div className="flex items-center mb-6">
        <img src={mockProduct.image} alt={mockProduct.name} className="w-20 h-20 rounded-lg object-cover mr-4" />
        <div className="flex-1">
          <p className="font-semibold">{mockProduct.brand}</p>
          <p>{mockProduct.name}</p>
          <p>{mockProduct.price.toLocaleString()}원</p>
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
        disabled={content.length < 20}
        className={`w-full py-3 rounded-md text-white ${
          content.length < 20 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
        }`}
      >
        등록
      </button>
    </section>
  );
}
