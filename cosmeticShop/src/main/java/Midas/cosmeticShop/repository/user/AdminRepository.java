package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Boolean existsByUserId(String userId);
    Optional<Admin> findByUserId(String userId);
}
