package Midas.cosmeticshop.exception;

public class TokenRefreshException extends RuntimeException {
    public TokenRefreshException(String token, String msg) {
        super(String.format("RefreshToken[%s] 오류: %s", token, msg));
    }
}
