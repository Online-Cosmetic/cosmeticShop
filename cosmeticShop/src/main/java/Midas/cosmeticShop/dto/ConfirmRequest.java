package Midas.cosmeticshop.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ConfirmRequest {
    private String imp_uid;
    private Long orderId;
}