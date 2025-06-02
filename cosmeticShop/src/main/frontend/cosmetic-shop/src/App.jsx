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

// import QnA from "./pages/qna/QnA.jsx";
import QnA from "./pages/qna/QnAList.jsx";
import QnADetail from "./pages/qna/QnADetail.jsx";
import QnAWrite from "./pages/qna/QnAWrite.jsx";

import Order from "./pages/order/Order.jsx";
import OrderComplete from "./pages/order/OrderComplete";

// import Checkout from "./pages/payment/Checkout.jsx";

import UserLogin from "./pages/auth/UserLogin.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import OrderHistory from "./pages/user/MyComponents/OrderHistory.jsx";

// 기업 페이지
import EnterpriseHeader from "./components/enterprise/EnterpriseHeader.jsx";
import EnterpriseSidebar from "./components/enterprise/EnterpriseSidebar.jsx";
import EnterpriseMain from "./pages/enterprise/EnterpriseMain.jsx";
import ProductRegister from "./pages/product/ProductRegister.jsx";
import EnterpriseLogin from "./pages/auth/EnterpriseLogin.jsx";
import EnterpriseSignUp from "./pages/auth/EnterpriseSignUp.jsx";
import ProductManagement from "./pages/product/ProductManagement.jsx";
import OrderManagement from "./pages/enterprise/OrderManagement.jsx";

// 관리자 페이지
import AdminQnAManagement from "./pages/admin/AdminQnAManagement.jsx";
import AdminQnAResponse from "./pages/admin/AdminQnAResponse.jsx";


// 인증 관련 페이지
import Logout from "./pages/auth/Logout.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

// 데이터
import data from "./utils/data.js";
import AdminSidebar from "./components/admin/AdminSidebar.jsx";
import AdminHeader from "./components/admin/AdminHeader.jsx";

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

const App = () => {
    const navigate = useNavigate();

    useEffect(() => {
        emitter.on("logout", () => {
            localStorage.removeItem("accessToken");
            navigate("/login", {replace: true});
        });
    }, [navigate]);

    return (
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
                                    element={<ProductPage products={dummyData} />}
                                />
                            </Routes>
                        </PublicLayout>
                    }
                />

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
                    path="/enterpriseLogin"
                    element={
                        <PublicLayout>
                            <EnterpriseLogin/>
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

                <Route
                    path={"/forgotPassword"}
                    element={
                        <PublicLayout>
                            <ForgotPassword/>
                        </PublicLayout>
                    }
                />

                <Route
                    path="/enterpriseSignUp"
                    element={
                        <PublicLayout>
                            <EnterpriseSignUp/>
                        </PublicLayout>
                    }
                />

                {/* 로그아웃 */}
                <Route path="/logout" element={<Logout/>}/>

                {/* 일반 회원 전용 페이지 */}
                <Route
                    path="/user/*"
                    element={
                        <PublicLayout>
                            <Routes>
                                <Route path="mypage" element={<MyPage/>}/>
                                <Route path="cart" element={<Cart/>}/>
                                <Route path="orders" element={<OrderHistory/>}/>
                                <Route path="order" element={<Order/>}/>
                                <Route path="order/complete" element={<OrderComplete/>}/>
                                {/*<Route path="checkout" element={<Checkout />} />*/}
                            </Routes>
                        </PublicLayout>
                    }
                />

                {/* 기업 회원 전용 페이지 */}
                <Route
                    path="/company/*"
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

                <Route
                    path="/admin/*"
                    element={
                        <AdminLayout>
                            <Routes>
                                <Route path="/qna" element={<AdminQnAManagement />} />
                                <Route path="/qna/:id/response" element={<AdminQnAResponse />} />
                            </Routes>
                        </AdminLayout>
                    }
                />

                {/* 404 및 리다이렉트 */}
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </AuthProvider>
    );
};

export default App;

