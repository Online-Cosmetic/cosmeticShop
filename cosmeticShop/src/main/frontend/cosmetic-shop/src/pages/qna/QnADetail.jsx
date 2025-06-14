import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../../utils/customAxios';
import { toast } from 'react-toastify';

function QnADetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const contentRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setUserLoading(true);
        const response = await userAPI.profile.getProfile();
        setCurrentUser(response.data);
        console.log("현재 로그인한 사용자:", response.data);
        setUserLoading(false);
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
        setUserLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // QnA 상세 정보 가져오기
  useEffect(() => {
    if (!id) return;

    userAPI.qna.getDetail(id)
      .then((res) => {
        console.log("QnA 데이터:", res.data);
        setQna(res.data);
        setEditedContent(res.data.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error("QnA 불러오기 실패:", err);
        setError('QnA 정보를 불러오는 데 실패했습니다.');
        setLoading(false);
      });
  }, [id]);

  // 수정 모드 활성화 및 텍스트 영역에 포커스
  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  // 현재 사용자가 글 작성자인지 확인 (닉네임 기반으로 검증)
  const isAuthor = currentUser && qna && currentUser.nickname === qna.nickname;

  // 수정 기능 처리
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(qna.content);
  };

  // 수정 내용 저장
  const handleSaveEdit = async () => {
    try {
      await userAPI.qna.update(id, {
        questionTitle: qna.questionTitle,
        content: editedContent
      });

      // 상태 업데이트
      setQna({
        ...qna,
        content: editedContent
      });

      setIsEditing(false);
      toast.success('질문이 성공적으로 수정되었습니다.');
    } catch (err) {
      console.error("QnA 수정 실패:", err);
      toast.error('질문 수정에 실패했습니다.');
    }
  };

  // 삭제 기능 처리
  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await userAPI.qna.delete(id);
      toast.success('질문이 성공적으로 삭제되었습니다.');
      navigate('/qna'); // 삭제 후 QnA 페이지로 이동
    } catch (err) {
      console.error("QnA 삭제 실패:", err);
      toast.error('질문 삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  if (loading || userLoading) return <div className="p-10">로딩 중...</div>;
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
        {isEditing ? (
          <textarea
            ref={contentRef}
            className="w-full h-[200px] p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          qna.content
        )}
      </div>

      <div className="border-t pt-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Answer</h4>
        {qna.answered ? (
          <p className="text-gray-700 whitespace-pre-wrap">{qna.answer}</p>
        ) : (
          <p className="text-gray-400 italic">아직 답변이 등록되지 않았습니다.</p>
        )}
      </div>

      {/* 닉네임 기반으로 작성자 검증하여 수정/삭제 버튼 표시 */}
      {isAuthor && (
        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded hover:bg-gray-200"
              >
                취소
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-100 text-sm border border-blue-300 text-blue-600 rounded hover:bg-blue-200"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-gray-100 text-sm border border-gray-300 rounded hover:bg-gray-200"
              >
                수정
              </button>
              <button 
                onClick={handleDelete}
                className={`px-4 py-2 text-sm border rounded ${
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
    </div>
  );
}

export default QnADetail;
