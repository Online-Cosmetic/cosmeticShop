package Midas.cosmeticShop.repository;

import Midas.cosmeticShop.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
