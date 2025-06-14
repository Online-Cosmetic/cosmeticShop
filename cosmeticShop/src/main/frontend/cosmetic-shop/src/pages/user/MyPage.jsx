import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/customAxios';
import NavItem from './MyComponents/NavItem';
import OrderHistory from './MyComponents/OrderHistory';
import Wishlist from './MyComponents/Wishlist';
import Review from './MyComponents/Review';
import QnASection from './MyComponents/QnASection';
import EditInfo from './MyComponents/EditInfo';
import AddressBook from './MyComponents/AddressBook';
import Coupons from './MyComponents/Coupons'
import Default from './MyComponents/Default'

const SECTIONS = [
  { key: 'Default', label: '한 눈에 보기', Component: Default, icon: '📋' },
  { key: 'orderHistory', label: '주문 조회 및 삭제', Component: OrderHistory, icon: '📦' },
  { key: 'wishlist', label: '찜 목록', Component: Wishlist, icon: '❤️' },
  { key: 'review', label: '리뷰', Component: Review, icon: '✍️' },
  { key: 'qna', label: '나의 Q&A', Component: QnASection, icon: '❓' },
  { key: 'Coupons', label: '쿠폰', Component: Coupons, icon: '🎟️' },
  { key: 'editInfo', label: '회원정보 수정', Component: EditInfo, icon: '👤' },
  { key: 'address', label: '배송지 관리', Component: AddressBook, icon: '🏠' },
];

function MyPage() {
  const [selected, setSelected] = useState(SECTIONS[0].key);
  const [selectedQnaId, setSelectedQnaId] = useState(null);
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (selected !== 'Default') {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [selected]);

  useEffect(() => {
    if (selected === 'qna') {
      setLoading(true);
      setError(null);
      userAPI.qna.getMyQnas()
        .then(res => {
          setQnas(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('❌ QnA 불러오기 실패:', err);
          setError('QnA 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
          setLoading(false);
        });
    }
  }, [selected]);

  const Current = SECTIONS.find(s => s.key === selected).Component;
  
  const handleSelect = (key) => {
    setSelected(key);
    if (key === 'Default') {
      setIsSidebarOpen(false);
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full max-w-[1262px] mx-auto">
      <div className="bg-white rounded-2xl shadow border p-6 relative">
        {/* 헤더 영역 - Default 페이지가 아닐 때만 표시 */}
        {selected !== 'Default' && (
          <div className="flex items-center mb-6 border-b pb-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 bg-emerald-50 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors mr-3"
              aria-label="메뉴 토글"
            >
              {isSidebarOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            <h1 className="text-2xl font-bold text-neutral-800">마이페이지</h1>
          </div>
        )}

        {/* 메인 콘텐츠 레이아웃 */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 - 완전히 숨기거나 표시함 */}
          {selected !== 'Default' && isSidebarOpen && (
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="space-y-6">
                  <div>
                    <ul className="space-y-1">
                      {SECTIONS.slice(0, 4).map(s => (
                        <NavItem key={s.key} section={s} selected={selected} onSelect={handleSelect} />
                      ))}
                    </ul>
                  </div>
                  <div>
                    <ul className="space-y-1">
                      {SECTIONS.slice(4, 8).map(s => (
                        <NavItem key={s.key} section={s} selected={selected} onSelect={handleSelect} />
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 메인 콘텐츠 영역 - 사이드바가 없을 때 전체 너비 사용 */}
          <div className="flex-1 transition-all duration-300">
            {selected === 'Default' ? (
              <Current onSelect={handleSelect} />
            ) : (
              <Current items={selected === 'qna' ? qnas : []} onQnaClick={setSelectedQnaId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;