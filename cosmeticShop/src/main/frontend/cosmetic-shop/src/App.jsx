import "./App.css";

import React, {useEffect} from "react";
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import {emitter} from "./utils/customAxios.js";

// 공통 컴포넌트
import UserHeader from "./components/common/UserHeader.jsx";
import Footer from "./components/common/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

// 공통 접근 가능 페이지
import HomePage from "./pages/common/HomePage.jsx";

// 사용자 페이지
import ProductPage from "./pages/product/ProductPage.jsx";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import Cart from "./pages/cart/Cart.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import QnA from "./pages/qna/QnAList.jsx";
import QnADetail from "./pages/qna/QnADetail.jsx";
import QnAWrite from "./pages/qna/QnAWrite.jsx";
import Order from "./pages/order/Order.jsx";
import OrderComplete from "./pages/order/OrderComplete";
import Checkout from "./pages/payment/Checkout.jsx";
import UserLogin from "./pages/auth/UserLogin.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import OrderHistory from "./pages/user/MyComponents/OrderHistory.jsx";
import AddressBook from "./pages/user/MyComponents/AddressBook.jsx";
import AddressForm from "./components/order/AddressForm.jsx";
import ThanksForSignUp from './pages/user/MyComponents/ThanksForSignUp';

// 리뷰 관련 페이지
import ReviewWrite from "./pages/user/MyComponents/ReviewWrite.jsx";
import ThanksForReview from "./pages/review/ThanksForReview.jsx";

// 기업 페이지
import EnterpriseHeader from "./components/enterprise/EnterpriseHeader.jsx";
import EnterpriseSidebar from "./components/enterprise/EnterpriseSidebar.jsx";
import EnterpriseMain from "./pages/enterprise/EnterpriseMain.jsx";
import ProductRegister from "./pages/product/ProductRegister.jsx";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin.jsx";
import EnterpriseSignUp from "./pages/auth/EnterpriseSignUp.jsx";
import ProductManagement from "./pages/product/ProductManagement.jsx";
import OrderManagement from "./pages/enterprise/OrderManagement.jsx";
import ThanksForEnterpriseSignUp from './pages/enterprise/ThanksForEnterpriseSignUp';

// 관리자 페이지
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminMain from "./pages/admin/AdminMain.jsx";
import AdminQnAManagement from "./pages/admin/AdminQnAManagement.jsx";
import AdminQnAResponse from "./pages/admin/AdminQnAResponse.jsx";
import AdminCouponIssuance from "./pages/admin/AdminCouponIssuance.jsx";
import AdminSidebar from "./components/admin/AdminSidebar.jsx";
import AdminHeader from "./components/admin/AdminHeader.jsx";

// 인증 관련 페이지
import Logout from "./pages/auth/Logout.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
// import OAuth2Redirect from "./pages/auth/OAuth2Redirect.jsx";

// 데이터
import data from "./utils/data.js";

// User용 Layout 컴포넌트
const PublicLayout = ({children}) => (
    <div className="flex flex-col min-h-screen">
        <UserHeader/>
        <main className="flex-grow flex items-start justify-center py-16 px-20">
            {children}
        </main>
        <Footer/>
    </div>
);

// Enterprise용 Layout 컴포넌트
const EnterpriseLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <EnterpriseHeader />
            <main className="flex flex-1 gap-4 bg-neutral-100">
                {/* Sidebar 1/6 */}
                <aside className="basis-1/6 bg-white">
                    <EnterpriseSidebar />
                </aside>
                {/* Content 5/6 */}
                <section className="basis-5/6 bg-neutral-100">
                    {children}
                </section>
            </main>
            <Footer />
        </div>
    );
};

// admin용 Layout 컴포넌트
const AdminLayout = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen">
            <AdminHeader />
            <main className="flex flex-1 gap-4 bg-neutral-100">
                {/* Sidebar 1/6 */}
                <aside className="basis-1/6 bg-white">
                    <AdminSidebar />
                </aside>
                {/* Content 5/6 */}
                <section className="basis-5/6 bg-neutral-100">
                    {children}
                </section>
            </main>
            <Footer />
        </div>
    );
};

