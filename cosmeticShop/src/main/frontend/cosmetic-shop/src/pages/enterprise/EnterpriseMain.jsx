// import React from "react";
// import Footer from "../../components/common/Footer.jsx";
// import SidebarSection from "./EnterpriseSidebar.jsx"; // 실제 파일 경로로 수정
// import EnterpriseDashboard from "./EnterpriseDashboard.jsx";
// import EnterpriseNavbar from "./EnterpriseNavbar.jsx";
//
// function EnterpriseMain() {
//     return (
//         <>
//         <EnterpriseNavbar />
//         <div className="flex flex-col w-full h-full bg-cool-gray50 overflow-hidden border border-solid border-black">
//             <header className="flex w-full h-[70px] items-center bg-white">
//                 <h1 className="ml-2 font-medium text-black text-2xl leading-9">
//                     CosMall Enterprise
//                 </h1>
//             </header>
//             <hr className="bg-cool-gray200" />
//             <div className="flex flex-1 w-full">
//                 <aside className="relative w-[16%] h-full">
//                     <SidebarSection />
//                 </aside>
//                 <main className="flex-1 w-[84%] h-full">
//                     <EnterpriseDashboard />
//                 </main>
//             </div>
//         </div>
//         <Footer />
//         </>
//     );
//
// }
//
// export default EnterpriseMain;
// src/pages/enterprise/EnterpriseMain.jsx
import React from 'react';
import EnterpriseNavbar from '../../components/enterprise/EnterpriseNavbar.jsx';
import EnterpriseDashboard from './EnterpriseDashboard.jsx';
import Footer from '../../components/common/Footer.jsx';

export default function EnterpriseMain() {
    return (
        <div className="flex flex-col min-h-screen">
            <EnterpriseNavbar />
            <header className="h-16 flex items-center px-6 bg-white border-b">
                <h1 className="text-2xl font-medium">CosMall Enterprise</h1>
            </header>
            <div className="flex flex-1">
                <EnterpriseDashboard />
            </div>
            <Footer />
        </div>
    );
}
