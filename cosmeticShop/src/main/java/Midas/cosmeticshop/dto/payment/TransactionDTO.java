package Midas.cosmeticshop.dto.payment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class TransactionDTO {
    private Long id;
    private String impUid;
    private String merchantUid;
    private Integer amount;
    private String paymentMethod;
    private String status;
    private String buyerName;
    private String buyerEmail;
    private LocalDateTime createdAt;
    private Long orderId;
}