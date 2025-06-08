import React from 'react';

export default function Payments() {
  // 示例用的 배열입니다. 실제로는 API 에서 받아온 데이터를 여기에 할당하면 됩니다.
  const accounts = [
    { id: 1, bankName: '□□은행', maskedNumber: '********123412' },
    { id: 2, bankName: '□□은행', maskedNumber: '********123412' },
    { id: 3, bankName: '□□은행', maskedNumber: '********123412' },
  ];

  const cards = [
    { id: 1, cardName: '카드이름', maskedNumber: '123412******1234' },
    { id: 2, cardName: '카드이름', maskedNumber: '123412******1234' },
    { id: 3, cardName: '카드이름', maskedNumber: '123412******1234' },
  ];


/*   const [accounts, setAccounts] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userAPI.payment.getPaymentHistory();

        setAccounts(res.data.accounts || []);
        setCards(res.data.cards || []);
      } catch (err) {
        console.error('Failed to load payments:', err);
        setError('결제수단 로드에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);


  const handleDeleteAccount = async (id) => {
    try {
      await userAPI.payment.cancelPayment(id, '사용자 요청'); // 或调用专门删除账户的接口
      setAccounts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('계좌 삭제에 실패했습니다.');
    }
  };


  const handleDeleteCard = async (id) => {
    try {
      await userAPI.payment.cancelPayment(id, '사용자 요청'); // 或调用专门删除卡片的接口
      setCards(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete card:', err);
      alert('카드 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  } */


  return (
    <section className="px-4">
      <div className="max-w-screen-md mx-auto mt-6">
        <h3 className="text-3xl font-extrabold mb-4">결제 관리</h3>
        <hr className="border-gray-300 mb-6 w-full" />

        <h4 className="text-xl font-bold mb-4">등록 계좌</h4>
        <div className="space-y-6">
          {accounts.map((acct) => (
            <div key={acct.id}>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-lg">{acct.bankName}</div>
                  <div className="text-gray-600">{acct.maskedNumber}</div>
                </div>
                <button
                  type="button"
                  className="w-32 py-2 text-sm font-bold border border-gray-300 rounded shadow-md hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
              <hr className="border-gray-200 my-3 w-full" />
            </div>
          ))}
        </div>

        <h4 className="text-xl font-bold mt-8 mb-4">등록 카드</h4>
        <div className="space-y-6">
          {cards.map((card) => (
            <div key={card.id}>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-lg">{card.cardName}</div>
                  <div className="text-gray-600">{card.maskedNumber}</div>
                </div>
                <button
                  type="button"
                  className="w-32 py-2 text-sm font-bold border border-gray-300 rounded shadow-md hover:bg-gray-100"
                >
                  삭제
                </button>
              </div>
              <hr className="border-gray-200 my-3 w-full" />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="bg-gray-800 text-white w-72 mx-auto block py-2.5 rounded shadow-sm hover:bg-gray-700"
          >
            새 결제수단 등록
          </button>
        </div>
      </div>
    </section>
  );
}