package Midas.cosmeticShop.dto.Product;

import Midas.cosmeticShop.entity.ProductImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class ProductImageDTO { // 모든 상품 이미지가 담길 DTO
    private List<ProductImageItemDTO> images;

    public static ProductImageDTO fromEntityList(List<ProductImage> productImages) {
        List<ProductImageItemDTO> imageItems = productImages.stream()
            .map(image -> new ProductImageItemDTO(image.getId(), image.getImageUrl()))
            .toList();
        return new ProductImageDTO(imageItems);
    }
}
