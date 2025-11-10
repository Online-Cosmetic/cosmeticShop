package Midas.cosmeticshop.repository.user;

import Midas.cosmeticshop.entity.user.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Company findByUserId(String userId);
    boolean existsByCompanyName(String companyName);
    Boolean existsByEmailAddress(String email);
    Boolean existsByPhoneNumber(String phoneNumber);
    Optional<Company> findByCompanyName (String companyName);

    @Query("SELECT c.companyName FROM Company c")
    List<String> findAllCompanyNames();

    @Query("SELECT c FROM Company c")
    List<Company> findAllCompanies();

    boolean existsByUserId(String companyId);
}
