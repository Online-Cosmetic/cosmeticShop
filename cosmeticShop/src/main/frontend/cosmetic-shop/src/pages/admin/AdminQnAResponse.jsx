// src/pages/admin/AdminQnAResponse.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminAPI } from "../../utils/customAxios";

export default function AdminQnAResponse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [qna, setQna] = useState(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch QnA details
    useEffect(() => {
        const fetchQnaDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await adminAPI.qna.getDetail(id);
                setQna(response.data);
                // If there's already an answer, pre-fill the answer field
                if (response.data.answer) {
                    setAnswer(response.data.answer);
                }
            } catch (error) {
                console.error("Error fetching QnA details:", error);
                setError("Failed to load QnA details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQnaDetail();
    }, [id]);

    // YYYY-MM-DD 형태로 바꿔주는 함수
    const formatDate = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Format date and time
    const formatDateTime = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // 제출 버튼 클릭 시 처리
    const handleSubmit = async () => {
        if (!answer.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            await adminAPI.qna.answerQna(id, answer);
            alert("답변이 성공적으로 저장되었습니다.");
            navigate("/admin/qna");
        } catch (error) {
            console.error("Error submitting answer:", error);
            alert("답변 저장에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                <div className="text-xl text-gray-500">Loading Q&A details...</div>
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
                <div className="text-xl text-red-500">QnA not found</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* 1. 헤더: 제목 / 뒤로 가기 버튼 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Q&A 답변 작성</h2>
                    <button
                        onClick={() => navigate("/admin/qna")}
                        className="px-6 py-2 bg-gray-100 text-neutral-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300 font-medium"
                    >
                        목록으로
                    </button>
                </div>

                {/* 2. QnA 정보(제목, 작성자, 날짜, 상태) */}
                <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                    <h3 className="text-2xl font-semibold text-neutral-800 mb-3">
                        {qna.questionTitle}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">작성자:</span>
                                <span className="text-neutral-800 font-semibold">{qna.nickname}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">작성일시:</span>
                                <span className="text-neutral-800">{formatDateTime(qna.questionedAt)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">상태:</span>
                                {qna.answered ? (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-medium rounded-full text-sm">답변완료</span>
                                ) : (
                                    <span className="px-3 py-1 bg-red-100 text-red-800 font-medium rounded-full text-sm">미답변</span>
                                )}
                            </div>
                            {qna.answered && (
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">답변일시:</span>
                                    <span className="text-neutral-800">{formatDateTime(qna.answeredAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. 질문(Questions) */}
                <div>
                    <label className="block mb-3 text-xl font-semibold text-neutral-800">
                        질문 내용
                    </label>
                    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 min-h-[240px] shadow-sm">
                        <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
                            {qna.content}
                        </p>
                    </div>
                </div>

                {/* 4. 답변 입력(Answer Input) */}
                <div>
                    <label
                        htmlFor="answer"
                        className="block mb-3 text-xl font-semibold text-neutral-800"
                    >
                        답변 내용
                    </label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="답변을 입력해주세요..."
                        className="w-full bg-white border border-gray-300 rounded-lg p-6 text-base text-neutral-800 leading-relaxed min-h-[200px] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm"
                        disabled={submitting}
                    />
                </div>

                {/* 5. 제출 버튼 */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-10 py-4 ${
                            submitting 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-emerald-600 hover:bg-emerald-700"
                        } text-white text-lg font-semibold rounded-lg transition-colors shadow-sm`}
                    >
                        {submitting ? "저장 중..." : "답변 제출하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}
