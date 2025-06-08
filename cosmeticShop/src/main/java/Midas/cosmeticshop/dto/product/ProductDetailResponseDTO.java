package Midas.cosmeticshop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProductDetailResponseDTO {
    ProductDTO productDTO;
    ProductImageDTO productImageDTO;
}
