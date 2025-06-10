import React, { useState, useEffect } from 'react';
import { userAPI } from '../../utils/customAxios';
import NavItem from './MyComponents/NavItem';
import OrderHistory from './MyComponents/OrderHistory';
import CancelledOrders from './MyComponents/CancelledOrders';
import OrderList from './MyComponents/OrderList';
import Wishlist from './MyComponents/Wishlist';
import Review from './MyComponents/Review';
import QnASection from './MyComponents/QnASection';
import EditInfo from './MyComponents/EditInfo';
import AddressBook from './MyComponents/AddressBook';
import Payments from './MyComponents/Payments';
import QnAMyDetail from './MyComponents/QnAMyDetail';
import Coupons from './MyComponents/Coupons'
import Default from './MyComponents/Default'

const SECTIONS = [
  { key: 'Default', label: '주문 조회', Component: Default },

  { key: 'orderHistory', label: '주문 조회', Component: OrderHistory },
  { key: 'returnOrders', label: '취소/반품/교환환 ', Component: CancelledOrders },
  { key: 'orderList', label: '자바구니', Component: OrderList },
  { key: 'wishlist', label: '찜 목록', Component: Wishlist },
  { key: 'review', label: '리뷰', Component: Review },
  { key: 'qna', label: 'Q&A', Component: QnASection },
  { key: 'Coupons', label: '쿠픈', Component: Coupons },
  { key: 'editInfo', label: '회원정보 수정정', Component: EditInfo },
  { key: 'address', label: '배송지 관리리', Component: AddressBook },
  { key: 'payments', label: '결제수단 관리리', Component: Payments },
];

function MyPage() {
  const [selected, setSelected] = useState(SECTIONS[0].key);
  const [selectedQnaId, setSelectedQnaId] = useState(null);
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    if (selected === 'qna') {
      userAPI.qna.getMyQnas()
        .then(res => setQnas(res.data))
        .catch(err => console.error('❌ QnA 불러오기 실패:', err));
    }
  }, [selected]);

  const Current = SECTIONS.find(s => s.key === selected).Component;

  return (
    <div className="w-full -mx-4 md:-mx-10">
      <div className="min-h-screen bg-white text-gray-900 p-4 md:p-10 flex flex-col md:flex-row">
        <aside className="w-full md:w-48 mb-8 md:mb-0">
          <h1 className="text-xl font-bold mb-6">My Page</h1>
          <h2 className="font-bold mb-2">Orders</h2>
          {SECTIONS.slice(1, 4).map(s => (
            <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
          ))}
          <h2 className="mt-6 font-bold mb-2">Activities</h2>
          {SECTIONS.slice(4, 8).map(s => (
            <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
          ))}
          <h2 className="mt-6 font-bold mb-2">Info</h2>
          {SECTIONS.slice(8).map(s => (
            <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
          ))}
        </aside>

        <main className="flex-1">
          {selected === 'qna' && selectedQnaId ? (
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
