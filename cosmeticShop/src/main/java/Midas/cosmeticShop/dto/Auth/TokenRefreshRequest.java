package Midas.cosmeticshop.dto.auth;

import lombok.Data;

@Data
public class TokenRefreshRequest {
    private String refreshToken;
}
