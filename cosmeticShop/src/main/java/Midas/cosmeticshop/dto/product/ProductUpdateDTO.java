package Midas.cosmeticshop.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ProductUpdateDTO {
    private String productName;
    private int categoryId;
    private String description;
    private int price;
    private int discountRate;
    private int stock;

    /** 클라이언트가 보존할 기존 이미지의 ID 목록 */
    private List<Long> existingImageIds;
}