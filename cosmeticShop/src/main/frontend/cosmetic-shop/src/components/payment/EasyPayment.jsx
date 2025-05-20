// src/components/payment/EasyPayment.jsx
import React from 'react';

const EesyPayment = () => {
    const onClickPayment = () => {
        if (!window.IMP) return;
        const { IMP } = window;
        IMP.init('imp86215134'); // 본인 imp 키로 변경

        IMP.request_pay(
            {
                pg: 'kakaopay', // 카카오페이 간편결제(테스트)
                pay_method: 'card',
                merchant_uid: `mid_${new Date().getTime()}`,
                name: '테스트 간편결제',
                amount: 1000,
                buyer_email: 'test@naver.com',
                buyer_name: '홍길동',
                buyer_tel: '010-1234-5678',
                buyer_addr: '서울특별시 강남구 신사동',
                buyer_postcode: '01181',
            },
            function (rsp) {
                if (rsp.success) {
                    // 결제 성공 시 백엔드에 결제 정보 전달
                    fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            pay_method: 'easy_pay', // 구분값
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                alert('간편결제 및 검증 성공!');
                            } else {
                                alert('간편결제 검증 실패');
                            }
                        });
                } else {
                    alert('결제 실패: ' + rsp.error_msg);
                }
            }
        );
    };

    return <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg"
                   onClick={onClickPayment}>간편결제(토스 등)</button>;
};

export default EesyPayment;