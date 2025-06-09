// src/components/CardPaymentForToss.js
import React from 'react';
import { userAPI } from '../../utils/customAxios';

const CardPaymentForToss = ({ orderId, amount, orderName, buyerInfo, onSuccess, onFail }) => {
    const onClickPayment = () => {
        if (!window.IMP) {
            alert('결제 모듈을 불러오는데 실패했습니다.');
            return;
        }

        // 필수 값 검증
        if (!orderId) {
            alert('주문 정보가 없습니다.');
            return;
        }

        if (!amount || amount <= 0) {
            alert('결제 금액이 올바르지 않습니다.');
            return;
        }

        if (!buyerInfo || !buyerInfo.name || !buyerInfo.email) {
            alert('구매자 정보가 부족합니다.');
            return;
        }

        const { IMP } = window;
        IMP.init('imp86215134');

        const paymentData = {
            pg: 'uplus',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: orderName || '상품 결제',
            amount: amount,
            buyer_email: buyerInfo.email,
            buyer_name: buyerInfo.name,
            buyer_addr: buyerInfo.addr || '',
            digital: false,
            app_scheme: 'cosmetic-shop',
            currency: 'KRW'
        };

        IMP.request_pay(
            paymentData,
            async function (rsp) {
                if (rsp.success) {
                    try {
                        // 결제 정보 생성
                        const paymentData = {
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            orderId: orderId,
                            amount: amount,
                            paymentMethod: 'CARD',
                            paymentStatus: 'PENDING',
                            buyerName: buyerInfo.name,
                            buyerEmail: buyerInfo.email
                        };

                        // 결제 요청 생성
                        const createResponse = await userAPI.payment.createPayment(paymentData);
                        
                        if (!createResponse.data || !createResponse.data.success) {
                            throw new Error('결제 정보 생성 실패');
                        }

                        // 카드 결제 처리
                        const response = await userAPI.payment.processCardPayment({
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            orderId: orderId,
                            amount: amount,
                            buyerName: buyerInfo.name,
                            buyerEmail: buyerInfo.email
                        });

                        if (response.data && response.data.success) {
                            // 결제 완료 처리
                            await userAPI.payment.completePayment(response.data.paymentId, {
                                status: 'COMPLETED'
                            });
                            
                            alert('결제가 완료되었습니다.');
                            if (onSuccess) onSuccess(response.data);
                        } else {
                            throw new Error(response.data?.message || '결제 처리 실패');
                        }
                    } catch (error) {
                        console.error('결제 처리 중 오류 발생:', error);
                        alert(`결제 처리 중 오류가 발생했습니다: ${error.message}`);
                        if (onFail) onFail(error);
                    }
                } else {
                    console.error('결제 실패:', rsp);
                    alert(`결제 실패: ${rsp.error_msg}`);
                    if (onFail) onFail(rsp);
                }
            }
        );
    };

    return (
        <button
            className="w-full py-2.5 bg-neutral-800 text-white font-bold rounded-lg transition-colors hover:bg-neutral-700"
            onClick={onClickPayment}
        >
            결제하기
        </button>
    );
};

export default CardPaymentForToss;