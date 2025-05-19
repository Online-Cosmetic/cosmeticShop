import React from "react";
import { useNavigate } from "react-router-dom";

{
  /*
await axios.post("/api/order", {
        totalPrice,
        shippingFee,
        promo,
        orderTotal,
      });
*/
}
function CartSummary() {
  const navigate = useNavigate();
  return (
    <div className="w-full flex-shrink-0 border rounded-lg p-6 shadow">
      <div className="flex justify-between mb-3 text-lg">
        <span>Total Price</span>
        <span>₩25,000</span>
      </div>
      <div className="flex justify-between mb-3 text-lg">
        <span>Shipping Fee</span>
        <span>₩2,500</span>
      </div>
      <div className="flex justify-between mb-3 text-lg font-bold">
        <span>Promo Info</span>
        <span>- ₩7,500</span>
      </div>
      <hr className="my-4" />
      <div className="flex justify-between mb-6 text-lg font-bold">
        <span>Order Total</span>
        <span>₩20,000</span>
      </div>
    </div>
  );
}
export default CartSummary;
