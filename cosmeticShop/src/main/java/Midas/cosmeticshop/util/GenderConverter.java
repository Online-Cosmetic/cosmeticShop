package Midas.cosmeticshop.util;

import Midas.cosmeticshop.entity.GenderType;

/**
 * AiTEMS용 성별 변환 유틸리티
 * GenderType enum → GENDER (String) 변환
 */
public class GenderConverter {

    /**
     * GenderType을 AiTEMS GENDER 형식으로 변환
     * @param genderType GenderType enum
     * @return GENDER 문자열 (M, F, UNKNOWN)
     */
    public static String toGender(GenderType genderType) {
        if (genderType == null) {
            return "UNKNOWN";
        }
        
        return switch (genderType) {
            case MALE -> "M";
            case FEMALE -> "F";
            case NONE -> "UNKNOWN";
        };
    }

    /**
     * GENDER 문자열을 GenderType으로 역변환
     * @param gender GENDER 문자열
     * @return GenderType (없는 경우 NONE)
     */
    public static GenderType toGenderType(String gender) {
        if (gender == null) {
            return GenderType.NONE;
        }
        
        return switch (gender.toUpperCase()) {
            case "M", "MALE" -> GenderType.MALE;
            case "F", "FEMALE" -> GenderType.FEMALE;
            default -> GenderType.NONE;
        };
    }
}

