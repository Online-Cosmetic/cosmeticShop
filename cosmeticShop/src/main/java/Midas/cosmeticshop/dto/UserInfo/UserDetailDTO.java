package Midas.cosmeticshop.dto.UserInfo;

import Midas.cosmeticshop.entity.GenderType;
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
public class UserDetailDTO {
    private Long id;
    private String userId;
    private String nickname;
    private String email;
    private String username;
    private Integer age;
    private GenderType gender;
    private String provider;
    private LocalDateTime createdAt;

    public static UserDetailDTO from(User user) {
        return UserDetailDTO.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .nickname(user.getNickName())
                .email(user.getEmailAddress())
                .username(user.getUsername())
                .age(user.getAge())
                .gender(user.getGenderType())
                .provider(user.getProvider())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

