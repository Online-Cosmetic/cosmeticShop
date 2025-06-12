import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../utils/customAxios';
import { getImageUrl } from '../../../utils/imageUtils';

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userAPI.product.likes.getLikedProducts();
        console.log('좋아요 상품 데이터:', res.data); // 디버깅용 로그
        
        // 응답 데이터 처리 및 이미지 URL 변환
        const likedProducts = res.data.map(product => ({
          id: product.productId,
          productName: product.productName,
          brand: product.companyName,
          price: product.price,
          discountRate: product.discountRate || 0,
          imageUrl: product.imageUrl ? getImageUrl(product.imageUrl) : "https://via.placeholder.com/300x300.png?text=No+Image",
          quantity: 1 // 좋아요 목록에서는 수량이 필요 없지만, ProductCard에서 참조하므로 기본값 설정
        }));
        setItems(likedProducts);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
        setError('찜 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(item => item.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm('선택된 상품을 정말 삭제하시겠습니까?')) return;

    try {
      await Promise.all(
          Array.from(selectedIds).map(id => userAPI.product.likes.toggleLike(id))
      );
      setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
      alert('선택한 상품이 찜 목록에서 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await userAPI.product.likes.toggleLike(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      alert('상품이 찜 목록에서 삭제되었습니다.');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleAddToCart = async (id) => {
    try {
      // 기본 수량 1로 장바구니에 추가
      await userAPI.cart.addToCart(id, 1);
      alert('장바구니에 담았습니다.');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('장바구니에 담기 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
      <section className="w-full bg-white p-10 min-h-screen">

        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center space-x-2"/>
          <button
              onClick={handleBulkDelete}
              className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            일괄삭제
          </button>
        </div>

        <div className="space-y-6">
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              좋아요 누른 상품이 없습니다.
            </div>
          )}
          
          {items.map(item => (
              <div key={item.id} className="border-b pb-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="form-checkbox h-5 w-5 text-primary"
                  />
                  <div className="relative overflow-hidden rounded-lg shadow-sm group">
                    <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          console.error("이미지 로드 실패");
                          e.target.src = "https://placehold.co/600x400";
                        }}
                    />
                    {item.discountRate > 0 && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-md">
                        {item.discountRate}%
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">{item.brand}</div>
                    <div className="text-lg font-semibold text-gray-900">{item.productName}</div>
                    <div className="mt-1">
                      {item.discountRate > 0 ? (
                        <div className="flex items-center mb-1">
                          <span className="text-gray-500 text-sm line-through mr-2">{item.price.toLocaleString()}원</span>
                          <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded font-medium">{item.discountRate}% 할인</span>
                        </div>
                      ) : (
                        <div className="h-5">{/* 할인이 없을 때 공간 유지 */}</div>
                      )}
                      <p className={`font-bold text-xl ${item.discountRate > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {Math.floor(item.price * (1 - item.discountRate / 100)).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                      onClick={() => handleAddToCart(item.id)}
                      className="border px-4 py-2 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors duration-200"
                  >
                    장바구니에 담기
                  </button>
                  <button
                      onClick={() => handleDelete(item.id)}
                      className="border px-4 py-2 rounded hover:bg-gray-100"
                  >
                    삭제
                  </button>
                </div>
              </div>
          ))}
        </div>
      </section>
  );
}