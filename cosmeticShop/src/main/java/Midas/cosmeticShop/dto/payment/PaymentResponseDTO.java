package Midas.cosmeticshop.dto.payment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Builder
public class PaymentResponseDTO {
    private Long paymentId;
    private Long orderId;
    private Integer amount;
    private String paymentMethod;
    private String status;
    private String buyerName;
    private String buyerEmail;
} 