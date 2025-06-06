// src/pages/admin/AdminQnAManagement.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

// 더미 QnA 데이터
const dummyQnAList = [
    {
        id: 1,
        answered: true,
        questionTitle: "배송이 언제 오나요?",
        nickname: "userA",
        questionedAt: "2024-06-01T10:00:00Z",
    },
    {
        id: 2,
        answered: false,
        questionTitle: "제품에 하자가 있어요.",
        nickname: "userB",
        questionedAt: "2024-06-02T14:30:00Z",
    },
    {
        id: 3,
        answered: true,
        questionTitle: "교환/환불 절차가 궁금합니다.",
        nickname: "userC",
        questionedAt: "2024-06-03T09:15:00Z",
    },
    {
        id: 4,
        answered: false,
        questionTitle: "적립금은 언제 들어오나요?",
        nickname: "userD",
        questionedAt: "2024-06-04T11:45:00Z",
    },
    {
        id: 5,
        answered: true,
        questionTitle: "포장 상태가 궁금합니다.",
        nickname: "userE",
        questionedAt: "2024-06-05T16:20:00Z",
    },
    {
        id: 6,
        answered: false,
        questionTitle: "쿠폰 사용이 안돼요.",
        nickname: "userF",
        questionedAt: "2024-06-06T08:10:00Z",
    },
];

export default function AdminQnAManagement() {
    const navigate = useNavigate();

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
                    <h2 className="text-3xl font-bold text-neutral-800">Q&A Management</h2>
                </div>

                {/* 테이블 헤더 */}
                <div className="w-full bg-zinc-100 rounded-t-lg border-b border-neutral-200 flex items-center mt-6 py-2 px-4 text-lg text-black font-normal">
                    <div className="w-28 text-center">QnA Num.</div>
                    <div className="w-32 text-center">State</div>
                    <div className="flex-1 text-center">Title</div>
                    <div className="w-32 text-center">Author</div>
                    <div className="w-36 text-center">YYYY-MM-DD</div>
                </div>

                {/* 테이블 항목 */}
                {dummyQnAList.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => navigate(`/admin/qna/${item.id}/response`)}
                        className="w-full bg-white border-b border-neutral-200 flex items-center py-2 px-4 text-md text-black font-normal cursor-pointer hover:bg-zinc-50 transition-colors"
                    >
                        <div className="w-28 text-center">{item.id}</div>
                        <div className="w-32 text-center">
                            {item.answered ? "Answered" : "Pending"}
                        </div>
                        <div className="flex-1 text-center">{item.questionTitle}</div>
                        <div className="w-32 text-center">{item.nickname}</div>
                        <div className="w-36 text-center">{formatDate(item.questionedAt)}</div>
                    </div>
                ))}

                {/* 페이지네이션 */}
                <div className="flex justify-center items-center gap-5 mt-4">
                    <button className="text-2xl text-neutral-600 rotate-180">▶</button>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="text-2xl text-black">{num}</div>
                    ))}
                    <button className="text-2xl text-neutral-600">▶</button>
                </div>
            </div>
        </div>
    );
}