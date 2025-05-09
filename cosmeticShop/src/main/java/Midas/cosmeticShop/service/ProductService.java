package Midas.cosmeticShop.service;

import Midas.cosmeticShop.dto.Product.ProductDTO;
import Midas.cosmeticShop.dto.Product.ProductImageDTO;
import Midas.cosmeticShop.entity.Product;
import Midas.cosmeticShop.entity.ProductImage;
import Midas.cosmeticShop.jwt.JWTUtil;
import Midas.cosmeticShop.repository.ProductRepository;
import Midas.cosmeticShop.repository.Users.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
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

    /* 상품 정보 조회 */
    public ProductDTO getProductInfo(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        ProductDTO dto = ProductDTO.from(product);
        return dto;
    }

    /* 상품 사진을 리스트로 담은 DTO 반환 */
    public ProductImageDTO getProductImages(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        ProductImageDTO dto = ProductImageDTO.fromEntityList(product.getProductImages());
        return dto;
    }


//    /**
//     * 상품 정보+이미지 수정
//     * @param deleteImageIds 제거할 이미지의 PK 리스트
//     */
//    public void modifyProduct(
//        String accessToken,
//        Long productId,
//        ProductDTO dto,
//        MultipartFile mainImage,
//        MultipartFile[] additionalImages,
//        List<Long> deleteImageIds
//    ) {
//        // 1) 권한 확인
//        String userId = jwtUtil.getUserId(accessToken);
//        String role = jwtUtil.getRole(accessToken);
//        if (!"COMPANY".equals(role)) {
//            throw new IllegalArgumentException("기업 회원만 상품 수정이 가능합니다.");
//        }
//
//        // 2) 엔티티 조회 및 소유주 확인
//        Product product = productRepository.findById(productId)
//            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));
//        if (!product.getCompany().getUserId().equals(userId)) {
//            throw new IllegalArgumentException("자신의 상품만 수정할 수 있습니다.");
//        }
//
//        // 3) 텍스트 필드 업데이트
//        product.modifyFields(dto);
//
//        // 4) 기존 이미지 삭제 처리
//        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
//            Iterator<ProductImage> it = product.getProductImages().iterator();
//            while (it.hasNext()) {
//                ProductImage img = it.next();
//                if (deleteImageIds.contains(img.getId())) {
//                    fileStorageService.deleteFile(img.getImageUrl());
//                    it.remove();
//                }
//            }
//        }
//
//        // 5) 메인 이미지 교체 (업로드 되었다면)
//        if (mainImage != null && !mainImage.isEmpty()) {
//            String newUrl = fileStorageService.storeFile(mainImage);
//            ProductImage img = new ProductImage();
//            img.setProduct(product);
//            img.setImageUrl(newUrl);
//            // 가장 앞에 추가하거나 로직에 따라 처리
//            product.getProductImages().add(0, img);
//        }
//
//        // 6) 추가 이미지 업로드
//        if (additionalImages != null) {
//            for (MultipartFile f : additionalImages) {
//                if (!f.isEmpty()) {
//                    String url = fileStorageService.storeFile(f);
//                    ProductImage img = new ProductImage();
//                    img.setProduct(product);
//                    img.setImageUrl(url);
//                    product.getProductImages().add(img);
//                }
//            }
//        }
//
//        // 7) 최종 저장 (Cascade.ALL 로 이미지까지 저장/삭제 반영)
//        productRepository.save(product);
//    }

    /* 상품 삭제 */
    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }
}
