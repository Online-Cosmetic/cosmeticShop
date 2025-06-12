import React, { useEffect, useState } from "react";
import { userAPI } from '../../../utils/customAxios.js';
import {Link, useNavigate} from 'react-router-dom';

function QnASection({ items = [], onQnaClick }) {
    const [qnaData, setQnaData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');

    const totalPages = Math.ceil(qnaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = qnaData.slice(startIndex, startIndex + itemsPerPage);

    const navigate = useNavigate();

    const handleQuestionClick = async (nickname, title) => {
        try {
            const response = await userAPI.qna.getQnaIdByNicknameAndTitle(nickname, title); // 새 API 호출
            const qnaId = response.data;
            navigate(`/qna/detail/${qnaId}`); // 상세 페이지로 이동
        } catch (error) {
            console.error("QnA ID 찾기 실패", error);
            alert('해당 글을 찾을 수 없습니다.');
        }
    };

    useEffect(() => {
        fetchMyQnas();
    }, []);

    const fetchMyQnas = () => {
        userAPI.qna.getMyQnas()
            .then((response) => {
                setQnaData(response.data);
            })
            .catch((error) => {
                console.error("내 QnA 데이터를 가져오는 중 오류 발생:", error);
            });
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

    return (
        <div className="w-full bg-white p-10 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">글 목록</h2>

            <div className="relative mb-6 w-[400px]">

            </div>

            <table className="w-full border-t border-b text-left mb-6 text-sm">
                <thead>
                    <tr>
                        <th className="py-2 px-4">#</th>
                        <th className="py-2 px-4">상태</th>
                        <th className="py-2 px-4">제목</th>
                        <th className="py-2 px-4">작성자</th>
                        <th className="py-2 px-4">작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <tr key={`${item.id}-${startIndex + index}`} className="border-t">
                            <td className="py-2 px-4">{startIndex + index + 1}</td>
                            <td className="py-2 px-4">{item.answered ? '답변완료' : '미답변'}</td>
                            <td className="py-2 px-4 hover:text-blue-800">
                                <span onClick={() => onQnaClick && onQnaClick(item.id)}>
                                    {item.questionTitle}
                                </span>
                            </td>
                            <td className="py-2 px-4">{item.nickname}</td>
                            <td className="py-2 px-4">{formatDate(item.questionedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center items-center gap-4 mb-6 text-sm">
                <button onClick={handlePrev} disabled={currentPage === 1} className="disabled:text-gray-300">◀</button>
                <span>{currentPage}</span>
                <button onClick={handleNext} disabled={currentPage === totalPages} className="disabled:text-gray-300">▶</button>
            </div>
        </div>
    );
}

export default QnASection;