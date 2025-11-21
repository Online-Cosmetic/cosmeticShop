package Midas.cosmeticshop.util;

/**
 * AiTEMS용 카테고리 매핑 유틸리티
 * categoryId (int) → CATEGORY (String) 변환
 */
public class CategoryMapper {

    /**
     * categoryId를 AiTEMS CATEGORY 형식으로 변환
     * @param categoryId 카테고리 ID (1: 메이크업, 2: 스킨케어, 3: 헤어, 4: 바디)
     * @return CATEGORY 문자열 (MAKEUP, SKINCARE, HAIR, BODY)
     */
    public static String toCategory(int categoryId) {
        return switch (categoryId) {
            case 1 -> "MAKEUP";
            case 2 -> "SKINCARE";
            case 3 -> "HAIR";
            case 4 -> "BODY";
            default -> "UNKNOWN";
        };
    }

    /**
     * CATEGORY 문자열을 categoryId로 역변환
     * @param category CATEGORY 문자열
     * @return categoryId (없는 경우 -1)
     */
    public static int toCategoryId(String category) {
        return switch (category.toUpperCase()) {
            case "MAKEUP" -> 1;
            case "SKINCARE" -> 2;
            case "HAIR" -> 3;
            case "BODY" -> 4;
            default -> -1;
        };
    }
}

