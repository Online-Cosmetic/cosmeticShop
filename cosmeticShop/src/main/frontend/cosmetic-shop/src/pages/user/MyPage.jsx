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
  const currentSection = SECTIONS.find(s => s.key === selected);

  return (
    <div className="w-full max-w-[1262px] mx-auto">
      <div className="bg-white rounded-2xl shadow border p-6 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-neutral-800 border-b border-gray-200 pb-4">마이페이지</h1>

            <div className="space-y-6">
              <div>
                <ul className="space-y-1">
                  {SECTIONS.slice(1, 4).map(s => (
                    <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-1">
                  {SECTIONS.slice(4, 8).map(s => (
                    <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
                  ))}
                </ul>
              </div>

              <div>
                <ul className="space-y-1">
                  {SECTIONS.slice(8).map(s => (
                    <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Page Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentSection.icon}</span>
              <h2 className="text-2xl font-bold text-neutral-800">{currentSection.label}</h2>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-xl text-gray-500">데이터를 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <div className="text-xl text-red-500">{error}</div>
            </div>
          ) : selected === 'qna' && selectedQnaId ? (
            <QnAMyDetail id={selectedQnaId} onBack={() => setSelectedQnaId(null)} />
          ) : (
            <Current
              items={qnas}
              onQnaClick={(id) => {
                if (selected === 'qna') setSelectedQnaId(id);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default MyPage;
