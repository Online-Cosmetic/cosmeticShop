// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Separator } from "@/components/ui/separator";
// import {
//     ClipboardList,
//     PieChart,
//     ReceiptText,
//     ShoppingBag,
//     Truck,
//     User,
// } from "lucide-react";
// import React from "react";
//
// export default function Sidebar() {
//     // Navigation items data
//     const navItems = [
//         {
//             icon: <PieChart className="w-6 h-6 text-green-500" />,
//             label: "Overview",
//             active: false,
//             textColor: "text-green-500",
//         },
//         {
//             icon: <ShoppingBag className="w-6 h-6" />,
//             label: "Products",
//             active: true,
//             subItems: [
//                 { icon: <ClipboardList className="w-6 h-6" />, label: "Management" },
//                 { icon: <ReceiptText className="w-6 h-6" />, label: "Discount" },
//             ],
//         },
//         {
//             icon: <Truck className="w-6 h-6" />,
//             label: "Order & Delivery",
//             active: false,
//         },
//         {
//             icon: <User className="w-6 h-6" />,
//             label: "My Page",
//             active: false,
//         },
//     ];
//
//     return (
//         <nav className="flex w-[250px] bg-white border-r border-cool-gray200">
//             <div className="flex flex-col w-full">
//                 <div className="flex flex-col p-3 pt-4 gap-[22px]">
//                     {/* Overview item */}
//                     <div className="flex items-center px-2 py-0 w-full">
//                         <div className="flex items-start gap-4 w-full">
//                             {navItems[0].icon}
//                             <div
//                                 className={`${navItems[0].textColor} font-medium whitespace-nowrap`}
//                             >
//                                 {navItems[0].label}
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Products accordion with sub-items */}
//                     <Accordion type="single" defaultValue="products" className="w-full">
//                         <AccordionItem value="products" className="border-0">
//                             <AccordionTrigger className="py-1 px-2 rounded-xl bg-cool-gray100 hover:no-underline hover:bg-cool-gray100">
//                                 <div className="flex items-start gap-4">
//                                     {navItems[1].icon}
//                                     <span className="font-medium text-cool-gray900">
//                     {navItems[1].label}
//                   </span>
//                                 </div>
//                             </AccordionTrigger>
//                             <AccordionContent className="pt-1.5 pb-0">
//                                 <div className="flex flex-col pl-12 gap-1.5">
//                                     {navItems[1].subItems.map((subItem, index) => (
//                                         <div
//                                             key={index}
//                                             className="flex items-start gap-2.5 py-[9px]"
//                                         >
//                                             {subItem.icon}
//                                             <div className="font-medium text-cool-gray900">
//                                                 {subItem.label}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </AccordionContent>
//                         </AccordionItem>
//                     </Accordion>
//
//                     {/* Order & Delivery item */}
//                     <div className="flex items-center px-2 py-0 w-full">
//                         <div className="flex items-start gap-4 w-full">
//                             {navItems[2].icon}
//                             <div className="text-cool-gray900 font-medium whitespace-nowrap">
//                                 {navItems[2].label}
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* My Page item */}
//                     <div className="flex items-center px-2 py-0 w-full">
//                         <div className="flex items-start gap-4 w-full">
//                             {navItems[3].icon}
//                             <div className="text-cool-gray900 font-medium whitespace-nowrap">
//                                 {navItems[3].label}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 <Separator className="h-[3px] bg-cool-gray200 mt-6" />
//             </div>
//         </nav>
//     );
// }


import React from "react";
import axios from "axios";

function SidebarSection() {
    return (
        <div className="p-6 bg-gray-100">
            <h2 className="text-xl font-bold mb-4">사이드바 메뉴</h2>
            <ul>
                <li className="mb-2">
                    <a href="#dashboard" className="hover:underline">
                        대시보드
                    </a>
                </li>
                <li className="mb-2">
                    <a href="#settings" className="hover:underline">
                        설정
                    </a>
                </li>
                <li className="mb-2">
                    <a href="#profile" className="hover:underline">
                        프로필
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default SidebarSection;