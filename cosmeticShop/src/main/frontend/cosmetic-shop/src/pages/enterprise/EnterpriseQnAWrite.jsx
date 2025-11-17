// src/pages/enterprise/EnterpriseQnAWrite.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EnterpriseQnAWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    setLoading(true);
    try {
      // TODO: 기업용 QnA 작성 API 호출 (백엔드 구현 후 연결)
      // await companyAPI.qna.create({
      //   questionTitle: title,
      //   content,
      // });
      
      // 임시로 성공 처리
      alert('QnA가 등록되었습니다.');
      navigate('/enterprise/qna');
    } catch (error) {
      console.error('QnA 등록 실패:', error);
      alert('QnA 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
      <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-neutral-800 border-b pb-4">기업 문의 작성하기</h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              placeholder="문의 내용을 자세히 입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-colors resize-none"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => navigate('/enterprise/qna')}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !content.trim()}
              className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnterpriseQnAWrite;

