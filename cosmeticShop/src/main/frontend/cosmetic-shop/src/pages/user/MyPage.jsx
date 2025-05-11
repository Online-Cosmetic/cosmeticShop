import React from "react";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";
import { Link } from "react-router-dom";

function MyPage() {

    return (
        <>
            <Header />
            <div className="flex min-h-screen bg-white text-gray-900 p-10 font-sans">
                {/* Sidebar */}
                <div className="w-[200px] text-sm mr-12">
                    <h1 className="text-xl font-bold mb-8">Welcome! UserID</h1>

                    <div className="mb-6">
                        <h2 className="font-bold mb-2">Orders</h2>
                        <ul className="space-y-1 text-gray-600">
                            <li>Order History</li>
                            <li>Cancelled orders</li>
                            <li>List</li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h2 className="font-bold mb-2">Activities</h2>
                        <ul className="space-y-1 text-gray-600">
                            <li>Wishlist</li>
                            <li>Review</li>
                            <li>Q&amp;A</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2">Informations</h2>
                        <ul className="space-y-1 text-gray-600">
                            <li>Edit Info</li>
                            <li>Address</li>
                            <li>Payments</li>
                        </ul>
                    </div>
                </div>

                {/* Main */}
                <div className="flex-1 space-y-10">
                    {/* Order History */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Order History</h2>
                        <div className="bg-gray-400 p-6 rounded-md flex items-center justify-between text-white font-semibold text-center text-sm">
                            <div className="flex-1">#<br />Order<br />Received</div>
                            <div className="text-2xl px-2">➤</div>
                            <div className="flex-1">#<br />Payment<br />Complete</div>
                            <div className="text-2xl px-2">➤</div>
                            <div className="flex-1">#<br />State</div>
                            <div className="text-2xl px-2">➤</div>
                            <div className="flex-1">#<br />Shipping</div>
                            <div className="text-2xl px-2">➤</div>
                            <div className="flex-1">#<br />Delivered</div>
                        </div>
                    </div>

                    {/* Wishlist */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
                        <div className="flex space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-[100px] h-[100px] bg-gray-100 rounded overflow-hidden relative">
                                    <img
                                        src="public/product(1).png"
                                        alt="wishlist item"
                                        className="w-full h-full object-cover"
                                    />
                                    <span className="absolute top-1 right-1 text-gray-400 text-xl">♡</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Q&A */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Q&amp;A</h2>
                        <table className="w-full border-t border-gray-300 text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left">#</th>
                                    <th className="p-2 text-left">State</th>
                                    <th className="p-2 text-left">Title</th>
                                    <th className="p-2 text-left">Author</th>
                                    <th className="p-2 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map(i => (
                                    <tr key={i} className="border-b">
                                        <td className="p-2">#</td>
                                        <td className="p-2">State</td>
                                        <td className="p-2">Title</td>
                                        <td className="p-2">Author</td>
                                        <td className="p-2">Date</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MyPage;