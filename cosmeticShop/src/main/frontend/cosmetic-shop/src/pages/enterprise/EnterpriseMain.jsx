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
