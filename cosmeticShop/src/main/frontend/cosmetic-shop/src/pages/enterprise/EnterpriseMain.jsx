// src/pages/enterprise/EnterpriseMain.jsx
import React from "react";

const EnterpriseMain = () => {
    return (
        <div className="w-full max-w-[1262px] mx-auto p-4 flex flex-col gap-4">
            {/* Sales */}
            <div className="bg-white border rounded-2xl shadow px-10 pt-8 pb-4 flex flex-col">
                <div className="w-full flex flex-col gap-7">
                    <div className="flex items-center gap-2.5">
                        <h2 className="text-gray-900 text-xl font-bold">Sales</h2>
                    </div>

                    <div className="flex gap-10">
                        <div className="flex flex-col gap-10">
                            {[
                                "240K",
                                "200K",
                                "160K",
                                "120K",
                                "80K",
                                "40K",
                                "0K"
                            ].map((label, i) => (
                                <div
                                    key={i}
                                    className="text-gray-500 text-sm font-semibold leading-tight"
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-14 flex-grow">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-full border-t border-gray-100"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="w-full flex justify-between text-gray-500 text-sm font-semibold">
                        {[
                            "01 Jan",
                            "02 Feb",
                            "03 Mar",
                            "04 Apr",
                            "05 May",
                            "06 Jun",
                            "07 Jul"
                        ].map((date, i) => (
                            <div key={i}>{date}</div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Customers & Top Products */}
            <div className="flex gap-4">
                {/* Latest Customers */}
                <div className="w-96 bg-white border rounded-2xl shadow p-6 flex flex-col gap-4">
                    <h3 className="text-gray-900 text-xl font-semibold">Latest Customers</h3>
                    {[
                        { name: "Neil Sims", email: "email@example.com", amount: "$367" },
                        { name: "Bonnie Green", email: "email@example.com", amount: "$67" },
                        { name: "Micheal Gough", email: "email@example.com", amount: "$3467" },
                        { name: "Thomas Lean", email: "email@example.com", amount: "$2367" },
                        { name: "Lana Byrd", email: "email@example.com", amount: "$367" },
                        { name: "Karen Nelson", email: "email@example.com", amount: "$1367" }
                    ].map((user, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <img className="w-8 h-8 rounded-full" src="https://placehold.co/32x32" alt={user.name} />
                                <div>
                                    <div className="text-gray-900 font-semibold">{user.name}</div>
                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                </div>
                            </div>
                            <div className="text-gray-900 font-semibold">{user.amount}</div>
                        </div>
                    ))}
                </div>

                {/* Top Products */}
                <div className="flex-1 bg-white border rounded-2xl shadow p-6 flex flex-col gap-4">
                    <h3 className="text-gray-900 text-xl font-semibold">Top Products</h3>
                    {[
                        { title: "Restaurant Booking App", framework: "React & Bootstrap", sales: 70 },
                        { title: "UI Kit", framework: "React & Bootstrap", sales: 54 },
                        { title: "Design System Pro", framework: "Bootstrap", sales: 47 },
                        { title: "Dashboard", framework: "Tailwind, React", sales: 43 },
                        { title: "Glassmorphism UI", framework: "Vue, Tailwind", sales: 38 },
                        { title: "Multipurpose Template", framework: "React & Bootstrap", sales: 22 }
                    ].map((product, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div>
                                <div className="text-gray-900 font-semibold">{product.title}</div>
                                <div className="text-gray-500 text-xs">{product.framework}</div>
                            </div>
                            <div className="text-gray-600 text-base">
                                <span className="text-gray-900 font-semibold">{product.sales}</span> sales
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white border rounded-2xl shadow p-4 flex flex-col gap-4">
                <div>
                    <h3 className="text-gray-900 text-xl font-semibold">Transactions</h3>
                    <p className="text-zinc-500 text-sm">This is a list of latest transactions.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-semibold">
                        <tr>
                            <th className="p-2">Transaction</th>
                            <th className="p-2">Date & Time</th>
                            <th className="p-2">Amount</th>
                            <th className="p-2">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[
                            ["Payment from Bonnie Green", "Apr 23, 2021", "$2300", "Completed"],
                            ["Payment refund to #00910", "Apr 23, 2021", "-$670", "Completed"],
                            ["Payment failed from #087651", "Apr 18, 2021", "$234", "Cancelled"],
                            ["Payment from Bonnie Green", "Apr 15, 2021", "$5000", "In progress"],
                            ["Payment from Jese Leos", "Apr 15, 2021", "$2300", "In progress"],
                            ["Payment from THEMSBERG LLC", "Apr 11, 2021", "$280", "Completed"]
                        ].map(([title, date, amount, status], i) => (
                            <tr key={i} className="border-b border-gray-200">
                                <td className="p-2 text-gray-900">{title}</td>
                                <td className="p-2 text-gray-500">{date}</td>
                                <td className="p-2 text-gray-900 font-medium">{amount}</td>
                                <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Completed"
                            ? "bg-green-100 text-emerald-900"
                            : status === "Cancelled"
                                ? "bg-rose-200 text-red-800"
                                : "bg-sky-100 text-blue-800"
                    }`}>{status}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EnterpriseMain;
