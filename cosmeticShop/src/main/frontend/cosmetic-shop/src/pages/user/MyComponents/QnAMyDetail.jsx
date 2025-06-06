import React, { useEffect, useState } from 'react';
import { userAPI } from '../../../utils/customAxios';

function QnAMyDetail({ id, onBack }) {
  const [qna, setQna] = useState(null);

  useEffect(() => {
    userAPI.qna.getDetail(id)
      .then(response => setQna(response.data))
      .catch(error => {
        console.error("QnA 상세 조회 실패:", error);
        alert("접근 권한이 없거나 QnA를 불러올 수 없습니다.");
        onBack();
      });
  }, [id]);

  if (!qna) return null;

  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-bold mb-6">My Page</h2>

      {/* QnA 내용 영역 */}
      <div className="border-t border-b py-4 mb-6">
        <h3 className="text-xl font-semibold">{qna.questionTitle}</h3>
        <div className="flex justify-between text-sm text-gray-600 mt-2 mb-4">
          <span>{qna.nickname}</span>
          <span>######</span>
          <span>{new Date(qna.questionedAt).toLocaleDateString('ko-KR')}</span>
        </div>
        <div className="text-sm text-gray-800 whitespace-pre-line">{qna.questionContent}</div>
      </div>

      {/* 수정/삭제 버튼 */}
      <div className="flex justify-end space-x-2 mb-6">
        <button className="border px-4 py-1 text-sm rounded">Button</button>
        <button className="border px-4 py-1 text-sm rounded">Button</button>
      </div>

      {/* 이전/다음글 */}
      <div className="border-t border-b text-sm py-3 space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Previous Post</span>
          <span className="text-gray-800">Title</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-500">Next Post</span>
          <span className="text-gray-800">Title</span>
        </div>
      </div>

      {/* 목록 버튼 */}
      <div className="flex justify-center">
        <button onClick={onBack} className="border px-6 py-2 text-sm rounded">목록</button>
      </div>
    </div>
  );
}

export default QnAMyDetail;
