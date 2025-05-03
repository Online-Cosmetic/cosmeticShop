import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Col,
} from "react-bootstrap";
import "./App.css";
import data from "./data.jsx";
import ProductDetail from "./pages/user/ProductDetail.jsx";
import ProductList from "./pages/user/ProductList.jsx";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

function App() {
  let [products] = useState(data);
  let navigate = useNavigate();
  let productRows = [];
  for (let i = 0; i < products.length; i += 3) {
    productRows.push(products.slice(i, i + 3));
  }
  return (
    // Fragments : JSX요소 그룹화할 때 사용하는 가상 wrapper
      <>
        {/* 네비게이션 바 */}
          <div className="bg-gray-100">
              <div className="container mx-auto flex items-center justify-between py-4 px-6">
                  <Link to="/" className="text-xl text-black">cosMall</Link>
                  <div className="flex space-x-4">
                      <Link to="/detail" className="text-gray-500 no-underline">Category</Link>
                      <Link to="/event" className="text-gray-500 no-underline">Event</Link>
                      <Link to="/faq" className="text-gray-500 no-underline">FAQ</Link>
                  </div>
              </div>
          </div>


        <Routes>
          {/* Route 컴포넌트는 페이지를 의미 */}
          <Route
              path="/"
              // element에 넣을 페이지 코드가 길어지므로 페이지도 컴포넌트로 만들면 가독성 up.
              element={
                <>
                  {/* 배너 */}
                    <div className="max-w-screen-xl mx-auto px-4">
                        <div className="main-bg"></div>
                    </div>
                  <ProductList products={products} title="Best Seller"/>
                  <ProductList products={products} title="MD's Pick"/>
                </>
              }
          />
          <Route
              path="/detail/:id"
              element={<ProductDetail products={products} title="Related products"/>}
          />
          <Route path="/about" element={<About/>}>
            <Route path="member" element={<div>멤버들</div>}/>
            <Route path="location" element={<div>회사위치</div>}/>
          </Route>
          {/* 404페이지 */}
          <Route path="*" element={<div>404</div>}></Route>
        </Routes>

        {/* footer */}
      </>
  );
}

function About() {
  return (
      <>
        <h4>회사정보임</h4>
        <Outlet></Outlet>
      </>
  );
}

export default App;
