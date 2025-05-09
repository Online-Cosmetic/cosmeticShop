// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Dribbble, Facebook, Github, InfoIcon, Twitter } from "lucide-react";
// import React from "react";
//
// // Data for customers
// const customers = [
//     {
//         name: "Neil Sims",
//         email: "email@example.com",
//         amount: "$367",
//         avatar: "/avatar.png",
//     },
//     {
//         name: "Bonnie Green",
//         email: "email@example.com",
//         amount: "$67",
//         avatar: "/image.png",
//     },
//     {
//         name: "Micheal Gough",
//         email: "email@example.com",
//         amount: "$3467",
//         avatar: "/avatar-2.png",
//     },
//     {
//         name: "Thomas Lean",
//         email: "email@example.com",
//         amount: "$2367",
//         avatar: "/avatar-3.png",
//     },
//     {
//         name: "Lana Byrd",
//         email: "email@example.com",
//         amount: "$367",
//         avatar: "/avatar-4.png",
//     },
//     {
//         name: "Karen Nelson",
//         email: "email@example.com",
//         amount: "$1367",
//         avatar: "/avatar-5.png",
//     },
// ];
//
// // Data for top products
// const topProducts = [
//     {
//         name: "Restaurant Booking App",
//         tech: "React & Bootstrap Framework",
//         sales: "70",
//     },
//     { name: "UI Kit", tech: "React & Bootstrap Framework", sales: "54" },
//     { name: "Design System Pro", tech: "Bootstrap Framework", sales: "47" },
//     { name: "Dashboard", tech: "Tailwind, React", sales: "43" },
//     { name: "Glassmorphism UI", tech: "Vue Js, Tailwind", sales: "38" },
//     {
//         name: "Multipurpose Template",
//         tech: "React & Bootstrap Framework",
//         sales: "22",
//     },
// ];
//
// // Data for transactions
// const transactions = [
//     {
//         transaction: "Payment from Bonnie Green",
//         date: "Apr 23 ,2021",
//         amount: "$2300",
//         status: "Completed",
//         statusColor: "green",
//     },
//     {
//         transaction: "Payment refund to #00910",
//         date: "Apr 23, 2021",
//         amount: "-$670",
//         status: "Completed",
//         statusColor: "green",
//     },
//     {
//         transaction: "Payment failed from #087651",
//         date: "Apr 18, 2021",
//         amount: "$234",
//         status: "Cancelled",
//         statusColor: "red",
//     },
//     {
//         transaction: "Payment from Bonnie Green",
//         date: "Apr 15, 2021",
//         amount: "$5000",
//         status: "In progress",
//         statusColor: "blue",
//     },
//     {
//         transaction: "Payment from Jese Leos",
//         date: "Apr 15, 2021",
//         amount: "$2300",
//         status: "In progress",
//         statusColor: "blue",
//     },
//     {
//         transaction: "Payment from THEMSBERG LLC",
//         date: "Apr 11, 2021",
//         amount: "$280",
//         status: "Completed",
//         statusColor: "green",
//     },
// ];
//
// // Y-axis labels for chart
// const yAxisLabels = ["240K", "200K", "160K", "120K", "80K", "40K", "0K"];
//
// // X-axis labels for chart
// const xAxisLabels = [
//     "01 Apr",
//     "02 Apr",
//     "03 Apr",
//     "04 Apr",
//     "05 Apr",
//     "06 Apr",
//     "07 Apr",
// ];
//
// export default function Dashboard() {
//     return (
//         <div className="flex flex-col w-full gap-4 p-4">
//             <Card className="w-full">
//                 <CardContent className="p-8">
//                     <div className="flex flex-col gap-[30px] w-full">
//                         <div className="flex items-center gap-2.5 w-full">
//                             <div className="inline-flex items-center gap-2.5">
//                                 <h2 className="text-xl font-bold text-cool-gray900">Sales</h2>
//                                 <InfoIcon className="w-6 h-6" />
//                             </div>
//                         </div>
//
//                         <div className="relative w-full h-[418.85px]">
//                             {/* Y-axis labels */}
//                             <div className="inline-flex flex-col h-[371px] items-start gap-10 absolute top-0 left-0">
//                                 {yAxisLabels.map((label, index) => (
//                                     <div
//                                         key={index}
//                                         className="font-semibold text-cool-gray500 text-sm leading-5"
//                                     >
//                                         {label}
//                                     </div>
//                                 ))}
//                             </div>
//
//                             {/* Chart area */}
//                             <div className="absolute w-[calc(100%-85px)] h-[383px] top-2 left-[85px]">
//                                 {/* Horizontal grid lines */}
//                                 <div className="flex flex-col w-full items-start gap-[60px] absolute top-[3px] left-0">
//                                     {Array(7)
//                                         .fill(0)
//                                         .map((_, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="relative w-full h-px bg-gray-200"
//                                             />
//                                         ))}
//                                 </div>
//
//                                 {/* Chart visualization */}
//                                 <div className="absolute w-full h-[383px] top-0 left-0">
//                                     <div className="relative w-full h-[382px] top-px -left-px">
//                                         {/* Tooltip vertical line */}
//                                         <div className="absolute w-px h-[382px] top-0 left-[34%] bg-gray-200" />
//
//                                         {/* Tooltip */}
//                                         <div className="absolute w-[155px] h-[101px] top-[117px] left-[calc(34%-16px)]">
//                                             <div className="relative w-[154px] h-[99px] top-0.5 bg-white rounded-md shadow-lg border border-gray-200 p-3">
//                                                 <div className="text-xs font-medium text-cool-gray600">
//                                                     2 Apr, 2021
//                                                 </div>
//                                                 <div className="mt-2 flex items-center">
//                                                     <div className="w-3 h-3 rounded-md bg-green-500 mr-4" />
//                                                     <span className="text-gray-600">Sales: </span>
//                                                     <span className="font-semibold text-gray-900 ml-1">
//                             $79k
//                           </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//
//                                         {/* Chart line */}
//                                         <svg
//                                             className="absolute w-full h-[105px] top-[142px]"
//                                             viewBox="0 0 1162 105"
//                                             fill="none"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                         >
//                                             <path
//                                                 d="M0 67.5C19.3667 67.5 38.7333 56.5 58.1 56.5C77.4667 56.5 96.8333 67.5 116.2 67.5C135.567 67.5 154.933 45.5 174.3 45.5C193.667 45.5 213.033 56.5 232.4 56.5C251.767 56.5 271.133 34.5 290.5 34.5C309.867 34.5 329.233 45.5 348.6 45.5C367.967 45.5 387.333 56.5 406.7 56.5C426.067 56.5 445.433 23.5 464.8 23.5C484.167 23.5 503.533 45.5 522.9 45.5C542.267 45.5 561.633 34.5 581 34.5C600.367 34.5 619.733 45.5 639.1 45.5C658.467 45.5 677.833 56.5 697.2 56.5C716.567 56.5 735.933 34.5 755.3 34.5C774.667 34.5 794.033 45.5 813.4 45.5C832.767 45.5 852.133 34.5 871.5 34.5C890.867 34.5 910.233 45.5 929.6 45.5C948.967 45.5 968.333 23.5 987.7 23.5C1007.07 23.5 1026.43 12.5 1045.8 12.5C1065.17 12.5 1084.53 1.5 1103.9 1.5C1123.27 1.5 1142.63 12.5 1162 12.5"
//                                                 stroke="#10B981"
//                                                 strokeWidth="2"
//                                             />
//                                         </svg>
//
//                                         {/* Data point */}
//                                         <div className="w-2.5 h-2.5 top-[238px] left-[34%] rounded-[7px] border-2 border-solid border-white shadow-[0px_2px_4px_#44444f26] absolute bg-green-500" />
//                                     </div>
//                                 </div>
//                             </div>
//
//                             {/* X-axis labels */}
//                             <div className="flex w-[calc(100%-85px)] items-start justify-between absolute top-[399px] left-[85px]">
//                                 {xAxisLabels.map((label, index) => (
//                                     <div
//                                         key={index}
//                                         className="font-semibold text-cool-gray500 text-sm leading-5"
//                                     >
//                                         {label}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//
//             <div className="flex flex-col md:flex-row gap-4 w-full">
//                 {/* Latest Customers Card */}
//                 <Card className="w-full md:w-[380px]">
//                     <CardHeader className="p-6 pb-0">
//                         <CardTitle>Latest Customers</CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-6 pt-4">
//                         {customers.map((customer, index) => (
//                             <React.Fragment key={index}>
//                                 <div className="flex items-center py-[9px]">
//                                     <div className="flex items-center gap-2 flex-1">
//                                         <Avatar className="w-8 h-8">
//                                             <AvatarImage src={customer.avatar} alt={customer.name} />
//                                             <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
//                                         </Avatar>
//                                         <div className="flex flex-col flex-1">
//                                             <div className="font-semibold text-cool-gray900 text-base">
//                                                 {customer.name}
//                                             </div>
//                                             <div className="text-xs text-cool-gray500">
//                                                 {customer.email}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="font-semibold text-cool-gray900 text-base text-right">
//                                         {customer.amount}
//                                     </div>
//                                 </div>
//                                 {index < customers.length - 1 && <Separator />}
//                             </React.Fragment>
//                         ))}
//                     </CardContent>
//                 </Card>
//
//                 {/* Top Products Card */}
//                 <Card className="flex-1">
//                     <CardHeader className="p-6 pb-0">
//                         <CardTitle>Top products</CardTitle>
//                     </CardHeader>
//                     <CardContent className="p-6 pt-4">
//                         {topProducts.map((product, index) => (
//                             <React.Fragment key={index}>
//                                 <div className="flex items-center py-[9px]">
//                                     <div className="flex flex-col flex-1">
//                                         <div className="font-semibold text-cool-gray900 text-base">
//                                             {product.name}
//                                         </div>
//                                         <div className="text-xs text-cool-gray500">
//                                             {product.tech}
//                                         </div>
//                                     </div>
//                                     <div className="font-semibold text-right">
//                                         <span className="text-gray-900">{product.sales}</span>
//                                         <span className="text-gray-600 font-normal"> sales</span>
//                                     </div>
//                                 </div>
//                                 {index < topProducts.length - 1 && <Separator />}
//                             </React.Fragment>
//                         ))}
//                     </CardContent>
//                 </Card>
//             </div>
//
//             {/* Transactions Card */}
//             <Card>
//                 <CardHeader className="p-4">
//                     <CardTitle>Transactions</CardTitle>
//                     <CardDescription>
//                         This is a list of latest transactions.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className="bg-cool-gray050 rounded-tl-xl">
//                                     TRANSACTION
//                                 </TableHead>
//                                 <TableHead className="bg-cool-gray050">DATE & TIME</TableHead>
//                                 <TableHead className="bg-cool-gray050">AMOUNT</TableHead>
//                                 <TableHead className="bg-cool-gray050 rounded-tr-xl">
//                                     STATUS
//                                 </TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {transactions.map((transaction, index) => (
//                                 <TableRow
//                                     key={index}
//                                     className={index % 2 === 0 ? "" : "bg-cool-gray050"}
//                                 >
//                                     <TableCell>{transaction.transaction}</TableCell>
//                                     <TableCell className="text-cool-gray500">
//                                         {transaction.date}
//                                     </TableCell>
//                                     <TableCell className="font-medium text-cool-gray900">
//                                         {transaction.amount}
//                                     </TableCell>
//                                     <TableCell>
//                                         <Badge
//                                             variant="outline"
//                                             className={`bg-${transaction.statusColor}-100 text-${transaction.statusColor}-800 hover:bg-${transaction.statusColor}-100 border-0`}
//                                         >
//                                             {transaction.status}
//                                         </Badge>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//
//             {/* Footer */}
//             <footer className="flex w-full bg-white rounded-2xl">
//                 <div className="flex items-center justify-between px-8 py-12 w-full">
//                     <div className="text-cool-gray500 text-base">
//                         © 2025 CosMall, LLC. All rights reserved.
//                     </div>
//                     <div className="flex items-center gap-6">
//                         <Facebook className="w-6 h-6 text-gray-500" />
//                         <Twitter className="w-6 h-6 text-gray-500" />
//                         <Github className="w-6 h-6 text-gray-500" />
//                         <Dribbble className="w-6 h-6 text-gray-500" />
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// }


import React from "react";
import axios from "axios";

function DashboardSection() {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">대시보드</h2>
            <p>여기는 대시보드 컨텐츠 영역입니다.</p>
        </div>
    );
}

export default DashboardSection;