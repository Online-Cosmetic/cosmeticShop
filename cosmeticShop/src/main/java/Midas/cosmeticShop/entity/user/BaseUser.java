package Midas.cosmeticshop.entity.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@SuperBuilder
@Entity
@Table(name = "base_user")
@NoArgsConstructor
@Getter @Setter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class BaseUser {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String password;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /* 인증을 구현하면서 추가 */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;  // ADMIN, COMPANY, USER

    // UserRole 타입의 role 을 유지하면서 role 타입의 이름만 String 으로 반환
    public String getRole() {
        return role != null ? role.name() : null;
    }

    // String 값으로 사용하던 role 을 UserRole 타입으로 저장
    public void setRole(String role) {
        this.role = UserRole.valueOf(role);
    }

}
