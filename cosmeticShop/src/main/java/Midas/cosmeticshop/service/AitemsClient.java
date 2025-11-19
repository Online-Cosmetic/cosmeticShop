package Midas.cosmeticshop.service;

import java.util.List;

/**
 * Naver Cloud Platform AiTEMS API Client 인터페이스
 */
public interface AitemsClient {

    /**
     * 개인화 추천 조회
     * @param userId 사용자 ID
     * @param count 추천 결과 개수
     * @return 추천된 상품 ID 리스트 (ITEM_ID)
     */
    List<String> getPersonalizedRecommendations(String userId, int count);

    /**
     * 연관 상품 추천 조회
     * @param itemId 상품 ID
     * @param count 추천 결과 개수
     * @return 추천된 상품 ID 리스트 (ITEM_ID)
     */
    List<String> getRelatedItems(String itemId, int count);

    /**
     * 인기 상품 추천 조회
     * @param count 추천 결과 개수
     * @return 추천된 상품 ID 리스트 (ITEM_ID)
     */
    List<String> getPopularItems(int count);
}

