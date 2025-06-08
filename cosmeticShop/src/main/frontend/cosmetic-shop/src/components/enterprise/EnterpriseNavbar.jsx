// // src/components/enterprise/EnterpriseNavbar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseNavbar() {
    const { role, logout } = useAuth();
    const nav = useNavigate();

    const onLogout = async () => {
        await logout();
        nav('/enterprise/login');
    };

    return (
        <nav className="p-4 bg-white shadow">
            {role === 'ROLE_COMPANY' ? (
                <button onClick={onLogout} className="text-red-500">
                    Enterprise Logout
                </button>
            ) : (
                <>
                    <a href="/" className="mr-4">Home</a>
                    <a href="/about">About</a>
                </>
            )}
        </nav>
    );
}

