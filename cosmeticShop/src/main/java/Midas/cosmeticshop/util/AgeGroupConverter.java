package Midas.cosmeticshop.util;

/**
 * AiTEMS용 나이 그룹 변환 유틸리티
 * age (int) → AGE_GROUP (String) 변환
 */
public class AgeGroupConverter {

    /**
     * 나이를 AiTEMS AGE_GROUP 형식으로 변환
     * @param age 나이
     * @return AGE_GROUP 문자열 (10s, 20s, 30s, 40s, 50s)
     */
    public static String toAgeGroup(int age) {
        if (age < 10) {
            return "10s";
        } else if (age < 20) {
            return "10s";
        } else if (age < 30) {
            return "20s";
        } else if (age < 40) {
            return "30s";
        } else if (age < 50) {
            return "40s";
        } else {
            return "50s";
        }
    }
}

