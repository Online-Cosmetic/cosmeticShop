import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

function ProductList({ products, title }) {
  let navigate = useNavigate();
  let { id } = useParams();
  let product = products.find((x) => x.id == parseInt(id));

  return (
    <Container className="product-list pt-5">
      <div>
        <h4 style={{ fontSize: "30px" }}>{title}</h4>
      </div>
      <Row>
        {products.slice(0, 3).map((product, index) => (
          <Col key={index}>
            <Product
              onClick={() => navigate(`/detail/${product.id}`)}
              product={product}
              i={index + 1}
            />
          </Col>
        ))}
      </Row>
      <Row>
        {products.slice(3, 6).map((product, index) => (
          <Col key={index}>
            <Product
              onClick={() => navigate(`/detail/${product.id}`)}
              product={product}
              i={index + 4}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
function Product(props) {
  return (
    <div onClick={props.onClick} style={{ cursor: "pointer" }}>
      <img
        src={"/product(" + props.i + ").png"}
        width="100%"
        className="product-img"
      />
      <h5 className="product-title">{props.product.title}</h5>
      <p className="product-content">{props.product.content}</p>
      <p className="product-price">{"$ " + props.product.price}</p>
    </div>
  );
}

export default ProductList;
