import React from "react";
import EnterpriseHeader from "../../components/enterprise/EnterpriseHeader.jsx";
import EnterpriseSidebar from "../../components/enterprise/EnterpriseSidebar.jsx";
import Footer from "../../components/common/Footer.jsx";

function Overview() {
    return (
        <>
            {/* 헤더 */}
            <EnterpriseHeader />
            {/* 사이드바 */}
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <div className="w-1/6">
                    <EnterpriseSidebar />
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">대시보드</h2>
                    <p>여기는 대시보드 컨텐츠 영역입니다.</p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Overview;