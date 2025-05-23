package Midas.cosmeticshop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ProductDetailResponseDTO {
    ProductDTO productDTO;
    ProductImageDTO productImageDTO;

    public static ProductDetailResponseDTO from(
        ProductDTO productDTO, ProductImageDTO productImageDTO) {
        return new ProductDetailResponseDTO(productDTO, productImageDTO);
    }
}
