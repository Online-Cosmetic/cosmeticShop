package Midas.cosmeticshop.dto.aitems;

import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.util.AgeGroupConverter;
import Midas.cosmeticshop.util.GenderConverter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * AiTEMS용 User Dataset DTO
 * CSV 헤더: USER_ID,GENDER,AGE_GROUP
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AitemsUserDTO {

    private String userId;      // USER_ID
    private String gender;      // GENDER (M, F, UNKNOWN)
    private String ageGroup;    // AGE_GROUP (10s, 20s, 30s, 40s, 50s)

    /**
     * User 엔티티를 AitemsUserDTO로 변환
     * @param user User 엔티티
     * @return AitemsUserDTO
     */
    public static AitemsUserDTO from(User user) {
        if (user == null) {
            return null;
        }

        return AitemsUserDTO.builder()
            .userId(String.valueOf(user.getId()))  // BaseUser.id를 String으로 변환
            .gender(GenderConverter.toGender(user.getGenderType()))
            .ageGroup(AgeGroupConverter.toAgeGroup(user.getAge()))
            .build();
    }

    /**
     * CSV 행으로 변환
     * @return CSV 형식의 문자열 (USER_ID,GENDER,AGE_GROUP)
     */
    public String toCsvRow() {
        return String.format("%s,%s,%s",
            escapeCsv(userId),
            escapeCsv(gender),
            escapeCsv(ageGroup)
        );
    }

    /**
     * CSV 헤더 반환
     * @return CSV 헤더 문자열
     */
    public static String getCsvHeader() {
        return "USER_ID,GENDER,AGE_GROUP";
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

