// // EnterpriseSidebar.jsx
// import React, {useContext} from 'react';
// import {AuthContext} from '../../context/AuthContext';
// import { NavLink } from 'react-router-dom';
//
// const EnterpriseSidebar = () => {
//
//     // const { authState } = useContext(AuthContext);
//     // if (!(authState.isLoggedIn && authState.role === 'COMPANY')) {
//     //     return null;
//     // }
//
//     // const { isAuthenticated } = useContext(AuthContext);
//     const { user } = useContext(AuthContext);
//
//     // if(!isAuthenticated){
//     //     return null;
//     // }
//
//     if(!user){
//         return null;
//     }
//
//     return (
//         <aside>
//             <ul>
//                 <li>
//                     <NavLink to="/enterprise/dashboard">대시보드 홈</NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/enterprise/dashboard/product-register">상품 등록</NavLink>
//                 </li>
//                 {/* 다른 기업회원 전용 메뉴들 */}
//             </ul>
//         </aside>
//     );
// };
//
// export default EnterpriseSidebar;
// src/components/enterprise/EnterpriseSidebar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

export default function EnterpriseSidebar() {
    const { user } = useAuth();
    if (user?.role !== 'ROLE_COMPANY') return null;

    return (
        <ul className="space-y-4 p-4">
            {/*<li>*/}
            {/*    <NavLink to="/enterprise/dashboard" className="hover:underline">*/}
            {/*        대시보드 홈*/}
            {/*    </NavLink>*/}
            {/*</li>*/}
            <li>
                <NavLink to="/company/product/register" className="hover:underline">
                    상품 등록
                </NavLink>
            </li>
            {/* 추가 메뉴 */}
        </ul>
    );
}
