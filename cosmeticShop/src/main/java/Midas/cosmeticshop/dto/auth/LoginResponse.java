package Midas.cosmeticshop.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String userId;
    private String role;
    private String accessToken;
    private String errorMessage;
    private String email;
    private String username;

    // ADMIN
    public LoginResponse(String userId, String role, String accessToken) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
        this.email = null;
        this.username = null;
    }

    // USER, COMPANY
    public LoginResponse(String userId, String role, String accessToken, String email, String username) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
        this.email = email;
        this.username = username;
    }

    // ERROR
    public LoginResponse(String errorMessage) {
        this.userId = null;
        this.role = null;
        this.accessToken = null;
        this.errorMessage = errorMessage;
        this.email = null;
        this.username = null;
    }
}