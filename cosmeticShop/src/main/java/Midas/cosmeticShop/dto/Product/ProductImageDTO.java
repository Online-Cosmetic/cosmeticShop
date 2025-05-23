package Midas.cosmeticshop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class ProductImageDTO { // 모든 상품 이미지가 담길 DTO
    private List<ProductImageItemDTO> images;
}
