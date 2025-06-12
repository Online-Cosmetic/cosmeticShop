import React, { useState } from 'react';
import { userAPI } from '../../utils/customAxios';
import { useNavigate } from 'react-router-dom';

function QnAWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    try {
      await userAPI.qna.create({
        questionTitle: title,
        content,
      });
      alert('QnA가 등록되었습니다.');
      navigate('/qna');
    } catch (error) {
      console.error('QnA 등록 실패:', error);
      alert('QnA 등록에 실패했습니다.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">문의 작성하기</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            id="title"
            type="text"
            placeholder="문의 제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea
            id="content"
            placeholder="문의 내용을 자세히 입력해주세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors"
          />
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={() => navigate('/qna')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default QnAWrite;