const dummyData = [
    // makeup: 15개
    { id: 1, title: "립스틱 A", content: "선명한 컬러감", price: 12000, category: "makeup" },
    { id: 2, title: "쿠션 팩트", content: "촉촉한 커버력", price: 20000, category: "makeup" },
    { id: 3, title: "아이섀도우", content: "부드러운 발색", price: 17000, category: "makeup" },
    { id: 4, title: "아이라이너", content: "또렷한 눈매", price: 11000, category: "makeup" },
    { id: 5, title: "마스카라", content: "롱래쉬 효과", price: 15000, category: "makeup" },
    { id: 6, title: "블러셔", content: "자연스러운 생기", price: 13000, category: "makeup" },
    { id: 7, title: "컨실러", content: "잡티 커버", price: 14000, category: "makeup" },
    { id: 8, title: "파운데이션", content: "밀착력 강한", price: 21000, category: "makeup" },
    { id: 9, title: "틴트", content: "지속력 높은", price: 9000, category: "makeup" },
    { id: 10, title: "하이라이터", content: "광채 표현", price: 16000, category: "makeup" },
    { id: 11, title: "쉐딩", content: "입체적인 윤곽", price: 15000, category: "makeup" },
    { id: 12, title: "브로우 펜슬", content: "정교한 눈썹", price: 10000, category: "makeup" },
    { id: 13, title: "픽서", content: "메이크업 고정", price: 13000, category: "makeup" },
    { id: 14, title: "프라이머", content: "모공 커버", price: 14000, category: "makeup" },
    { id: 15, title: "립밤", content: "보습 효과", price: 8000, category: "makeup" },

    // skincare: 13개
    { id: 16, title: "토너", content: "피부결 정돈", price: 12000, category: "skincare" },
    { id: 17, title: "에센스", content: "집중 보습", price: 22000, category: "skincare" },
    { id: 18, title: "세럼", content: "미백 기능성", price: 25000, category: "skincare" },
    { id: 19, title: "크림", content: "수분 잠금", price: 18000, category: "skincare" },
    { id: 20, title: "클렌징폼", content: "자극 없는 세정", price: 10000, category: "skincare" },
    { id: 21, title: "클렌징오일", content: "딥클렌징", price: 16000, category: "skincare" },
    { id: 22, title: "마스크팩", content: "진정 효과", price: 2000, category: "skincare" },
    { id: 23, title: "아이크림", content: "눈가 집중 케어", price: 19000, category: "skincare" },
    { id: 24, title: "필링젤", content: "각질 제거", price: 12000, category: "skincare" },
    { id: 25, title: "페이셜 미스트", content: "수분 공급", price: 9000, category: "skincare" },
    { id: 26, title: "스팟케어", content: "트러블 완화", price: 11000, category: "skincare" },
    { id: 27, title: "수분크림", content: "산뜻한 마무리", price: 14000, category: "skincare" },
    { id: 28, title: "재생크림", content: "손상 피부 회복", price: 17000, category: "skincare" },

    // hair: 11개
    { id: 29, title: "샴푸", content: "두피 케어", price: 10000, category: "hair" },
    { id: 30, title: "컨디셔너", content: "윤기 강화", price: 11000, category: "hair" },
    { id: 31, title: "트리트먼트", content: "모발 손상 케어", price: 13000, category: "hair" },
    { id: 32, title: "헤어오일", content: "부드러움 강화", price: 15000, category: "hair" },
    { id: 33, title: "헤어에센스", content: "윤기 + 탄력", price: 17000, category: "hair" },
    { id: 34, title: "두피토닉", content: "탈모 예방", price: 14000, category: "hair" },
    { id: 35, title: "드라이샴푸", content: "간편 세정", price: 8000, category: "hair" },
    { id: 36, title: "컬크림", content: "컬 유지력", price: 10000, category: "hair" },
    { id: 37, title: "왁스", content: "강력한 고정력", price: 7000, category: "hair" },
    { id: 38, title: "헤어스프레이", content: "볼륨 유지", price: 9000, category: "hair" },
    { id: 39, title: "탈모샴푸", content: "두피 강화", price: 16000, category: "hair" },

    // body: 21개
    { id: 40, title: "바디워시", content: "향기로운 클렌징", price: 12000, category: "body" },
    { id: 41, title: "바디로션", content: "보습력 강화", price: 13000, category: "body" },
    { id: 42, title: "바디오일", content: "건조함 완화", price: 15000, category: "body" },
    { id: 43, title: "스크럽", content: "각질 제거", price: 14000, category: "body" },
    { id: 44, title: "바디미스트", content: "은은한 향기", price: 9000, category: "body" },
    { id: 45, title: "풋크림", content: "발 보습", price: 10000, category: "body" },
    { id: 46, title: "핸드크림", content: "손 보습", price: 8000, category: "body" },
    { id: 47, title: "데오드란트", content: "땀 억제", price: 7000, category: "body" },
    { id: 48, title: "바디클렌징바", content: "자연 유래 성분", price: 11000, category: "body" },
    { id: 49, title: "바디버터", content: "강력 보습", price: 16000, category: "body" },
    { id: 50, title: "바디크림", content: "촉촉한 유지", price: 15000, category: "body" },
    { id: 51, title: "목욕소금", content: "근육 이완", price: 10000, category: "body" },
    { id: 52, title: "샤워젤", content: "거품 풍성", price: 12000, category: "body" },
    { id: 53, title: "입욕제", content: "피로 회복", price: 9000, category: "body" },
    { id: 54, title: "마사지오일", content: "릴랙싱", price: 14000, category: "body" },
    { id: 55, title: "썬크림", content: "UV 차단", price: 15000, category: "body" },
    { id: 56, title: "보습밤", content: "건조부위 집중", price: 13000, category: "body" },
    { id: 57, title: "아로마오일", content: "심신 안정", price: 11000, category: "body" },
    { id: 58, title: "바디브러쉬", content: "마사지용", price: 8000, category: "body" },
    { id: 59, title: "바디솝", content: "촉촉한 거품", price: 10000, category: "body" },
    { id: 60, title: "바디클렌징폼", content: "딥클렌징", price: 12000, category: "body" }
];