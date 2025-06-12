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

    // 장바구니 상품 데이터 로드
    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await userAPI.cart.getAllCarts();
            // 상품 할인율에 따른 할인가 계산을 추가하여 cartItems 세팅
            const items = res.data.items || [];

            // 각 상품에 할인가 필드 추가
            const itemsWithDiscountedPrice = items.map(item => {
                const discountRate = item.discountRate || 0;
                const discountedPrice = Math.floor(item.price * (1 - discountRate / 100));
                return {
                    ...item,
                    discountedPrice: discountedPrice // 할인된 가격 추가
                };
            });

            setCartItems(itemsWithDiscountedPrice);

            // 개발 환경에서만 사용할 디버깅 코드
            console.log("장바구니 상품 데이터(할인 정보 포함):", itemsWithDiscountedPrice);

        } catch (e) {
            console.error("장바구니 정보 로드 실패:", e);
            alert('장바구니 정보를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 모든 상품 선택/해제 토글 함수 추가
    const toggleAllItems = (isChecked) => {
        if (isChecked) {
            // 모든 상품 선택
            const allItemIds = cartItems.map(item => item.id);
            setCheckedItems(new Set(allItemIds));
        } else {
            // 모든 상품 선택 해제
            setCheckedItems(new Set());
        }
    };

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

    const handleDeleteItem = async (productId) => {
        try {
            await userAPI.cart.removeFromCart(productId);
            // Remove the item from checkedItems if it was checked
            setCheckedItems(prev => {
                const newChecked = new Set(prev);
                if (newChecked.has(productId)) {
                    newChecked.delete(productId);
                }
                return newChecked;
            });
            // Refresh the cart to show updated items
            fetchCart();
        } catch (error) {
            console.error(`장바구니 아이템 삭제 실패: ${error.message}`);
            alert('장바구니 아이템을 삭제하지 못했습니다.');
        }
    };

    // 모든 상품이 체크되었는지 확인
    const areAllItemsChecked = cartItems.length > 0 && checkedItems.size === cartItems.length;

    // 선택된 상품들만 필터링
    const selectedCartItems = cartItems.filter(item => checkedItems.has(item.id));

    return (
        <div className="w-full max-w-5xl mx-auto">
            <main className="flex-grow">
                <div className="">
                    {/* Cart */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-neutral-800">장바구니</h2>
                        {/* 전체 선택 체크박스 추가 */}
                        {cartItems.length > 0 && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={areAllItemsChecked}
                                    onChange={(e) => toggleAllItems(e.target.checked)}
                                    className="w-5 h-5 accent-emerald-600 cursor-pointer rounded focus:ring-emerald-500 mr-2"
                                />
                                <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    전체 선택 ({checkedItems.size}/{cartItems.length})
                                </label>
                            </div>
                        )}
                    </div>

                    {/* (좌)상품 목록 + (우)주문 요약 */}
                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 border rounded-lg p-6 shadow bg-white">
                        {/* 상품 목록 */}
                        <div className="flex flex-1 flex-col">
                            {loading ? (
                                <div className="py-8 text-center text-gray-500">장바구니 정보를 불러오는 중...</div>
                            ) : cartItems.length === 0 ? (
                                <div className="py-16 text-center text-gray-500">
                                    <p className="text-xl font-medium mb-4">장바구니가 비어있습니다</p>
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        쇼핑 계속하기
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onQuantityChange={fetchCart}
                                        editable={false}
                                        isChecked={checkedItems.has(product.id)}
                                        onCheck={() => handleCheckItem(product.id)}
                                        onDelete={() => handleDeleteItem(product.id)}
                                    />
                                ))
                            )}
                        </div>

                        {/* 주문 요약 + 버튼 */}
                        <div className="w-full md:w-96 flex-shrink-0 space-y-6">
                            <div className="border rounded-lg p-6 shadow bg-white">
                                <h3 className="text-2xl font-semibold mb-4">주문 요약</h3>
                                <div className="flex flex-col gap-6">
                                    <CartSummary
                                        cartItems={selectedCartItems}/>
                                    <button
                                        className={`w-full py-3 font-semibold rounded-lg ${
                                            checkedItems.size > 0
                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        } transition-colors`}
                                        onClick={handleCheckout}
                                        disabled={checkedItems.size === 0}
                                    >
                                        {checkedItems.size > 0
                                            ? `${checkedItems.size}개 상품 주문하기`
                                            : "상품을 선택해주세요"}
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