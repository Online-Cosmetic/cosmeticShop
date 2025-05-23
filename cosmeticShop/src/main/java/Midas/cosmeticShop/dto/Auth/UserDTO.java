package Midas.cosmeticshop.dto.auth;

import Midas.cosmeticshop.dto.BaseUserDetails;
import lombok.*;

@Getter @Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class UserDTO {
    String userId;
    String role;
    public static UserDTO from(BaseUserDetails principal) {
        return new UserDTO(
            principal.getUsername(),
            principal.getAuthorities().toString()
        );
    }
}
