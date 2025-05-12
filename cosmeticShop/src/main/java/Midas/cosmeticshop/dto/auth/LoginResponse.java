package Midas.cosmeticshop.dto.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String userId;
    private String role;
    private String accessToken;
    public LoginResponse(String userId, String role, String accessToken) {
        this.userId      = userId;
        this.role        = role;
        this.accessToken = accessToken;
    }
}