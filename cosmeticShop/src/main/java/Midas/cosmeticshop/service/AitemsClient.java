package Midas.cosmeticshop.service;

import java.util.List;

/**
 * Naver Cloud Platform AiTEMS API Client 인터페이스
 * 배치 학습 기반 개인화 추천만 제공
 */
public interface AitemsClient {

    /**
     * 개인화 추천 조회 (로그인 유저 전용)
     * @param userId 사용자 ID (BaseUser.id를 String으로 변환한 값)
     * @param count 추천 결과 개수
     * @return 추천된 상품 ID 리스트 (ITEM_ID)
     */
    List<String> getPersonalizedRecommendations(String userId, int count);
}

