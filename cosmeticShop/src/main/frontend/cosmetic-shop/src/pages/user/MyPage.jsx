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

const SECTIONS = [
  { key: 'orderHistory', label: 'Order History', Component: OrderHistory },
  { key: 'returnOrders', label: 'Cancelled Orders', Component: CancelledOrders },
  { key: 'orderList', label: 'List', Component: OrderList },
  { key: 'wishlist', label: 'Wishlist', Component: Wishlist },
  { key: 'review', label: 'Review', Component: Review },
  { key: 'qna', label: 'Q&A', Component: QnASection },
  { key: 'editInfo', label: 'Edit Info', Component: EditInfo },
  { key: 'address', label: 'Address', Component: AddressBook },
  { key: 'payments', label: 'Payments', Component: Payments },
];

function MyPage() {
  const [selected, setSelected] = useState(SECTIONS[0].key);
  const [qnas, setQnas] = useState([]);

  useEffect(() => {
    if (selected === 'qna') {
      userAPI.qna.getMyQnas()
        .then(res => setQnas(res.data))
        .catch(err => console.error('QnA 불러오기 실패:', err));
    }
  }, [selected]);

  const Current = SECTIONS.find(s => s.key === selected).Component;

  return (
    <div className="min-h-screen bg-white text-gray-900 p-4 md:p-10 flex flex-col md:flex-row">
      <aside className="w-full md:w-48 mb-8 md:mb-0">
        <h1 className="text-xl font-bold mb-6">My Page</h1>
        <h2 className="font-bold mb-2">Orders</h2>
        {SECTIONS.slice(0,3).map(s => (
          <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
        ))}
        <h2 className="mt-6 font-bold mb-2">Activities</h2>
        {SECTIONS.slice(3,6).map(s => (
          <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
        ))}
        <h2 className="mt-6 font-bold mb-2">Info</h2>
        {SECTIONS.slice(6).map(s => (
          <NavItem key={s.key} section={s} selected={selected} onSelect={setSelected} />
        ))}
      </aside>

      <main className="flex-1">
        {selected === 'qna' ? <Current items={qnas} /> : <Current />}
      </main>
    </div>
  );
}

export default MyPage;