import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { emitter } from "./utils/customAxios.js";

// 공통 컴포넌트
import Header from './components/common/Header.jsx';
import Footer from "./components/common/Footer.jsx";
import ProtectedRoute from './components/ProtectedRoute';

// 사용자 페이지
import ProductList from "./components/product/ProductList.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import Cart from "./pages/cart/Cart.jsx";
import MyPage from "./pages/user/MyPage.jsx";
// import QnA from "./pages/qna/QnA.jsx";
import QnA from "./pages/qna/QnAList.jsx";

import UserLogin from './pages/auth/UserLogin.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import OrderHistory from './pages/order/OrderHistory.jsx';

// 기업 페이지
import EnterpriseMain from './pages/enterprise/EnterpriseMain.jsx';
import ProductRegister from "./pages/product/ProductRegister.jsx";
import EnterpriseLogin from './pages/auth/EnterpriseLogin.jsx';
import EnterpriseSignUp from "./pages/auth/EnterpriseSignUp.jsx";
import ProductManagement from './pages/enterprise/ProductManagement.jsx';

// 인증 관련 페이지
import Logout from "./pages/auth/Logout.jsx";

// 데이터
import data from './utils/data.js';

const PublicLayout = ({ children }) => (
    <>
        <Header />
        {children}
        <Footer />
    </>
);

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        emitter.on('logout', () => {
            localStorage.removeItem('accessToken');
            navigate('/login', { replace: true });
        });
    }, [navigate]);

    return (
        <AuthProvider>
            <Routes>
                {/* 공개 페이지 - 비로그인 사용자도 접근 가능 */}
                <Route
                    path="/"
                    element={
                        <PublicLayout>
                            <ProductList products={data} title="Best Seller" />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/detail/:id"
                    element={
                        <PublicLayout>
                            <ProductDetail products={data} title="Related products" />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/qna"
                    element={
                        <PublicLayout>
                            <QnA />
                        </PublicLayout>
                    }
                />

                {/* 인증 페이지 - 로그인하지 않은 사용자만 접근 가능 */}
                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <UserLogin />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/enterpriseLogin"
                    element={
                        <PublicLayout>
                            <EnterpriseLogin />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/signup"
                    element={
                        <PublicLayout>
                            <SignUp />
                        </PublicLayout>
                    }
                />

                <Route
                    path="/enterpriseSignUp"
                    element={
                        <PublicLayout>
                            <EnterpriseSignUp />
                        </PublicLayout>
                    }
                />

                {/* 로그아웃 */}
                <Route path="/logout" element={<Logout />} />

                {/* 일반 회원 전용 페이지 */}
                <Route
                    path="/user/*"
                    element={
                        <ProtectedRoute requiredRole="ROLE_USER">
                            <PublicLayout>
                                <Routes>
                                    <Route path="mypage" element={<MyPage />} />
                                    <Route path="cart" element={<Cart />} />
                                    <Route path="orders" element={<OrderHistory />} />
                                </Routes>
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 기업 회원 전용 페이지 */}
                <Route
                    path="/company/*"
                    element={
                        <ProtectedRoute requiredRole="ROLE_COMPANY">
                            <PublicLayout>
                                <Routes>
                                    <Route path="/" element={<EnterpriseMain />} />
                                    <Route path="dashboard" element={<EnterpriseMain />} />
                                    <Route path="product/register" element={<ProductRegister />} />
                                    <Route path="products" element={<ProductManagement />} />
                                </Routes>
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 및 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
};

export default App;