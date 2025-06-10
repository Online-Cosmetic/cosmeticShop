import React, { useState } from 'react';
import { userAPI } from '../../../utils/customAxios.js';
import { useNavigate } from 'react-router-dom';

export default function QnAMywrite() {
  const [formData, setFormData] = useState([{ title: '', content: '' }]); 
  const navigate = useNavigate();

  const handleChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const handleSubmit = async () => {
    const { title, content } = formData[0];
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
      {formData.map((data, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold mb-6">Q&A 작성</h2>

          <input
            type="text"
            placeholder="제목"
            value={data.title}
            onChange={(e) => handleChange(index, 'title', e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
          />

          <textarea
            placeholder="질문 내용을 입력하세요"
            value={data.content}
            onChange={(e) => handleChange(index, 'content', e.target.value)}
            rows={10}
            className="w-full border px-4 py-2 rounded mb-6"
          />

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              제출
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
