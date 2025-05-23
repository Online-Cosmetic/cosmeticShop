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
    <div className="w-full max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Write a Q&A</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-4 py-2 rounded mb-4"
      />

      <textarea
        placeholder="Type your questions"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className="w-full border px-4 py-2 rounded mb-6"
      />

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default QnAWrite;
