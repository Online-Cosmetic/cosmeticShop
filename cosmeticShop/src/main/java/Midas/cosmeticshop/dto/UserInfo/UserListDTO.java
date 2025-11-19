package Midas.cosmeticshop.dto.UserInfo;

import Midas.cosmeticshop.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserListDTO {
    private Long id;
    private String userId;
    private String nickname;
    private String email;
    private String username;
    private LocalDateTime createdAt;

    public static UserListDTO from(User user) {
        return UserListDTO.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .nickname(user.getNickName())
                .email(user.getEmailAddress())
                .username(user.getUsername())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

