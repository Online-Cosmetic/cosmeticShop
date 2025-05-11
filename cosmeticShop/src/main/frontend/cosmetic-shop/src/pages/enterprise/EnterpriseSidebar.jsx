// EnterpriseSidebar.jsx
import React, { useContext } from 'react';
import {AuthContext, useAuth} from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';

const EnterpriseSidebar = () => {

    // const { authState } = useContext(AuthContext);
    // if (!(authState.isLoggedIn && authState.role === 'COMPANY')) {
    //     return null;
    // }

    const { isAuthenticated, logout } = useAuth();

    if(!isAuthenticated){
        return null;
    }

    return (
        <aside>
            <ul>
                <li>
                    <NavLink to="/enterprise/dashboard">대시보드 홈</NavLink>
                </li>
                <li>
                    <NavLink to="/enterprise/dashboard/product-register">상품 등록</NavLink>
                </li>
                {/* 다른 기업회원 전용 메뉴들 */}
            </ul>
        </aside>
    );
};

export default EnterpriseSidebar;