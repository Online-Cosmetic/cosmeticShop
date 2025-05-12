package Midas.cosmeticshop.dto.auth;

import lombok.Data;

@Data
public class ReissueResponse {
    private String accessToken;
    public ReissueResponse(String accessToken) {
        this.accessToken = accessToken;
    }
}