package Midas.cosmeticshop.dto.payment;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PaymentCompleteRequest {
    private String status;                  // 결제 상태
} 