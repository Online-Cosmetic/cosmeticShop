package Midas.cosmeticshop.dto.aitems;

import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.util.CategoryMapper;
import Midas.cosmeticshop.util.TimeConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AiTEMS용 Item Dataset DTO
 * CSV 헤더: ITEM_ID,CATEGORY,CREATION_TIMESTAMP,BRAND,PRICE,DISCOUNT_RATE
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AitemsItemDTO {

    private String itemId;              // ITEM_ID
    private String category;             // CATEGORY (MAKEUP, SKINCARE, HAIR, BODY)
    private Long creationTimestamp;     // CREATION_TIMESTAMP (epoch milliseconds)
    private String brand;                // BRAND (company name)
    private Integer price;               // PRICE
    private Integer discountRate;        // DISCOUNT_RATE

    /**
     * Product 엔티티를 AitemsItemDTO로 변환
     * @param product Product 엔티티
     * @return AitemsItemDTO
     */
    public static AitemsItemDTO from(Product product) {
        if (product == null) {
            return null;
        }

        return AitemsItemDTO.builder()
            .itemId(String.valueOf(product.getId()))
            .category(CategoryMapper.toCategory(product.getCategoryId()))
            .creationTimestamp(TimeConverter.toEpochMilliseconds(product.getCreatedAt()))
            .brand(product.getCompany() != null ? product.getCompany().getCompanyName() : "UNKNOWN")
            .price(product.getPrice())
            .discountRate(product.getDiscountRate())
            .build();
    }

    /**
     * CSV 행으로 변환
     * @return CSV 형식의 문자열
     */
    public String toCsvRow() {
        return String.format("%s,%s,%d,%s,%d,%d",
            escapeCsv(itemId),
            escapeCsv(category),
            creationTimestamp != null ? creationTimestamp : 0L,
            escapeCsv(brand),
            price != null ? price : 0,
            discountRate != null ? discountRate : 0
        );
    }

    /**
     * CSV 헤더 반환
     * @return CSV 헤더 문자열
     */
    public static String getCsvHeader() {
        return "ITEM_ID,CATEGORY,CREATION_TIMESTAMP,BRAND,PRICE,DISCOUNT_RATE";
    }

    /**
     * CSV 특수문자 이스케이프 처리
     */
    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        // 쉼표나 따옴표가 있으면 따옴표로 감싸고 내부 따옴표는 두 개로
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}

