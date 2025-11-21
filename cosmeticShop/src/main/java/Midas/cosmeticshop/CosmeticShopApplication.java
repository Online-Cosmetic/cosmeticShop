package Midas.cosmeticshop;

import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.repository.user.AdminRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = {"Midas.cosmeticshop.entity"})
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class CosmeticShopApplication {

    public CosmeticShopApplication(AdminRepository admin, PasswordEncoder passwordEncoder, CompanyRepository company) {
        this.admin = admin;
        this.passwordEncoder = passwordEncoder;
		this.company = company;
    }

    public static void main(String[] args) {
		SpringApplication.run(CosmeticShopApplication.class, args);
	}

	private final AdminRepository admin;

	private final PasswordEncoder passwordEncoder;

	private final CompanyRepository company;

	@EventListener(ApplicationReadyEvent.class)
	public void seedAdmin() {
		String userId = "admin2";
		String rawPw = "admin2";

		if (!admin.existsByUserId(userId)) {
			Admin temp = new Admin();
			temp.setUserId(userId);
			temp.setPassword(passwordEncoder.encode(rawPw));
			temp.setCreatedAt(java.time.LocalDateTime.now());
			temp.setRole("ADMIN");
			admin.save(temp);
			System.out.println("Admin user created with ID: " + userId + " and Password: " + rawPw);
		}

		// String companyId = "company2";
		// String password = "company2";
		// if (!company.existsByUserId(companyId)) {
		// 	Company temp2 = new Company();
		// 	temp2.setUserId(companyId);
		// 	temp2.setPassword(passwordEncoder.encode(password));
		// 	temp2.setCreatedAt(java.time.LocalDateTime.now());
		// 	temp2.setRole("COMPANY");
		// 	temp2.setCompanyName("Default Company");
		// 	temp2.setEmailAddress("company2@example.com");
		// 	temp2.setPhoneNumber("02-1234-5678");
		// 	temp2.setBusinessRegistrationNumber("123-45-67890");
		// 	temp2.setRepresentativeName("대표자명");
		// 	temp2.setBusinessAddress("서울시 강남구");
		// 	temp2.setContactPersonName("담당자명");
		// 	temp2.setContactPhoneNumber("010-1234-5678");
		// 	temp2.setApproved(true);
		// 	company.save(temp2);
		// 	System.out.println("Company user created with ID: " + companyId + " and Password: " + password);
		// }
	}
}


