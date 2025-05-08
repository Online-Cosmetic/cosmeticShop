package Midas.cosmeticShop.service;

import Midas.cosmeticShop.dto.ProductDTO;
import Midas.cosmeticShop.entity.Product;
import Midas.cosmeticShop.entity.ProductImage;
import Midas.cosmeticShop.jwt.JWTUtil;
import Midas.cosmeticShop.repository.ProductRepository;
import Midas.cosmeticShop.repository.Users.CompanyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;
    private final JWTUtil jwtUtil;

    /* 상품 등록 :  상품정보 + 이미지들 */
    public void registerProduct(String accessToken, ProductDTO dto, MultipartFile mainImage, MultipartFile[] additionalImages) {

        // 토큰에서 사용자 아이디와 Role 을 추출
        String userId = jwtUtil.getUserId(accessToken);
        String role = jwtUtil.getRole(accessToken);

        System.out.println(role);

        if(!"COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 등록이 가능합니다.");
        }

        // dto 기반으로 엔티티 생성
        Product product = Product.from(dto, companyRepository.findByUserId(userId));

        // 메인 이미지 저장 후 URL 세팅
        if(mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = fileStorageService.storeFile(mainImage);
        }

        List<ProductImage> productImages = new ArrayList<>();
        if(additionalImages != null && additionalImages.length > 0) {
            for (MultipartFile image : additionalImages) {
                if(!image.isEmpty()) {
                    String imageUrl = fileStorageService.storeFile(image);
                    ProductImage productImage = new ProductImage();
                    productImage.setProduct(product);
                    productImage.setImageUrl(imageUrl);

                    productImages.add(productImage);
                }
            }
        }
        product.getProductImages().addAll(productImages);

        // 상품 저장 (Cascade 옵션을 이용하면 연관 이미지들도 함께 저장)
        productRepository.save(product);
    }

    /* 상품 정보 수정 : PUT 메소드로 진행 -> 기존 정보를 다시 채워 놓아야함 */
    public void modifyProduct(ProductDTO dto) {

    }

    /* 상품 삭제 */
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
