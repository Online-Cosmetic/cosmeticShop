import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductList({ products, title }) {
  let navigate = useNavigate();
  let { id } = useParams();
  let product = products.find((x) => x.id == parseInt(id));

  return (
      <>
          <div className="max-w-screen-xl mx-auto px-4 pt-5">
              <div className="mb-6">
                  <h4 className="text-2xl font-semibold">{title}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map((product, index) => (
                      <div
                          key={product.id}
                          onClick={() => navigate(`/detail/${product.id}`)}
                          className="cursor-pointer"
                      >
                          <Product product={product} i={index + 1} />
                      </div>
                  ))}
              </div>
          </div>
      </>
  );
}
function Product(props) {
  return (
    <div onClick={props.onClick} className="cursor-pointer p-4 w-full">
      <img
        src={"/product(" + props.i + ").png"}
        alt={props.product.title}
        className="w-[300px] h-[200px] object-cover rounded-lg"
      />
      <h5 className="text-lg font-semibold my-0.5">{props.product.title}</h5>
      <p className="text-gray-600 text-sm mb-0.5">{props.product.content}</p>
      <p className="text-black-600 text-lg">{"$ " + props.product.price}</p>
    </div>
  );
}

export default ProductList;
