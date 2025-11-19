package Midas.cosmeticshop.dto.UserInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String nickname;
    private String email;
    private String username;
    private Integer age;
}

