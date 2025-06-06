package Midas.cosmeticshop.dto.order;

import Midas.cosmeticshop.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class OrderBatchRequest {
    @Valid @NotEmpty
    private List<OrderItemDTO> orderItemDTOList;

    @Valid @NotNull
    private AddressDTO addressDTO;

    @Valid @NotNull
    int totalPrice;
}