// App.jsx에 QueryClient 추가
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// App.jsx에서 QueryClient 설정 수정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유효
      cacheTime: 1000 * 60 * 30, // 30분 동안 캐시 유지
      refetchOnMount: false,     // 컴포넌트 마운트 시 재요청 안 함
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 안 함
    },
  },
});

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        emitter.on("logout", () => {
            localStorage.removeItem("accessToken");
            navigate("/login", {replace: true});
        });
    }, [navigate]);

    return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <Routes>
                {/* 공개 페이지 - 비로그인 사용자도 접근 가능 */}
                <Route
                    path="/"
                    element={
                        <div className="flex flex-col min-h-screen">
                            <UserHeader/>
                            <main className="flex-grow flex items-start justify-center">
                                <HomePage />
                            </main>
                            <Footer/>
                        </div>
                    }
                />
                {/* 네비게이션바 라우팅 */}
                <Route
                    path="/products/*"
                    element={
                        <PublicLayout>
                            <Routes>
                                <Route
                                    index
                                    element={<Navigate to="All" replace />}
                                />
                                <Route
                                    path=":category"
                                    element={<ProductPage />}
                                />
                            </Routes>
                        </PublicLayout>
                    }
                />

                {/*상품 상세 페이지도 API 사용하도록 수정*/}
                <Route
                    path="/detail/:id"
                    element={
                        <PublicLayout>
                            <ProductDetail products={data} title="Related products"/>
                        </PublicLayout>
                    }
                />

                <Route
                    path="/qna"
                    element={
                        <PublicLayout>
                            <QnA/>
                        </PublicLayout>
                    }
                />

                <Route
                    path="/QnAWrite"
                    element={
                        <PublicLayout>
                            <QnAWrite/>
                        </PublicLayout>
                    }
                />

                <Route
                    path="/QnADetail/:id"
                    element={
                        <PublicLayout>
                            <QnADetail/>
                        </PublicLayout>
                    }
                />

                {/* 인증 페이지 - 로그인하지 않은 사용자만 접근 가능 */}
                <Route
                    path="/login"
                    element={
                        <PublicLayout>
                            <UserLogin/>
                        </PublicLayout>
                    }
                />


                <Route
                    path="/signup"
                    element={
                        <PublicLayout>
                            <SignUp/>
                        </PublicLayout>
                    }
                />

                <Route path="/thanks-for-signup" element={<ThanksForSignUp />}/>
                <Route path="/thanks-for-enterprise-signup" element={<ThanksForEnterpriseSignUp />} />

                <Route
                    path={"/forgotPassword"}
                    element={
                        <PublicLayout>
                            <ForgotPassword/>
                        </PublicLayout>
                    }
                />

                {/* 로그아웃 */}
                <Route path="/logout" element={<Logout/>}/>

                {/* 새로 추가하는 관리자 라우트 */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 일반 회원 전용 페이지 */}
                <Route
                    path="/user/*"
                    element={
                        <ProtectedRoute requiredRole="ROLE_USER">
                            <PublicLayout>
                                <Routes>
                                    <Route path="mypage" element={<MyPage/>}/>
                                    <Route path="cart" element={<Cart/>}/>
                                    <Route path="orders" element={<OrderHistory/>}/>
                                    <Route path="order" element={<Order/>}/>
                                    <Route path="order/complete" element={<OrderComplete/>}/>
                                    <Route path="checkout" element={<Checkout />} />
                                    {/* 일반 회원 전용 페이지 라우트 내부에 추가 */}
                                    <Route path="addresses" element={<AddressBook />} />
                                    <Route path="addresses/new" element={<AddressForm />} />
                                    <Route path="addresses/edit/:id" element={<AddressForm />} />

                                    {/* 리뷰 관련 라우트 */}
                                    <Route path="review/write/:productId" element={<ReviewWrite />} />
                                    <Route path="review/edit/:reviewId" element={<ReviewWrite />} />
                                    <Route path="review/thanks" element={<ThanksForReview />} />
                                </Routes>
                            </PublicLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 기업 회원 전용 페이지 */}
                <Route path="/enterprise/login" element={<EnterpriseLogin />} />
                <Route path="/enterprise/signup" element={<EnterpriseSignUp />} />
                    <Route
                        path="/enterprise/*"
                    element={
                        <EnterpriseLayout>
                            <Routes>
                                <Route path="/" element={<EnterpriseMain />} />
                                <Route path="dashboard" element={<EnterpriseMain />} />
                                <Route path="product/register" element={<ProductRegister />} />
                                <Route path="product/manage" element={<ProductManagement />} />
                                <Route path="orders" element={<OrderManagement />} />
                            </Routes>
                        </EnterpriseLayout>
                    }
                />

                {/*/!* 소셜 로그인 콜백 라우트 *!/*/}
                {/*<Route*/}
                {/*    path="/oauth2/redirect"*/}
                {/*    element={<OAuth2Redirect/>}*/}
                {/*/>*/}

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute requiredRole="ROLE_ADMIN">
                            <AdminLayout>
                                <Routes>
                                    {/*<Route path="/" element={<AdminMain />} />*/}
                                    <Route path="main" element={<AdminMain />} />
                                    <Route path="statistics" element={
                                        <div className="w-full max-w-[1262px] mx-auto p-4 flex justify-center items-center min-h-[400px]">
                                            <div className="text-xl text-gray-500">Statistics page will be implemented later.</div>
                                        </div>
                                    } />
                                    <Route path="qna" element={<AdminQnAManagement />} />
                                    <Route path="qna/:id/response" element={<AdminQnAResponse />} />
                                    <Route path="coupon" element={<AdminCouponIssuance />} />
                                </Routes>
                            </AdminLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 및 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
      </AuthProvider>
    </QueryClientProvider>
    );
};

export default App;
