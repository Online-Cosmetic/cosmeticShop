package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Boolean existsByUserId(String userId);
    Boolean existsByNickName(String nickName);
    Boolean existsByEmailAddress(String email);
    Optional<User> findByUserId(String userId);
    boolean existsByUserIdAndEmailAddress(String userId, String email);


}
