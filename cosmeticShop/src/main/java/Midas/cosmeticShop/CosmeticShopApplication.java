package Midas.cosmeticShop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"Midas.cosmeticShop.entity"})
public class CosmeticShopApplication {

	public static void main(String[] args) {
		SpringApplication.run(CosmeticShopApplication.class, args);
	}

}
