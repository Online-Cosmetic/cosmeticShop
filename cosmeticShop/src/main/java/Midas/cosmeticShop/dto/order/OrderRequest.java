package Midas.cosmeticshop.dto.order;

import Midas.cosmeticshop.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OrderRequest {
    @Valid @NotNull
    private OrderItemDTO orderItemDTO;

    @Valid @NotNull
    private AddressDTO addressDTO;
}