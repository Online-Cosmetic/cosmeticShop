// src/pages/enterprise/EnterpriseQnADetail.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { companyAPI } from '../../utils/customAxios';

function EnterpriseQnADetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const contentRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // 현재 로그인한 기업 정보 가져오기
  useEffect(() => {
    const fetchCurrentCompany = async () => {
      try {
        setUserLoading(true);
        const response = await companyAPI.profile.getProfile();
        setCurrentCompany(response.data);
        setUserLoading(false);
      } catch (err) {
        console.error("기업 정보 불러오기 실패:", err);
        setUserLoading(false);
      }
    };

    fetchCurrentCompany();
  }, []);

  // QnA 상세 정보 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchQnaDetail = async () => {
      try {
        setLoading(true);
        const res = await companyAPI.qna.getDetail(id);
        setQna(res.data);
        setEditedTitle(res.data.questionTitle);
        setEditedContent(res.data.content);
        setLoading(false);
      } catch (err) {
        console.error("QnA 불러오기 실패:", err);
        setError('QnA 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchQnaDetail();
  }, [id, location.key]); // id나 location.key가 변경될 때마다 데이터 불러오기

  // 수정 모드 활성화 및 텍스트 영역에 포커스
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  // 현재 기업이 글 작성자인지 확인 (기업명 기반으로 검증)
  const isAuthor = currentCompany && qna && currentCompany.companyName === qna.companyName;

  // 수정 기능 처리
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (qna) {
      setEditedTitle(qna.questionTitle);
      setEditedContent(qna.content);
    }
  };

  // 수정 내용 저장
  const handleSaveEdit = async () => {
    try {
      await companyAPI.qna.update(id, {
        questionTitle: editedTitle,
        content: editedContent
      });

      // 상태 업데이트
      if (qna) {
        setQna({
          ...qna,
          questionTitle: editedTitle,
          content: editedContent
        });
      }
      setIsEditing(false);
      alert('질문이 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error("QnA 수정 실패:", err);
      alert('질문 수정에 실패했습니다.');
    }
  };

  // 삭제 기능 처리
  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await companyAPI.qna.delete(id);
      alert('질문이 성공적으로 삭제되었습니다.');
      navigate('/enterprise/qna');
    } catch (err) {
      console.error("QnA 삭제 실패:", err);
      alert('질문 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  if (loading || userLoading) {
    return (
      <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!qna) {
    return (
      <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-gray-500">데이터 없음</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
      <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
        {/* 헤더 */}
        <div className="border-b pb-4 mb-6">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold mb-2 text-neutral-800 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          ) : (
            <h2 className="text-3xl font-bold mb-2 text-neutral-800">{qna.questionTitle}</h2>
          )}
          <div className="flex justify-between text-sm text-gray-500">
            <span>{qna.companyName || '기업명'}</span>
            <span>{new Date(qna.questionedAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        {/* 질문 내용 */}
        <div className="text-gray-700 text-base mb-12 whitespace-pre-wrap min-h-[200px]">
          {isEditing ? (
            <textarea
              ref={contentRef}
              className="w-full h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            qna.content
          )}
        </div>

        {/* 답변 섹션 */}
        <div className="border-t pt-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">답변</h4>
          {(qna.isAnswered || qna.answered || qna.answer) ? (
            <p className="text-gray-700 whitespace-pre-wrap">{qna.answer || '답변이 등록되었습니다.'}</p>
          ) : (
            <p className="text-gray-400 italic">아직 답변이 등록되지 않았습니다.</p>
          )}
        </div>

        {/* 작성자만 수정/삭제 버튼 표시 */}
        {isAuthor && (
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  수정
                </button>
                <button 
                  onClick={handleDelete}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    isDeleting 
                      ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                      : 'bg-red-100 text-red-600 border-red-300 hover:bg-red-200'
                  }`}
                >
                  {isDeleting ? '정말 삭제하시겠습니까?' : '삭제'}
                </button>
              </>
            )}
          </div>
        )}

        {/* 목록으로 돌아가기 버튼 */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate('/enterprise/qna')}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnterpriseQnADetail;

