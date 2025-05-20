// src/components/CardPaymentForToss.js
import React from 'react';

const CardPaymentForToss = () => {
    const onClickPayment = () => {
        if (!window.IMP) return;
        const { IMP } = window;
        IMP.init('imp86215134'); // 아임포트 관리자에서 발급받은 '가맹점 식별코드' 입력

        IMP.request_pay(
            {
                pg: `uplus`, // 이거 됐다가 안됐다가 하는데 좀 위험하다잉? 뺄 생각도 해야할듯
                pay_method: 'card',
                merchant_uid: `mid_${new Date().getTime()}`,
                name: '테스트 결제',
                amount: 1000,
                buyer_email: 'test@naver.com',
                buyer_name: '홍길동',
                buyer_tel: '010-1234-5678',
                buyer_addr: '서울특별시 강남구 신사동',
                buyer_postcode: '01181',
            },
            function (rsp) {
                // 결제 후 콜백
                if (rsp.success) {
                    // 결제 성공 시, 백엔드에 결제 검증 요청
                    fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(
                            {
                                imp_uid: rsp.imp_uid,
                                merchant_uid: rsp.merchant_uid
                            }
                        ),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                alert('결제 및 검증 성공!');
                            } else {
                                alert('결제 검증 실패');
                            }
                        });
                } else {
                    alert('결제 실패: ' + rsp.error_msg);
                }
            }
        );
    };

    return <button className="w-full py-3 bg-neutral-800 text-white font-semibold rounded-lg"
                   onClick={onClickPayment}>결제하기</button>;
};

export default CardPaymentForToss;