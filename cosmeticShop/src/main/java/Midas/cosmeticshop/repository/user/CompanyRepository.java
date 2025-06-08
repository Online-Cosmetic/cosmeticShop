package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByUserId(String userId);
    boolean existsByCompanyName(String companyName);
    Boolean existsByEmailAddress(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
    Optional<Company> findByCompanyName (String companyName);
}
