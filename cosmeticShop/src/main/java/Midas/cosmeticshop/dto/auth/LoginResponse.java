package Midas.cosmeticshop.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String userId;
    private String role;
    private String accessToken;
    private String errorMessage;

    public LoginResponse(String userId, String role, String accessToken) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
    }
}