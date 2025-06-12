package Midas.cosmeticshop.dto.product;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProductDescriptionDTO {
    private String description;

    public ProductDescriptionDTO(String description) {
        this.description = description;
    }
}
