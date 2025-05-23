// src/pages/enterprise/EnterpriseDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnterpriseSidebar from '../../components/enterprise/EnterpriseSidebar.jsx';

export default function EnterpriseDashboard() {
    return (
        <div className="flex h-full">
            <aside className="w-1/5 border-r">
                <EnterpriseSidebar />
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
