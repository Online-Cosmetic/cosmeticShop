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
    private Boolean approved;  // 기업 회원 승인 상태
    private String nickname;

    // ADMIN
    public LoginResponse(String userId, String role, String accessToken) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
        this.email = null;
        this.username = null;
        this.approved = null;
    }

    // USER
    public LoginResponse(String userId, String role, String accessToken, String email, String username, String nickname) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
        this.email = email;
        this.username = username;
        this.approved = null;
        this.nickname = nickname;
    }

    // COMPANY
    public LoginResponse(String userId, String role, String accessToken, String email, String username, Boolean approved) {
        this.userId = userId;
        this.role = role;
        this.accessToken = accessToken;
        this.errorMessage = null;
        this.email = email;
        this.username = username;
        this.approved = approved;
        this.nickname = null;
    }

    // ERROR
    public LoginResponse(String errorMessage) {
        this.userId = null;
        this.role = null;
        this.accessToken = null;
        this.errorMessage = errorMessage;
        this.email = null;
        this.username = null;
        this.approved = null;
    }
}