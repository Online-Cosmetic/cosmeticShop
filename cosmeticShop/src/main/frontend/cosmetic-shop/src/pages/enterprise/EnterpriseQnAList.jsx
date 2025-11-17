// src/pages/enterprise/EnterpriseQnAList.jsx
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { companyAPI } from '../../utils/customAxios';

function EnterpriseQnAList() {
    const [qnaData, setQnaData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const totalPages = Math.ceil(qnaData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = qnaData.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        companyAPI.qna.getAllCompanyQnas()
            .then((response) => {
                setQnaData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("기업 QnA 데이터를 가져오는 중 오류 발생:", error);
                setLoading(false);
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
            companyAPI.qna.getAllCompanyQnas()
                .then((response) => setQnaData(response.data))
                .catch((error) => console.error("전체 QnA 불러오기 오류:", error));
        } else {
            companyAPI.qna.searchByTitle(searchTerm)
                .then((response) => {
                    setQnaData(response.data);
                    setCurrentPage(1);
                })
                .catch((error) => console.error("검색 오류:", error));
        }
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">기업 문의 게시판</h2>
                </div>

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
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
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

                {/* QnA Table */}
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 font-medium text-gray-700">#</th>
                                <th className="py-3 px-4 font-medium text-gray-700">상태</th>
                                <th className="py-3 px-4 font-medium text-gray-700">제목</th>
                                <th className="py-3 px-4 font-medium text-gray-700">작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">로딩 중...</td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">등록된 문의가 없습니다.</td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => (
                                    <tr key={`${item.id}-${startIndex + index}`} className="border-t hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-600">{startIndex + index + 1}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                item.isAnswered 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.isAnswered ? '답변완료' : '대기중'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link 
                                                to={`/enterprise/qna/${item.id}`} 
                                                className="text-gray-800 hover:text-emerald-600 hover:underline transition-colors font-medium"
                                            >
                                                {item.questionTitle}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{formatDate(item.questionedAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {!loading && qnaData.length > 0 && (
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
                )}

                {/* 작성 버튼 */}
                <div className="flex justify-end">
                    <Link
                        to="/enterprise/qna/write"
                        className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm font-medium flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        문의 작성하기
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default EnterpriseQnAList;

