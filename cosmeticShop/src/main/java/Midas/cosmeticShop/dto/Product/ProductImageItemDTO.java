package Midas.cosmeticShop.dto.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageItemDTO { //이미지 '하나'의 정보를 전달할 DTO
    private Long id;
    private String imageUrl;
}
