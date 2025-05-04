package Midas.cosmeticShop.repository.Users;

import Midas.cosmeticShop.entity.Users.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCompanyName(String companyname);
    boolean existsByCompanyName(String companyName);
    Boolean existsByEmailAddress(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
}
