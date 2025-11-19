package Midas.cosmeticshop.dto.aitems;

import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.OrderItem;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.product.ProductLike;
import Midas.cosmeticshop.util.TimeConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AiTEMS용 Interaction Dataset DTO
 * CSV 헤더: USER_ID,ITEM_ID,TIMESTAMP,EVENT_TYPE,EVENT_VALUE
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AitemsInteractionDTO implements Comparable<AitemsInteractionDTO> {

    private String userId;          // USER_ID
    private String itemId;          // ITEM_ID
    private Long timestamp;          // TIMESTAMP (epoch milliseconds)
    private String eventType;       // EVENT_TYPE (CART_ADD, PURCHASE, REVIEW, LIKE)
    private Integer eventValue;     // EVENT_VALUE (수량, 평점 등, null 가능)

    /**
     * Cart 엔티티를 AitemsInteractionDTO로 변환
     * @param cart Cart 엔티티
     * @return AitemsInteractionDTO
     */
    public static AitemsInteractionDTO fromCart(Cart cart) {
        if (cart == null || cart.getUser() == null || cart.getProduct() == null) {
            return null;
        }

        // Cart에는 createdAt이 없으므로 현재 시간 사용 (또는 별도 필드 필요)
        // 실제로는 Cart에 createdAt 필드가 있어야 하지만, 일단 현재 시간 사용
        return AitemsInteractionDTO.builder()
            .userId(String.valueOf(cart.getUser().getId()))
            .itemId(String.valueOf(cart.getProduct().getId()))
            .timestamp(System.currentTimeMillis()) // Cart에 createdAt이 없으면 현재 시간
            .eventType("CART_ADD")
            .eventValue(cart.getQuantity())
            .build();
    }

    /**
     * OrderItem 엔티티를 AitemsInteractionDTO로 변환
     * @param orderItem OrderItem 엔티티
     * @param order Order 엔티티 (createdAt을 가져오기 위해)
     * @return AitemsInteractionDTO
     */
    public static AitemsInteractionDTO fromOrderItem(OrderItem orderItem, Order order) {
        if (orderItem == null || orderItem.getProduct() == null || order == null) {
            return null;
        }

        return AitemsInteractionDTO.builder()
            .userId(String.valueOf(order.getUser().getId()))
            .itemId(String.valueOf(orderItem.getProduct().getId()))
            .timestamp(TimeConverter.toEpochMilliseconds(order.getCreatedAt()))
            .eventType("PURCHASE")
            .eventValue(orderItem.getQuantity())
            .build();
    }

    /**
     * Review 엔티티를 AitemsInteractionDTO로 변환
     * @param review Review 엔티티
     * @return AitemsInteractionDTO
     */
    public static AitemsInteractionDTO fromReview(Review review) {
        if (review == null || review.getUser() == null || review.getProduct() == null) {
            return null;
        }

        return AitemsInteractionDTO.builder()
            .userId(String.valueOf(review.getUser().getId()))
            .itemId(String.valueOf(review.getProduct().getId()))
            .timestamp(TimeConverter.toEpochMilliseconds(review.getCreatedAt()))
            .eventType("REVIEW")
            .eventValue(review.getRating())
            .build();
    }

    /**
     * ProductLike 엔티티를 AitemsInteractionDTO로 변환
     * @param productLike ProductLike 엔티티
     * @return AitemsInteractionDTO
     */
    public static AitemsInteractionDTO fromProductLike(ProductLike productLike) {
        if (productLike == null || productLike.getUser() == null || productLike.getProduct() == null) {
            return null;
        }

        return AitemsInteractionDTO.builder()
            .userId(String.valueOf(productLike.getUser().getId()))
            .itemId(String.valueOf(productLike.getProduct().getId()))
            .timestamp(productLike.getCreatedAt() != null 
                ? TimeConverter.toEpochMilliseconds(productLike.getCreatedAt())
                : System.currentTimeMillis())
            .eventType("LIKE")
            .eventValue(null)  // LIKE는 EVENT_VALUE가 null
            .build();
    }

    /**
     * CSV 행으로 변환
     * @return CSV 형식의 문자열
     */
    public String toCsvRow() {
        String eventValueStr = eventValue != null ? String.valueOf(eventValue) : "";
        return String.format("%s,%s,%d,%s,%s",
            escapeCsv(userId),
            escapeCsv(itemId),
            timestamp != null ? timestamp : 0L,
            escapeCsv(eventType),
            escapeCsv(eventValueStr)
        );
    }

    /**
     * CSV 헤더 반환
     * @return CSV 헤더 문자열
     */
    public static String getCsvHeader() {
        return "USER_ID,ITEM_ID,TIMESTAMP,EVENT_TYPE,EVENT_VALUE";
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

    /**
     * TIMESTAMP 기준 정렬을 위한 compareTo 구현
     */
    @Override
    public int compareTo(AitemsInteractionDTO other) {
        if (this.timestamp == null && other.timestamp == null) {
            return 0;
        }
        if (this.timestamp == null) {
            return -1;
        }
        if (other.timestamp == null) {
            return 1;
        }
        return Long.compare(this.timestamp, other.timestamp);
    }
}

