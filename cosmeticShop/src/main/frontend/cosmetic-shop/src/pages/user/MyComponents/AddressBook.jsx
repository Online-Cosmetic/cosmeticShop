import React from 'react';

export default function AddressBook() {
  return (
    <section className="px-4">
      <div className="max-w-screen-lg mx-auto mt-6">
        <h3 className="text-3xl font-extrabold mb-4">배송지 관리</h3>
        <hr className="border-gray-300 mb-6 w-full" />

        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-bold flex items-center">
                  배송지명
                  <span className="ml-2 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                    기본배송지
                  </span>
                </div>
                <div className="text-gray-600">이름</div>
                <div className="text-gray-600">경상북도 경산시 대학로 280 (대동, 영남대학교)</div>
                <div className="text-gray-600">000-0000-0000</div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  수정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  삭제
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-bold">배송지명</div>
                <div className="text-gray-600">이름</div>
                <div className="text-gray-600">경상북도 경산시 대학로 280 (대동, 영남대학교)</div>
                <div className="text-gray-600">000-0000-0000</div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  기본 배송지 설정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  수정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  삭제
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-bold">배송지명</div>
                <div className="text-gray-600">이름</div>
                <div className="text-gray-600">경상북도 경산시 대학로 280 (대동, 영남대학교)</div>
                <div className="text-gray-600">000-0000-0000</div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  기본 배송지 설정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  수정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  삭제
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <div>
                <div className="text-lg font-bold">배송지명</div>
                <div className="text-gray-600">이름</div>
                <div className="text-gray-600">경상북도 경산시 대학로 280 (대동, 영남대학교)</div>
                <div className="text-gray-600">000-0000-0000</div>
              </div>
              <div className="flex flex-col space-y-2">
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  기본 배송지 설정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  수정
                </button>
                <button className="w-40 py-2 text-sm border border-gray-300 rounded shadow-md hover:bg-gray-100 text-black font-bold">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            className="bg-gray-800 text-white w-full max-w-xs mx-auto block py-3 rounded shadow-md hover:bg-gray-700"
          >
            새 주소 등록
          </button>
        </div>
      </div>
    </section>
  );
}
