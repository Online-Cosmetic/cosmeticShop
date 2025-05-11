// EnterpriseDashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import EnterpriseSidebar from './EnterpriseSidebar';

const EnterpriseDashboard = () => {
    return (
        <div className="dashboard-container">
            <EnterpriseSidebar />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default EnterpriseDashboard;