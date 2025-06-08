package Midas.cosmeticshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.scheduling.annotation.EnableScheduling;
import static org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO;

@SpringBootApplication
@EnableScheduling
@EntityScan(basePackages = {"Midas.cosmeticShop.entity"})
@EnableSpringDataWebSupport(pageSerializationMode = VIA_DTO)
public class CosmeticShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(CosmeticShopApplication.class, args);
	}

}
