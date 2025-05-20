import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI } from '../../utils/customAxios';

function QnADetaill() {
  const { id } = useParams();
  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    userAPI.qna.getDetail(id)
      .then((res) => {
        setQna(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("QnA 불러오기 실패:", err);
        setError('QnA 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-10">로딩 중...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;
  if (!qna) return <div className="p-10">데이터 없음</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-10">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">{qna.questionTitle}</h2>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{qna.nickname}</span>
          <span>{new Date(qna.questionedAt).toLocaleDateString('ko-KR')}</span>
        </div>
      </div>

      <div className="text-gray-700 text-base mb-12 whitespace-pre-wrap min-h-[200px]">
        {qna.content}
      </div>

      <div className="border-t pt-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Answer</h4>
        {qna.answered ? (
          <p className="text-gray-700 whitespace-pre-wrap">{qna.answer}</p>
        ) : (
          <p className="text-gray-400 italic">아직 답변이 등록되지 않았습니다.</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded hover:bg-gray-200">Edit</button>
        <button className="px-4 py-2 bg-red-100 text-sm border border-red-300 text-red-600 rounded hover:bg-red-200">Delete</button>
      </div>
    </div>
  );
}

export default QnADetaill;