import React, { useState, useEffect } from 'react';
// import { userAPI } from '../../../utils/customAxios';

export default function Wishlist() {
  // 假数据示例
  const mockItems = [
    { id: 1, imageUrl: '/images/sample1.jpg', brand: 'Mock Brand', productName: 'Mock Product A', price: 10000 },
    { id: 2, imageUrl: '/images/sample2.jpg', brand: 'Mock Brand', productName: 'Mock Product B', price: 20000 },
    { id: 3, imageUrl: '/images/sample3.jpg', brand: 'Mock Brand', productName: 'Mock Product C', price: 30000 },
  ];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  useEffect(() => {
    // f data
    setItems(mockItems);
    setLoading(false);

    /*
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userAPI.wishlist.getMyWishlist();
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
        setError('찜 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
    */
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
    //  API dele
    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());

    /*
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => userAPI.wishlist.delete(id))
      );
      setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to bulk delete:', err);
      alert('삭제에 실패했습니다.');
    }
    */
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    // dele data
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    /*
    try {
      await userAPI.wishlist.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('삭제에 실패했습니다.');
    }
    */
  };

  const handleAddToCart = async (id) => {

    alert(`已将商品 ${id} 加入购物车`);

    /*
    try {
      await userAPI.cart.addToCart(id);
      alert('장바구니에 담았습니다.');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('장바구니에 담기 실패했습니다.');
    }
    */
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <section className="w-full bg-white p-10 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Wishlist</h2>

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="form-checkbox h-5 w-5 text-primary"
          />
          <span>Select All</span>
        </label>
        <button
          onClick={handleBulkDelete}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          일괄삭제
        </button>
      </div>

      <div className="space-y-6">
        {items.map(item => (
          <div key={item.id} className="border-b pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedIds.has(item.id)}
                onChange={() => toggleSelect(item.id)}
                className="form-checkbox h-5 w-5 text-primary"
              />
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <div className="font-bold">{item.brand}</div>
                <div className="text-gray-800">{item.productName}</div>
                <div className="text-gray-600">{item.price.toLocaleString()}원</div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleAddToCart(item.id)}
                className="border px-4 py-2 rounded hover:bg-gray-100"
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
