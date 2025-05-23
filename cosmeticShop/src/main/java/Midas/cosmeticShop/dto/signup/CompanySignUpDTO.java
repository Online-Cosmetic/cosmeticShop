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
}
