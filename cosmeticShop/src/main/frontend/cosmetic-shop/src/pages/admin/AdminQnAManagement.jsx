// src/pages/admin/AdminQnAManagement.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/customAxios";

export default function AdminQnAManagement() {
    const navigate = useNavigate();
    const [qnaList, setQnaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // "all", "answered", "unanswered"
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch QnA data based on filter
    useEffect(() => {
        fetchQnAs();
    }, [filter]);

    const fetchQnAs = async () => {
        setLoading(true);
        try {
            let response;
            if (filter === "all") {
                response = await adminAPI.qna.getUnansweredQnas();
                const unansweredQnAs = response.data;

                response = await adminAPI.qna.getAnsweredQnas();
                const answeredQnAs = response.data;

                setQnaList([...unansweredQnAs, ...answeredQnAs]);
            } else if (filter === "answered") {
                response = await adminAPI.qna.getAnsweredQnas();
                setQnaList(response.data);
            } else if (filter === "unanswered") {
                response = await adminAPI.qna.getUnansweredQnas();
                setQnaList(response.data);
            }
        } catch (error) {
            console.error("Error fetching QnAs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Search QnAs by title
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            fetchQnAs();
            return;
        }

        setLoading(true);
        try {
            let response;
            if (filter === "all") {
                // Search both answered and unanswered QnAs
                const answeredResponse = await adminAPI.qna.searchAnsweredQnasByTitle(searchTerm);
                const unansweredResponse = await adminAPI.qna.searchUnansweredQnasByTitle(searchTerm);
                setQnaList([...answeredResponse.data, ...unansweredResponse.data]);
            } else if (filter === "answered") {
                response = await adminAPI.qna.searchAnsweredQnasByTitle(searchTerm);
                setQnaList(response.data);
            } else if (filter === "unanswered") {
                response = await adminAPI.qna.searchUnansweredQnasByTitle(searchTerm);
                setQnaList(response.data);
            }
        } catch (error) {
            console.error("Error searching QnAs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Delete QnA
    const handleDelete = async (e, qnaId) => {
        e.stopPropagation(); // Prevent navigation to response page

        if (window.confirm("Are you sure you want to delete this QnA?")) {
            try {
                await adminAPI.qna.adminDeleteQna(qnaId);
                // Refresh the list after deletion
                fetchQnAs();
            } catch (error) {
                console.error("Error deleting QnA:", error);
            }
        }
    };

    // Pagination
    const totalPages = Math.ceil(qnaList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = qnaList.slice(startIndex, startIndex + itemsPerPage);

    // 날짜 포맷 함수
    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-2">
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Q&A 관리</h2>
                </div>

                {/* 필터 및 검색 */}
                <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "all" 
                                    ? "bg-neutral-800 text-white" 
                                    : "bg-gray-200 text-neutral-700"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter("answered")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "answered" 
                                    ? "bg-emerald-600 text-white" 
                                    : "bg-gray-200 text-neutral-700"
                            }`}
                        >
                            Done
                        </button>
                        <button
                            onClick={() => setFilter("unanswered")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "unanswered" 
                                    ? "bg-red-500 text-white" 
                                    : "bg-gray-200 text-neutral-700"
                            }`}
                        >
                            Incomplete
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-md"
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-neutral-800 text-white rounded-md"
                        >
                            검색
                        </button>
                    </div>
                </div>

                {/* 테이블 헤더 */}
                <div className="w-full bg-zinc-100 rounded-t-lg border-b border-neutral-200 flex items-center mt-6 py-2 px-4 text-lg text-black font-normal">
                    <div className="w-28 text-center">QnA Num.</div>
                    <div className="w-32 text-center">State</div>
                    <div className="flex-1 text-center">제목</div>
                    <div className="w-32 text-center">작성자</div>
                    <div className="w-36 text-center">작성일</div>
                    <div className="w-24 text-center">비고</div>
                </div>

                {/* 로딩 상태 */}
                {loading ? (
                    <div className="w-full py-8 text-center text-gray-500">Loading...</div>
                ) : currentItems.length === 0 ? (
                    <div className="w-full py-8 text-center text-gray-500">QnA 가 없습니다.</div>
                ) : (
                    /* 테이블 항목 */
                    currentItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/admin/qna/${item.id}/response`)}
                            className="w-full bg-white border-b border-neutral-200 flex items-center py-2 px-4 text-md text-black font-normal cursor-pointer hover:bg-zinc-50 transition-colors"
                        >
                            <div className="w-28 text-center">{item.id}</div>
                            <div className="w-32 text-center">
                                {item.answered ? (
                                    <span className="text-emerald-600 font-medium">Answered</span>
                                ) : (
                                    <span className="text-red-500 font-medium">Pending</span>
                                )}
                            </div>
                            <div className="flex-1 text-center">{item.questionTitle}</div>
                            <div className="w-32 text-center">{item.nickname}</div>
                            <div className="w-36 text-center">{formatDate(item.questionedAt)}</div>
                            <div className="w-24 text-center">
                                <button
                                    onClick={(e) => handleDelete(e, item.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* 페이지네이션 */}
                {!loading && qnaList.length > 0 && (
                    <div className="flex justify-center items-center gap-5 mt-4">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`text-2xl ${currentPage === 1 ? 'text-gray-300' : 'text-neutral-600'} rotate-180`}
                        >
                            ▶
                        </button>
                        <div className="text-lg">
                            Page {currentPage} of {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`text-2xl ${currentPage === totalPages ? 'text-gray-300' : 'text-neutral-600'}`}
                        >
                            ▶
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
