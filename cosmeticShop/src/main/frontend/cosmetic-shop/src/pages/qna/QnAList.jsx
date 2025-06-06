import React, { useEffect, useState } from "react";
import { userAPI } from '../../utils/customAxios.js';
import { SmallButton, Pagination }  from '../../components/ui/Button/index.jsx';
import { Title } from '../../components/ui/Text/index.jsx';
import { QnASearchBar } from '../../components/ui/QnASearchBar.jsx';
import { PostForm } from '../../components/ui/PostForm.jsx';
import { Link } from 'react-router-dom';

function QnAList() {
    const [qnaData, setQnaData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');

    const totalPages = Math.ceil(qnaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = qnaData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        userAPI.qna.getAllQnas() // API
            .then((response) => {
                setQnaData(response.data);
            })
            .catch((error) => {
                console.error("QnA 데이터를 가져오는 중 오류 발생:", error);
            });
    }, []);

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
            // 빈 검색어면 전체 목록 다시 조회
            userAPI.qna.getAllQnas()
                .then((response) => setQnaData(response.data))
                .catch((error) => console.error("전체 QnA 불러오기 오류:", error));
        } else {
            // 예: 제목 기준 검색
            userAPI.qna.searchByTitle(searchTerm)
                .then((response) => {
                    setQnaData(response.data);
                    setCurrentPage(1); // 검색 시 페이지 초기화
                })
                .catch((error) => {
                    console.error("검색 오류:", error);
                });
        }
    };
    const handleLinkClick = (e) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            e.preventDefault(); // 중단 기본 링크 이동
            alert("로그인 후 작성할 수 있습니다.");
        }
        // 로그인되어 있으면 Link가 정상 동작함
    };
    return (
        <>
            <div className="w-full min-h-screen bg-white p-10">
                <h2 className="text-2xl font-bold mb-6">Q&A</h2>

                {/* Search */}
                <div className="relative mb-6 w-[400px]">
                    <div className="flex items-center border rounded overflow-hidden">
                        <button className="bg-gray-100 px-4 py-2 text-gray-500 border-r">Condition</button>
                        <input
                            type="text"
                            placeholder="Search"
                            className="px-4 py-2 flex-1 outline-none pr-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            id="searchBtn"
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <table className="w-full border-t border-b text-left mb-6">
                    <thead>
                        <tr>
                            <th className="py-2 px-4">#</th>
                            <th className="py-2 px-4">State</th>
                            <th className="py-2 px-4">Title</th>
                            <th className="py-2 px-4">Author</th>
                            <th className="py-2 px-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={`${item.id}-${startIndex + index}`} className="border-t">
                                <td className="py-2 px-4">{startIndex + index + 1}</td>
                                <td className="py-2 px-4">{item.answered ? 'Answered' : 'Pending'}</td>
                                <td className="py-2 px-4 hover:text-blue-800">
                                    <Link to={`/QnADetail${item.id}`}>{item.questionTitle}</Link>
                                </td>
                                <td className="py-2 px-4">{item.nickname}</td>
                                <td className="py-2 px-4">{formatDate(item.questionedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* page */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <button onClick={handlePrev} disabled={currentPage === 1} className="text-xl disabled:text-gray-300">◀</button>
                    <span>{currentPage}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages} className="text-xl disabled:text-gray-300">▶</button>
                </div>

                <div className="flex justify-end">
                    <Link
                        to="/QnAWrite"
                        onClick={handleLinkClick}
                        className="border px-4 py-2"
                    >
                        글쓰기
                    </Link>
                </div>
            </div>
        </>
    );
}


export default QnAList;
