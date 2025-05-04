package Midas.cosmeticShop.dto.Join;

import Midas.cosmeticShop.entity.GenderType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserJoinDTO {
    private String userId;
    private String password;
    private String username;       // 실제 이름
    private Integer age;           // 나이
    private GenderType gender;     // 성별
    private String nickName;       // 프로필 상 닉네임
    private String email;          // 메일주소
}
