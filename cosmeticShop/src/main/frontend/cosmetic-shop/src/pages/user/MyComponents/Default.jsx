import React from 'react';

// MyPage menu options
const MENU_OPTIONS = [
  { key: 'orderHistory', label: '주문 조회 및 삭제', icon: '📦', description: '주문 내역을 확인하고 관리합니다' },
  { key: 'wishlist', label: '찜 목록', icon: '❤️', description: '관심 상품을 확인합니다' },
  { key: 'review', label: '리뷰', icon: '✍️', description: '작성한 리뷰를 확인하고 관리합니다' },
  { key: 'qna', label: '나의 Q&A', icon: '❓', description: '문의 내역을 확인하고 관리합니다' },
  { key: 'Coupons', label: '쿠폰', icon: '🎟️', description: '보유한 쿠폰을 확인합니다' },
  { key: 'editInfo', label: '회원정보 수정', icon: '👤', description: '회원 정보를 수정합니다' },
  { key: 'address', label: '배송지 관리', icon: '🏠', description: '배송지를 관리합니다' },
];

export default function Default({ onSelect }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">마이페이지 메뉴</h2>
        <p className="text-gray-600">원하시는 메뉴를 선택하여 이동하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MENU_OPTIONS.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect && onSelect(option.key)}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-emerald-300 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="text-5xl text-emerald-500 mb-4">{option.icon}</div>
            <h4 className="text-lg font-semibold text-neutral-800">{option.label}</h4>
            <p className="text-gray-600 mt-2">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}