import React from 'react';

export default function Payments() {
  return (
    <section className="px-4">
      <div className="max-w-screen-md mx-auto mt-6">
        <h3 className="text-3xl font-extrabold mb-4">결제 관리</h3>
        <hr className="border-gray-300 mb-6 w-full" />

        <h4 className="text-xl font-bold mb-4">등록 계좌</h4>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">□□은행</div>
                <div className="text-gray-600">********123412</div>
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

          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">□□은행</div>
                <div className="text-gray-600">********123412</div>
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

          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">□□은행</div>
                <div className="text-gray-600">********123412</div>
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
        </div>

        <h4 className="text-xl font-bold mt-8 mb-4">등록 카드</h4>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">카드이름</div>
                <div className="text-gray-600">123412******1234</div>
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

          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">카드이름</div>
                <div className="text-gray-600">123412******1234</div>
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

          <div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-lg">카드이름</div>
                <div className="text-gray-600">123412******1234</div>
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
