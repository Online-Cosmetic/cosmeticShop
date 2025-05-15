import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, {useEffect, useState} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import {emitter} from "./utils/customAxios.js";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';

import UserLogin from './pages/user/UserLogin.jsx';
import EnterpriseMain from './pages/enterprise/EnterpriseMain.jsx';
import Header from './components/common/Header.jsx';
import ProductList from "./components/user/ProductList.jsx";
import Footer from "./components/common/Footer.jsx";
import SignUp from "./pages/user/SignUp.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import EnterpriseLogin from "./pages/enterprise/EnterpriseLogin.jsx";
import Cart from "./pages/user/Cart.jsx";
import QnA from "./pages/user/QnA.jsx";
import EnterpriseSignUp from "./pages/enterprise/EnterpriseSignUp.jsx";
import Logout from "./pages/user/Logout.jsx";
import ProductRegister from "./pages/product/ProductRegister.jsx";
import ProductDetail from "./pages/user/ProductDetail.jsx";
import data from './utils/data.js';

const App = () => {
    const navigate = useNavigate();
    useEffect(() => {
        emitter.on('logout', () => {
            localStorage.removeItem('accessToken');
            navigate('/login', { replace: true });
        });
    }, [navigate]);

    let [products] = useState(data);

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Header />
                                {/* 메인 페이지 UI 생략 */}
                                <ProductList products={products} title="Best Seller" />
                                {/*/!* 임시 RegisterProduct 페이지 네비게이션 링크 *!/*/}
                                {/*<div className="text-center my-4">*/}
                                {/*    <Link to="/registerProduct" className="btn btn-primary">*/}
                                {/*        임시 - Register Product 페이지로 이동*/}
                                {/*    </Link>*/}
                                {/*</div>*/}
                                <Footer />
                            </>
                        }
                    />

                    <Route
                        path="/detail/:id"
                        element={<ProductDetail products={products} title="Related products" />}
                    />

                    <Route path="/login" element={<LoginForm />} />

                    <Route path="/signup" element={<SignupForm />} />

                    {/* USER 권한 필요 */}
                    <Route
                        path="/user/*"
                        element={
                            <ProtectedRoute requiredRole="ROLE_USER">
                                {/* 일반 회원 전용 컴포넌트 */}
                                <div>일반 회원 페이지</div>
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/enterpriseLogin" element={<EnterpriseLogin />} />

                    {/* USER 권한 필요 */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute requiredRole="ROLE_USER">
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/qna" element={<QnA />} />

                    <Route path="/enterpriseSignUp" element={<EnterpriseSignUp />} />

                    <Route path="/logout" element={<Logout />} />

                    {/* COMPANY 권한 필요 */}
                    <Route
                        path="/company/*"
                        element={
                            <ProtectedRoute requiredRole="ROLE_COMPANY">
                                {/* 기업 회원 전용 컴포넌트 */}
                                <div>기업 회원 페이지</div>
                            </ProtectedRoute>
                        }
                    />

                    {/* RegisterProduct 페이지 라우트 추가 */}
                    <Route path="/registerProduct"
                       element={
                           <ProtectedRoute requiredRole="ROLE_COMPANY">
                            <ProductRegister />
                           </ProtectedRoute>
                        }
                    />

                    {/* 기본 리다이렉트 */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;