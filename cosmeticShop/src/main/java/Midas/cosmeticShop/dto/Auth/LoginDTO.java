package Midas.cosmeticshop.dto.auth;

import lombok.*;

@Data
@NoArgsConstructor
public class LoginDTO {
    private String userId;
    private String password;
    private String role;
}
