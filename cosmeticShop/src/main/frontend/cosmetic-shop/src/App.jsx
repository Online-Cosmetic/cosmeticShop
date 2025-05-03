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
                        <Header/>
                        {/* Banner */}
                        <div className="max-w-screen-xl mx-auto px-4 py-4">
                            <div className="main-bg"></div>
                        </div>
                        {/* ProductList(1) - Best Seller */}
                        <ProductList products={products} title="Best Seller"/>
                        {/* ProductList(2) - MD's Pick */}
                        {/* <ProductList products={products} title="MD's Pick"/> */}
                        {/* footer - Will be Added Soon */}
                        <Footer/>
                    </>
                  }
              />

              {/* Routing */}
              <Route
                  path="/detail/:id"
                  element={<ProductDetail products={products} title="Related products"/>}
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
