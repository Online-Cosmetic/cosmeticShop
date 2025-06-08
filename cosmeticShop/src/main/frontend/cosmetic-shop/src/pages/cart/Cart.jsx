import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductCard from "../../components/product/ProductCard.jsx";
import CartSummary from "../../components/cart/CartSummary.jsx";
import {userAPI} from '../../utils/customAxios';

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [checkedItems, setCheckedItems] = useState(new Set()); // 체크박스에 체크한 상품 정보만 summary 에 포함시키기 위해
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCart() {
            setLoading(true);
            try {
                const res = await userAPI.cart.getAllCarts();
                setCartItems(res.data.items || []);
            } catch (e) {
                alert('장바구니 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        }

        fetchCart();
    }, []);

    const handleCheckItem = (productId) => {
        setCheckedItems(prev => {
            const newChecked = new Set(prev);
            if (newChecked.has(productId)) {
                newChecked.delete(productId);
            } else {
                newChecked.add(productId);
            }
            return newChecked;
        });
    };

    const handleCheckout = () => {
        if (checkedItems.size === 0) {
            alert('선택한 상품이 없습니다.');
            return;
        }
        
        // 체크된 아이템 ID 배열로 변환
        const selectedCartIds = Array.from(checkedItems);
        
        // 선택된 장바구니 아이템 ID를 쿼리 파라미터로 전달
        navigate("/user/order", { 
            state: { selectedCartIds }
        });
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <main className="flex-grow">
                <div className="">
                    {/* Cart */}
                    <h2 className="text-3xl font-bold text-neutral-800 mb-6">Cart</h2>
                    {/* (좌)상품 목록 + (우)주문 요약 */}
                    <div className="flex gap-16 border rounded-lg p-6 shadow">
                        {/* 상품 목록 */}
                        <div className="flex flex-1 flex-col">
                            {loading ? (
                                <div>로딩 중...</div>
                            ) : cartItems.length === 0 ? (
                                <div>장바구니가 비어있습니다.</div>
                            ) : (
                                cartItems.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuantityChange={() => {}}
                                        editable={false}
                                        isChecked={checkedItems.has(product.id)}
                                        onCheck={() => handleCheckItem(product.id)}
                                    />
                                ))
                            )}
                        </div>

                        {/* 주문 요약 + 버튼 */}
                        <div className="w-96 flex-shrink-0 space-y-6">
                            <div className="border rounded-lg p-6 shadow">
                                <h3 className="text-2xl font-semibold mb-4">Cart Summary</h3>
                                <div className="flex flex-col gap-6">
                                    <CartSummary
                                        cartItems={cartItems.filter(item => checkedItems.has(item.id))}/>
                                    <button
                                        className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"
                                        onClick={handleCheckout}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Cart;