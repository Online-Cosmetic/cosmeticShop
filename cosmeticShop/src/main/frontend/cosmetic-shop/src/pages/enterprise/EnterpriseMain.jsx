// src/pages/enterprise/EnterpriseMain.jsx
import React from 'react';
import SidebarSection from "./Sidebar.jsx"; // 실제 파일 경로로 수정
import DashboardSection from "./Overview.jsx"; // 실제 파일 경로로 수정

export default function EnterpriseMain() {
    return (
        <>
            <div className="flex flex-col w-full h-full bg-cool-gray50 overflow-hidden border border-solid border-black">
                <header className="flex w-full h-[70px] items-center bg-white">
                    <h1 className="ml-2 font-medium text-black text-2xl leading-9">
                        CosMall Enterprise
                    </h1>
                </header>
                <hr className="bg-cool-gray200" />
                <div className="flex flex-1 w-full">
                    <aside className="relative w-[16%] h-full">
                        <SidebarSection />
                    </aside>
                    <main className="flex-1 w-[84%] h-full">
                        <DashboardSection />
                    </main>
                </div>
            </div>
        </>
    );
}
