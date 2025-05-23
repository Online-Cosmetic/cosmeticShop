package Midas.cosmeticshop.dto.payment;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentCreateRequest {
    private String impUid;           // 아임포트 결제 고유 ID
    private String merchantUid;       // 주문 번호
    private Long orderId;            // 주문 ID
    private Long amount;             // 결제 금액
    private String paymentMethod;    // 결제 방식 (CARD, BANK_TRANSFER, KAKAO_PAY)
    private String paymentStatus;    // 결제 상태
    private String buyerName;        // 구매자 이름
    private String buyerEmail;       // 구매자 이메일
} 