import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import data from "./utils/data.js";

import ProductDetail from "./pages/user/ProductDetail.jsx";
import ProductList from "./components/user/ProductList.jsx";
import UserLogin from "./pages/user/UserLogin.jsx";
import Logout from "./pages/user/Logout.jsx";
import SignUp from "./pages/user/SignUp.jsx";
import MyPage from "./pages/user/MyPage.jsx";
import RegisterProduct from "./pages/product/RegisterProduct.jsx";
import EnterpriseLogin from "./pages/enterprise/EnterpriseLogin.jsx";
import EnterpriseSignUp from "./pages/enterprise/EnterpriseSignUp.jsx";
import EnterpriseMain from "./pages/enterprise/EnterpriseMain.jsx";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";

import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Axios 전역 설정
axios.defaults.baseURL = "http://localhost:9000";
axios.defaults.withCredentials = true;

function App() {
    let [products] = useState(data);


    // 로그아웃 처리 컴포넌트
    function Logout() {
        const navigate = useNavigate();
        useEffect(() => {
            // 서버 쪽 쿠키 만료 요청 (엔드포인트 구현 필요)
            axios.post("/api/auth/logout").catch(() => {});
            navigate("/login");
        }, []);
        return null;
    }

    // 제품을 3개씩 묶어 표시하기 위해 행 분할
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
                            <Header />
                            {/* 메인 페이지 UI 생략 */}
                            <ProductList products={products} title="Best Seller" />
                            {/* 임시 RegisterProduct 페이지 네비게이션 링크 */}
                            <div className="text-center my-4">
                                <Link to="/registerProduct" className="btn btn-primary">
                                    임시 - Register Product 페이지로 이동
                                </Link>
                            </div>
                            <Footer />
                        </>
                    }
                />

                <Route
                    path="/detail/:id"
                    element={<ProductDetail products={products} title="Related products" />}
                />

                <Route path="/login" element={<UserLogin />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/myPage" element={<MyPage />} />
                <Route path="/enterpriseLogin" element={<EnterpriseLogin />} />
                <Route path="/enterpriseSignUp" element={<EnterpriseSignUp />} />
                <Route path="/enterpriseMain" element={<EnterpriseMain />} />
                <Route path="/logout" element={<Logout />} />

                {/* RegisterProduct 페이지 라우트 추가 */}
                <Route path="/registerProduct" element={<RegisterProduct />} />

                {/* 404 */}
                <Route path="*" element={<div>404</div>} />
            </Routes>
        </>
    );
}

export default App;