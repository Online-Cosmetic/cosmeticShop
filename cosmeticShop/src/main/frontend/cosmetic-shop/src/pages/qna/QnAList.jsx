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
            <div className="w-full min-h-screen bg-white p-10 rounded-lg shadow-sm">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">고객 문의 게시판</h2>

                {/* Search */}
                <div className="relative mb-6 w-[400px]">
                    <div className="flex items-center border rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-200">
                        <button className="bg-gray-100 px-4 py-2 text-gray-600 border-r font-medium">제목</button>
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            className="px-4 py-2 flex-1 outline-none pr-12 focus:ring-1 focus:ring-emerald-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            id="searchBtn"
                            onClick={handleSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                            aria-label="검색"
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
                <table className="w-full border-t border-b text-left mb-6 bg-white shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 font-medium text-gray-700">#</th>
                            <th className="py-3 px-4 font-medium text-gray-700">상태</th>
                            <th className="py-3 px-4 font-medium text-gray-700">제목</th>
                            <th className="py-3 px-4 font-medium text-gray-700">작성자</th>
                            <th className="py-3 px-4 font-medium text-gray-700">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-500">등록된 문의가 없습니다.</td>
                            </tr>
                        ) : (
                            currentData.map((item, index) => (
                                <tr key={`${item.id}-${startIndex + index}`} className="border-t hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-gray-600">{startIndex + index + 1}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.answered 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.answered ? '답변완료' : '대기중'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <Link 
                                            to={`/QnADetail/${item.id}`} 
                                            className="text-gray-800 hover:text-emerald-600 hover:underline transition-colors font-medium"
                                        >
                                            {item.questionTitle}
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">{item.nickname}</td>
                                    <td className="py-3 px-4 text-gray-600">{formatDate(item.questionedAt)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="flex justify-center items-center gap-4 mb-6">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentPage === 1} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                        aria-label="이전 페이지"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-lg font-medium px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700">{currentPage}</span>
                    <button 
                        onClick={handleNext} 
                        disabled={currentPage === totalPages || totalPages === 0} 
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:text-gray-300 disabled:hover:bg-transparent"
                        aria-label="다음 페이지"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="flex justify-end">
                    <Link
                        to="/QnAWrite"
                        onClick={handleLinkClick}
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        문의 작성하기
                    </Link>
                </div>
            </div>
        </>
    );
}


export default QnAList;
