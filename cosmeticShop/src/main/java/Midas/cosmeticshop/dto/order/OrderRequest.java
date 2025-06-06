package Midas.cosmeticshop.dto.order;

import Midas.cosmeticshop.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class OrderRequest {
    @Valid @NotEmpty
    private List<OrderItemDTO> orderItemDTO;

    @Valid @NotNull
    private AddressDTO addressDTO;

    @Valid @NotNull
    private int totalPrice;

    @Override
    public String toString() {
        return "OrderRequest{" +
                "orderItemDTO=" + orderItemDTO.toString() +
                ", addressDTO=" + addressDTO.toString() +
                ", totalPrice=" + totalPrice +
                '}';
    }
}