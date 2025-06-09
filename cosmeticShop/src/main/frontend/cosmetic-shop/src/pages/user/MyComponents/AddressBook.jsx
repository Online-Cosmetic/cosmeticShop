import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../../../utils/customAxios';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await userAPI.addresses.getAll();
        setAddresses(res.data);
      } catch (err) {
        console.error('배송지 로드에 실패했습니다:', err);
        setError('배송지 로드에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 배송지를 삭제하시겠습니까?')) return;
    try {
      await userAPI.addresses.delete(id);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch (err) {
      console.error('배송지 삭제에 실패했습니다:', err);
      alert('배송지 삭제에 실패했습니다.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await userAPI.addresses.setDefault(id);
      
      // 서버 응답 후 UI 업데이트
      setAddresses(prev => {
        // 기존 배열을 복사하여 작업
        const updatedAddresses = [...prev];
        
        // 선택된 주소를 찾아 배열에서 제거
        const selectedAddress = updatedAddresses.find(addr => addr.id === id);
        const filteredAddresses = updatedAddresses.filter(addr => addr.id !== id);
        
        // 선택된 주소를 배열의 첫 번째 위치에 추가
        return [selectedAddress, ...filteredAddresses];
      });
    } catch (err) {
      console.error('기본 배송지 설정에 실패했습니다:', err);
      alert('기본 배송지 설정에 실패했습니다.');
    }
  };

  const handleEdit = (id) => {
    navigate(`/user/addresses/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/user/addresses/new');
  };

  if (loading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <section className="px-4">
      <div className="max-w-screen-lg mx-auto mt-6">
        <h3 className="text-3xl font-extrabold mb-4">배송지 관리</h3>
        <hr className="border-gray-300 mb-6 w-full" />

        <div className="space-y-6">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 배송지가 없습니다.
            </div>
          ) : (
            addresses.map((address, index) => (
              <div key={address.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg font-bold flex items-center">
                      {address.name}
                      {index === 0 && (
                        <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                          기본배송지
                        </span>
                      )}
                    </div>
                    <div className="text-gray-600">{address.recipient}</div>
                    <div className="text-gray-600">{address.address}</div>
                    <div className="text-gray-600">{address.phone}</div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {index !== 0 && (
                      <button
                        onClick={() => handleSetDefault(address.id)}
                        className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold"
                      >
                        기본 배송지 설정
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(address.id)}
                      className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleAdd}
            className="bg-gray-800 text-white w-full max-w-xs mx-auto block py-3 rounded shadow-md hover:bg-gray-700"
          >
            새 주소 등록
          </button>
        </div>
      </div>
    </section>
  );
}