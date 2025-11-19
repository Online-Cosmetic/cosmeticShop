package Midas.cosmeticshop.repository.specification;

import Midas.cosmeticshop.entity.product.Product;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("active"));
    }

    public static Specification<Product> hasCategory(int categoryId) {
        return (root, query, cb) -> cb.equal(root.get("categoryId"), categoryId);
    }

    public static Specification<Product> belongsToCompany(Long companyId) {
        return (root, query, cb) -> cb.equal(root.get("company").get("id"), companyId);
    }

    public static Specification<Product> containsKeyword(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return null;
        }

        String pattern = "%" + keyword.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
            cb.like(cb.lower(cb.coalesce(root.get("productName"), "")), pattern),
            cb.like(cb.lower(cb.coalesce(root.get("description"), "")), pattern)
        );
    }
}

