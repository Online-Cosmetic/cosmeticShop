package Midas.cosmeticShop.entity.Users;

import Midas.cosmeticShop.dto.Join.UserJoinDTO;
import Midas.cosmeticShop.entity.*;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@SuperBuilder
@Entity @Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseUser {

    public static User from(UserJoinDTO dto, BCryptPasswordEncoder enc) {
        return User.builder()
            .userId(dto.getUserId())
            .password(enc.encode(dto.getPassword()))
            .username(dto.getUsername())
            .age(dto.getAge())
            .genderType(dto.getGender())
            .nickName(dto.getNickName())
            .emailAddress(dto.getEmail())
            .role(UserRole.USER)
            .createdAt(LocalDateTime.now())
            .build();
    }

    /* 사용자의 실제 이름 */
    @Column(nullable = false)
    private String username;

    /* 사용자의 나이 */
    @Column(nullable = false)
    private int age;

    /* 사용자의 성별 */
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private GenderType genderType;

    /* 사용자의 프로필상 닉네임 */
    @Column(name = "nickname", unique = true, nullable = false)
    private String nickName;

    /* 사용자의 이메일 주소 */
    @Column(name = "email", unique = true)
    private String emailAddress;

    /* 소셜로그인 플랫폼 */
    @Column
    private String provider;

    /* 소셜로그인을 위한 Id */
    @Column
    private String providerId;

    /* 사용자의 주소지(배송지) 목록 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses;

    /* 사용자가 장바구니에 담은 상품들 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cart> carts;

    /* 사용자의 주문들 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;

    /* 사용자가 작성한 리뷰들 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    /* 사용자가 남긴 질문정보들 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Qna> questions;


    /* 사용자가 가진 쿠폰 목록 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CouponMapping> coupons;

}