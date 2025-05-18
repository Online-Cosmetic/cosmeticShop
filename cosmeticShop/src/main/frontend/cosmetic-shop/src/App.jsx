<<<<<<< HEAD
// bootstrap library - Will be deleted soon
import "bootstrap/dist/css/bootstrap.min.css";
// react/hook
import { useState } from "react";
// style
import "./App.css";
// data for frontend-UI test
import data from "./data.jsx";
// Components
import ProductDetail from "./pages/user/ProductDetail.jsx";
import ProductList from "./components/user/ProductList.jsx";

import LogIn from "./pages/logIn/LogIn.jsx";
import SignUp from "./pages/signUp/signUp.jsx";
import MyPage from "./pages/myPage/myPage.jsx";
import QnaListPage from "./pages/qnaPage/qnaListPage.jsx";

import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";
// Routing
import { Routes, Route } from "react-router-dom";

function App() {
    let [products] = useState(data);
    let productRows = [];
    for (let i = 0; i < products.length; i += 3) {
        productRows.push(products.slice(i, i + 3));
    }
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            {/* Header(Navigation Bar) */}
                            <Header />
                            {/* Banner */}
                            <div className="max-w-screen-xl mx-auto px-4 py-4">
                                <div className="main-bg"></div>
                            </div>
                            <section className="mb-10">
                                <div className="flex justify-center space-x-10">
                                    <div>
                                        <h2 className="text-xl font-semibold pb-4">Best Seller</h2>
                                        <p className="test-sm text-gray-500 pb-4">A subheading for this section, as long or as short as you like</p>
                                        <div>
                                            <button className="bg-black text-white mr-2 px-3 py-1.5 rounded-lg">Button</button>
                                            <button className="bg-gray-200 text-black px-3 py-1.5 rounded-lg">Secondary button</button>
                                        </div>
                                    </div>
                                    <div>
                                        <img
                                            src="public/product(1).png"
                                            className="w-[500px] h-[300px] object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                            </section>
                            <section>
                                <div className="flex justify-center space-x-10">
                                    <div>
                                        <img
                                            src="public/product(1).png"
                                            className="w-[500px] h-[300px] object-cover rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold pb-4">Best Seller</h2>
                                        <p className="test-sm text-gray-500 pb-4">A subheading for this section, as long or as short as you like</p>
                                        <div>
                                            <button className="bg-black text-white mr-2 px-3 py-1.5 rounded-lg">Button</button>
                                            <button className="bg-gray-200 text-black px-3 py-1.5 rounded-lg">Secondary button</button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div></div>

                            {/* ProductList(1) - Best Seller */}
                            <ProductList products={products} title="Best Seller" />
                            {/* ProductList(2) - MD's Pick */}
                            {/* <ProductList products={products} title="MD's Pick"/> */}
                            {/* footer - Will be Added Soon */}
                            <Footer />
                        </>
                    }
                />

                {/* Routing */}
                <Route
                    path="/detail/:id"
                    element={<ProductDetail products={products} title="Related products" />}
                />
                <Route
                    path="/login"
                    element={<LogIn />}
                />
                <Route
                    path="/signUp"
                    element={<SignUp />}
                />
                <Route
                    path="/myPage"
                    element={<MyPage />}
                />
                                <Route
                    path="/qnaListPage"
                    element={<QnaListPage/>}
                />
                {/* 404 page */}
                <Route
                    path="*"
                    element={<div>404</div>}
                />
            </Routes>

        </>
    );
}

export default App;
=======
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { emitter } from "./utils/customAxios.js";

// 공통 컴포넌트
import UserHeader from './components/common/UserHeader.jsx';
import Footer from "./components/common/Footer.jsx";
import ProtectedRoute from './components/ProtectedRoute';

// 사용자 페이지
import ProductList from "./pages/product/ProductList.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import Cart from "./pages/cart/Cart.jsx";
import MyPage from "./pages/user/MyPage.jsx";
// import QnA from "./pages/qna/QnA.jsx";
import QnA from "./pages/qna/QnAList.jsx";
import Order from "./pages/order/Order.jsx";
// import Checkout from "./pages/payment/Checkout.jsx";

import UserLogin from './pages/auth/UserLogin.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import OrderHistory from './pages/order/OrderHistory.jsx';

// 기업 페이지
import EnterpriseMain from './pages/enterprise/EnterpriseMain.jsx';
import ProductRegister from "./pages/product/ProductRegister.jsx";
import EnterpriseLogin from './pages/auth/EnterpriseLogin.jsx';
import EnterpriseSignUp from "./pages/auth/EnterpriseSignUp.jsx";
import ProductManagement from './pages/product/ProductManagement.jsx';

// 인증 관련 페이지
import Logout from "./pages/auth/Logout.jsx";

// 데이터
import data from './utils/data.js';

const PublicLayout = ({ children }) => (
    <>
        <UserHeader />
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
                                    <Route path="order" element={<Order />} />
                                    {/*<Route path="checkout" element={<Checkout />} />*/}
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
>>>>>>> origin/develop
