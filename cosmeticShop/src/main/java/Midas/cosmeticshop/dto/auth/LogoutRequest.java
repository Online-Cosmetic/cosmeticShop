package Midas.cosmeticshop.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/** POST /api/auth/logout 요청 본문 */
@Getter @Setter
public class LogoutRequest {
    @NotBlank   // null·빈문자열 금지
    private String refreshToken;
}
