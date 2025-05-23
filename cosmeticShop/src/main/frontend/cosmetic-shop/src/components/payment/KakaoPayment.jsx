// src/components/KakaoPayment.js
import React from 'react';
import { userAPI } from '../../utils/customAxios';

const KakaoPayment = ({ orderId, amount, orderName, buyerInfo, onSuccess, onFail }) => {
    const onClickPayment = () => {
        if (!window.IMP) return;
        const { IMP } = window;
        IMP.init('imp86215134');

        IMP.request_pay(
            {
                pg: 'kakaopay',
                pay_method: 'card',
                merchant_uid: `mid_${new Date().getTime()}`,
                name: orderName || '상품 결제',
                amount: amount,
                buyer_email: buyerInfo?.email,
                buyer_name: buyerInfo?.name,
                buyer_tel: buyerInfo?.tel,
                buyer_addr: buyerInfo?.addr,
                buyer_postcode: buyerInfo?.postcode,
            },
            async function (rsp) {
                if (rsp.success) {
                    try {
                        // 결제 정보 생성
                        const paymentData = {
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            orderId: orderId,
                            amount: amount,
                            paymentMethod: 'KAKAO_PAY',
                            paymentStatus: 'PENDING'
                        };

                        // 결제 요청 생성
                        await userAPI.payment.createPayment(paymentData);
                        
                        // 카카오페이 결제 처리
                        const response = await userAPI.payment.processKakaoPay({
                            impUid: rsp.imp_uid,
                            merchantUid: rsp.merchant_uid,
                            orderId: orderId
                        });

                        if (response.data.success) {
                            // 결제 완료 처리
                            await userAPI.payment.completePayment(response.data.paymentId, {
                                status: 'COMPLETED',
                                paymentDetails: rsp
                            });
                            
                            alert('카카오페이 결제가 완료되었습니다.');
                            if (onSuccess) onSuccess(response.data);
                        } else {
                            throw new Error('카카오페이 결제 처리 실패');
                        }
                    } catch (error) {
                        console.error('카카오페이 결제 처리 중 오류 발생:', error);
                        alert('카카오페이 결제 처리 중 오류가 발생했습니다.');
                        if (onFail) onFail(error);
                    }
                } else {
                    alert('카카오페이 결제 실패: ' + rsp.error_msg);
                    if (onFail) onFail(rsp);
                }
            }
        );
    };

    return (
        <button 
            className="w-full py-3 bg-yellow-400 text-black font-semibold rounded-lg"
            onClick={onClickPayment}
        >
            카카오페이 결제
        </button>
    );
};

export default KakaoPayment;