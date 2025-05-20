// src/components/payment/BankTransferPayment.jsx
import React from 'react';

const BankTransferPayment = () => {
    const onClickPayment = () => {
        if (!window.IMP) return;
        const { IMP } = window;
        IMP.init('imp86215134'); // 본인 imp 키로 변경

        IMP.request_pay(
            {
                pg: 'html5_inicis',
                pay_method: 'trans', // 실시간 계좌이체
                merchant_uid: `mid_${new Date().getTime()}`,
                name: '테스트 계좌이체',
                amount: 1000,
                buyer_email: 'test@naver.com',
                buyer_name: '홍길동',
                buyer_tel: '010-1234-5678',
                buyer_addr: '서울특별시 강남구 신사동',
                buyer_postcode: '01181',
            },
            function (rsp) {
                if (rsp.success) {
                    fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            imp_uid: rsp.imp_uid,
                            merchant_uid: rsp.merchant_uid,
                            pay_method: 'bank_transfer', // 구분값
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                alert('계좌이체 및 검증 성공!');
                            } else {
                                alert('계좌이체 검증 실패');
                            }
                        });
                } else {
                    alert('결제 실패: ' + rsp.error_msg);
                }
            }
        );
    };

    return <button className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg"
                   onClick={onClickPayment}>실시간 계좌이체</button>;
};

export default BankTransferPayment;