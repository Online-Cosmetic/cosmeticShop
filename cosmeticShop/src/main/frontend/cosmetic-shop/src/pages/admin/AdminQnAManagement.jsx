import React from "react";

export default function AdminQnAManagement() {

    return (
        <>
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

                    {/* 테이블 항목 (예시 6줄) */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-full bg-white border-b border-neutral-200 flex items-center py-2 px-4 text-md text-black font-normal">
                            <div className="w-28 text-center">#</div>
                            <div className="w-32 text-center">{i % 2 === 0 ? 'Answered' : 'Pending'}</div>
                            <div className="flex-1 text-center">Title</div>
                            <div className="w-32 text-center">Author</div>
                            <div className="w-36 text-center">YYYY-MM-DD</div>
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
        </>
    );
}

