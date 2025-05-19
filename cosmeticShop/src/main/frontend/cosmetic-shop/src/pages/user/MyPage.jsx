import React from "react";

const MyPage = () => {
    return (
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-10">
            <h1 className="text-4xl font-semibold text-neutral-800">My Page</h1>

            <div className="flex gap-10">
                {/* 사이드 메뉴 */}
                <aside className="w-40 flex flex-col gap-10">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Orders</h2>
                        <ul className="space-y-2 text-lg text-gray-700">
                            <li>Order History</li>
                            <li>Return Orders</li>
                            <li>List</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Activities</h2>
                        <ul className="space-y-2 text-lg text-gray-700">
                            <li>Wishlist</li>
                            <li>Review</li>
                            <li>Q&A</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Info</h2>
                        <ul className="space-y-2 text-lg text-gray-700">
                            <li>Edit Info</li>
                            <li>Address</li>
                            <li>Payments</li>
                        </ul>
                    </div>
                </aside>

                {/* 콘텐츠 */}
                <section className="flex-1 flex flex-col gap-12">
                    {/* Orders History */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Orders History</h2>
                        <div className="grid grid-cols-5 gap-4 bg-neutral-400 text-white text-center font-medium py-4 rounded-lg">
                            <div>#</div>
                            <div>State</div>
                            <div>State</div>
                            <div>State</div>
                            <div>State</div>
                        </div>
                    </div>

                    {/* Wishlist */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Wishlist</h2>
                        <div className="flex gap-6">
                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-44 h-44 bg-gray-200 rounded-xl flex items-center justify-center text-xl text-gray-600"
                                >
                                    상품 {i + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Q&A */}
                    <div>
                        <h2 className="text-3xl font-semibold mb-6">Q&A</h2>
                        <div className="grid grid-cols-5 bg-white border border-gray-300 text-neutral-800 font-medium text-lg py-4 px-2 rounded-lg">
                            <div>#</div>
                            <div>State</div>
                            <div>Title</div>
                            <div>Author</div>
                            <div>Date</div>
                        </div>
                        {[1, 2].map((_, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-5 border-t border-gray-300 text-neutral-800 py-4 px-2"
                            >
                                <div>{i + 1}</div>
                                <div>답변완료</div>
                                <div>상품 관련 문의</div>
                                <div>User{i + 1}</div>
                                <div>2025-05-19</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MyPage;