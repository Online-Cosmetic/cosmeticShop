package Midas.cosmeticshop.dto.signup;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CompanySignUpDTO {
    private String userId;
    private String password;
    private String email;          // 메일 주소
    private String companyName;    // 회사 이름
    private String phoneNumber;    // 전화번호
    
    // 추가 필드
    private String businessRegistrationNumber;  // 사업자등록번호
    private String representativeName;          // 대표자명
    private String businessType;                // 업종/업태
    private String businessAddress;             // 사업장 주소
    private String contactPersonName;           // 담당자명
    private String contactPhoneNumber;          // 담당자 휴대폰 번호
    private String businessLicensePath;         // 사업자등록증 파일 경로
}
