package Midas.cosmeticshop.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String userId;
    private String role; //role
    private String refreshToken;
    private String email;
    private String username;
}
