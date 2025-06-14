import React, { useEffect, useState } from "react";
import { userAPI } from '../../../utils/customAxios.js';
import { useNavigate } from 'react-router-dom';

function QnASection({ items = [], onQnaClick }) {
    const navigate = useNavigate();
    const [qnaData, setQnaData] = useState([]);
    const [qnaDetails, setQnaDetails] = useState({});
    const [expandedQna, setExpandedQna] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const totalPages = Math.ceil(qnaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = qnaData.slice(startIndex, startIndex + itemsPerPage);

    // 현재 사용자 정보 가져오기
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

    useEffect(() => {
        fetchMyQnas();
    }, []);

    const fetchMyQnas = () => {
        setLoading(true);
        userAPI.qna.getMyQnas()
            .then((response) => {
                setQnaData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("내 QnA 데이터를 가져오는 중 오류 발생:", error);
                setLoading(false);
            });
    };

    const fetchQnaDetail = async (qnaId) => {
        if (qnaDetails[qnaId]) {
            // 이미 상세 정보가 있으면 토글
            setExpandedQna(expandedQna === qnaId ? null : qnaId);
            return;
        }

        try {
            const response = await userAPI.qna.getDetail(qnaId);
            setQnaDetails(prev => ({
                ...prev,
                [qnaId]: response.data
            }));
            setExpandedQna(qnaId);
        } catch (error) {
            console.error("QnA 상세 정보 가져오기 실패:", error);
        }
    };

    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    // 상세 페이지로 이동하는 함수
    const handleDetailPageNavigation = (qnaId) => {
        navigate(`/QnADetail/${qnaId}`);
    };

    if (loading || userLoading) return <div className="text-center py-10">로딩 중...</div>;

    return (
        <div className="w-full bg-white p-10 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">글 목록</h2>

            <div className="relative mb-6 w-[400px]">
            </div>

            {qnaData.length === 0 ? (
                <div className="text-center py-10">작성한 Q&A가 없습니다.</div>
            ) : (
                <div className="space-y-4">
                    {currentData.map((item, index) => (
                        <div key={`${item.id}-${startIndex + index}`} className="border rounded-lg overflow-hidden">
                            <div 
                                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                onClick={() => fetchQnaDetail(item.id)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.questionTitle}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.answered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {item.answered ? '답변완료' : '미답변'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        <span>{item.nickname}</span> • <span>{formatDate(item.questionedAt)}</span>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    {expandedQna === item.id ? '▲' : '▼'}
                                </div>
                            </div>

                            {expandedQna === item.id && qnaDetails[item.id] && (
                                <div className="p-4 border-t">
                                    <div className="mb-4">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">질문 내용</h4>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{qnaDetails[item.id].content}</p>
                                    </div>

                                    {qnaDetails[item.id].answered && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">답변</h4>
                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{qnaDetails[item.id].answer}</p>
                                            <div className="text-xs text-gray-400 mt-2">
                                                답변일: {formatDate(qnaDetails[item.id].answeredAt)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 text-right">
                                        <button 
                                            className="text-sm text-blue-600 hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation(); // 이벤트 버블링 방지
                                                handleDetailPageNavigation(item.id);
                                            }}
                                        >
                                            상세 페이지로 이동
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-center items-center gap-4 mt-6 mb-6 text-sm">
                <button onClick={handlePrev} disabled={currentPage === 1} className="disabled:text-gray-300">◀</button>
                <span>{currentPage}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="disabled:text-gray-300">▶</button>
            </div>
        </div>
    );
}

export default QnASection;