import React from "react";
import { Button, Container } from "react-bootstrap";
import ProductList from "../../components/user/ProductList.jsx";
import { useParams } from "react-router-dom";

function Detail({ products, title }) {
  let { id } = useParams();
  let product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div className="pt-5 container">
        <div className="row">
          <div className="col-md-6">
            <div className="detail-img-container">
              <img src={"/product(" + (product.id + 1) + ").png"} />
            </div>
          </div>
          <div className="col-md-6">
            <h4 className="pt-5">{product.title}</h4>
            <p className="pt-2 product-content">{product.content}</p>
            <p className="pt-1 product-price">{"$ " + product.price}</p>
            <p className="pt-2 product-content" style={{ fontSize: "13px" }}>
              Body text for describing what this product is and why this product
              is simply a must-buy.
            </p>
            <Button className="w-100" variant="dark">
              Add to Cart
            </Button>
            <p className="pt-3 product-content" style={{ fontSize: "10px" }}>
              Text box for additional details or fine print
            </p>
          </div>
        </div>
      </div>
      <ProductList products={products} title={title} />
    </>
  );
}

export default Detail;
