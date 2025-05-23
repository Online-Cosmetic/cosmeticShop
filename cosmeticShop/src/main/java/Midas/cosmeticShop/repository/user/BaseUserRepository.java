package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.BaseUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BaseUserRepository extends JpaRepository<BaseUser, Long> {
    Optional<BaseUser> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
