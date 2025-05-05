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
