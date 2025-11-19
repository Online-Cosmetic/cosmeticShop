package Midas.cosmeticshop.dto.recommend;

import Midas.cosmeticshop.dto.product.ProductPreviewDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * AiTEMS 개인화 추천 응답 DTO
 * 추천 상품 리스트와 사용자 정보(추천 이유 표시용)를 포함
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalizedRecommendationResponse {
    /**
     * 추천 상품 리스트
     */
    private List<ProductPreviewDTO> products;
    
    /**
     * 사용자 나이 그룹 (예: "20s", "30s")
     */
    private String ageGroup;
    
    /**
     * 사용자 성별 (예: "M", "F", "UNKNOWN")
     */
    private String gender;
}

