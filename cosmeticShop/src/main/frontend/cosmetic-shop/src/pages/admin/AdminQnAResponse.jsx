// src/pages/admin/AdminQnAResponse.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminQnAResponse() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");

    // 더미 QnA 목록 (id 값에 따라 가져올 데이터)
    const dummyQnAList = [
        {
            id: "1",
            questionTitle: "배송이 언제 오나요?",
            nickname: "userA",
            questionedAt: "2024-06-01T10:00:00Z",
            answered: false,
            content: "제가 주문한 상품이 아직 배송 준비 중인데, 언제 받을 수 있을까요?",
        },
        {
            id: "2",
            questionTitle: "제품에 하자가 있어요.",
            nickname: "userB",
            questionedAt: "2024-06-02T14:30:00Z",
            answered: true,
            content: "받은 상품 뒷면이 찍혀서 도착했습니다. 교환 가능할까요?",
        },
        {
            id: "3",
            questionTitle: "교환/환불 절차가 궁금합니다.",
            nickname: "userC",
            questionedAt: "2024-06-03T09:15:00Z",
            answered: false,
            content: "제품이 마음에 들지 않아 교환하거나 환불하려고 하는데 절차를 알고 싶습니다.",
        },
    ];

    const qna = dummyQnAList.find((item) => item.id === id) || {
        questionTitle: "제목이없어유",
        nickname: "박대형",
        questionedAt: new Date().toISOString(),
        answered: false,
        content: "안녕하십니까",
    };

    // YYYY-MM-DD 형태로 바꿔주는 함수
    const formatDate = (iso) => {
        const date = new Date(iso);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // 제출 버튼 클릭 시 처리 (현재는 단순 alert)
    const handleSubmit = () => {
        if (!answer.trim()) {
            alert("답변 내용을 입력해주세요.");
            return;
        }
        alert(`(더미) 답변이 저장되었습니다.\nQnA ID: ${id}\n답변: ${answer}`);
        navigate("/admin/qna");
    };

    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            <div className="w-full px-20 py-12 bg-white border rounded-2xl shadow flex flex-col gap-6">
                {/* 1. 헤더: 제목 / 뒤로 가기 버튼 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-neutral-800">Q&A 답변 작성</h2>
                    <button
                        onClick={() => navigate("/admin/qna")}
                        className="px-4 py-2 bg-gray-200 text-neutral-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        목록으로
                    </button>
                </div>

                {/* 2. QnA 정보(제목, 작성자, 날짜, 상태) */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-semibold text-neutral-800">
                        {qna.questionTitle}
                    </h3>
                    <div className="flex justify-start items-center gap-6 text-neutral-600 text-md">
                        <span>작성자: {qna.nickname}</span>
                        <span>날짜: {formatDate(qna.questionedAt)}</span>
                        <span>
              상태:{" "}
                            {qna.answered ? (
                                <span className="text-emerald-600 font-medium">답변완료</span>
                            ) : (
                                <span className="text-red-500 font-medium">미답변</span>
                            )}
            </span>
                    </div>
                </div>

                {/* 3. 질문(Questions) */}
                <div>
                    <label className="block mb-2 text-2xl font-medium text-neutral-700">
                        질문 내용
                    </label>
                    <div className="w-full bg-white border border-zinc-200 rounded-lg p-4 min-h-[240px]">
                        <p className="text-zinc-600 text-base leading-relaxed whitespace-pre-wrap">
                            {qna.content}
                        </p>
                    </div>
                </div>

                {/* 4. 답변 입력(Answer Input) */}
                <div>
                    <label
                        htmlFor="answer"
                        className="block mb-2 text-2xl font-medium text-neutral-700"
                    >
                        답변 내용
                    </label>
                    <textarea
                        id="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="w-full bg-zinc-100 border border-zinc-200 rounded-lg p-4 text-base text-neutral-800 leading-relaxed min-h-[144px] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                </div>

                {/* 5. 제출 버튼 */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleSubmit}
                        className="px-8 py-4 bg-neutral-800 text-white text-xl font-semibold rounded-2xl hover:bg-neutral-900 transition-colors"
                    >
                        제출하기
                    </button>
                </div>
            </div>
        </div>
    );
}