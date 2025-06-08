import React, { useEffect, useState } from "react";
import { userAPI } from '../../../utils/customAxios.js';
import { Link } from 'react-router-dom';

function QnASection({ items = [], onQnaClick }) {
    const [qnaData, setQnaData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');

    const totalPages = Math.ceil(qnaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = qnaData.slice(startIndex, startIndex + itemsPerPage);

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

    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            fetchMyQnas();
        } else {
            userAPI.qna.searchMyQnasByTitle(searchTerm)
                .then((response) => {
                    setQnaData(response.data);
                    setCurrentPage(1);
                })
                .catch((error) => {
                    console.error("내 QnA 검색 오류:", error);
                });
        }
    };

    const handleLinkClick = (e) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            e.preventDefault();
            alert("로그인 후 작성할 수 있습니다.");
        }
    };

    return (
        <div className="w-full bg-white p-10 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Q&A</h2>

            <div className="relative mb-6 w-[400px]">
                <div className="flex items-center border rounded overflow-hidden">
                    <button className="bg-gray-100 px-4 py-2 text-gray-500 border-r">제목</button>
                    <input
                        type="text"
                        placeholder="제목으로 검색"
                        className="px-4 py-2 flex-1 outline-none pr-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        id="searchBtn"
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>
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

            <div className="flex justify-end">
                <Link
                    to="/QnAWrite"
                    onClick={handleLinkClick}
                    className="border px-4 py-2 text-sm"
                >
                    글쓰기
                </Link>
            </div>
        </div>
    );
}

export default QnASection;