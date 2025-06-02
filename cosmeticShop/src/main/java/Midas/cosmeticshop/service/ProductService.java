package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.product.*;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.product.ProductImage;
import Midas.cosmeticshop.entity.product.ThumbnailImage;
import Midas.cosmeticshop.jwt.JWTUtil;
import Midas.cosmeticshop.repository.ProductImageRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.ThumbnailImageRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ThumbnailImageRepository thumnailImageRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final CompanyRepository companyRepository;
    private final FileStorageService fileStorageService;
    private final JWTUtil jwtUtil;

    /* 상품 등록 :  상품정보 + 이미지들 */
    public void registerProduct(
            BaseUserDetails userDetails,
            ProductDTO dto,
            MultipartFile mainImage,
            MultipartFile[] additionalImages) {

        // 토큰에서 사용자 아이디와 Role 을 추출
        String userId = userDetails.getUsername();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        if (!"ROLE_COMPANY".equals(role)) {
            throw new IllegalArgumentException("권한이 없습니다. 기업 회원만 상품 등록이 가능합니다.");
        }

        // dto 기반으로 엔티티 생성
        Product product = Product.from(dto, companyRepository.findByUserId(userId));


        // 메인 이미지 저장 후 URL 세팅
        ThumbnailImage thumbnailImage;
        if (mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = fileStorageService.storeFile(mainImage);
            thumbnailImage = ThumbnailImage.create(new ProductImageItemDTO(product.getId(), mainImageUrl));
            product.setThumbnailImage(thumbnailImage);
        }

        List<ProductImage> productImages = new ArrayList<>();
        if (additionalImages != null) {
            for (MultipartFile image : additionalImages) {
                if (!image.isEmpty()) {
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
        thumnailImageRepository.save(Objects.requireNonNull(product.getThumbnailImage()));
        productImageRepository.saveAll(Objects.requireNonNull(product.getProductImages()));
    }

    /* 상품 정보 조회 */
    @Transactional(readOnly = true)
    public ProductDTO getProductInfo(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));
        return ProductDTO.from(product);
    }

    /* 이미지 URL DTO 반환 */
    public ProductImageDTO getProductImages(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        List<ProductImageItemDTO> imageItems = new ArrayList<>();
        for (ProductImage productImage : product.getProductImages()) {
            imageItems.add(new ProductImageItemDTO(productId, productImage.getImageUrl()));
        }
        return new ProductImageDTO(imageItems);
    }

    /* 상품 정보 수정 */
    @Transactional // dirty checking
    public void replaceProduct(String accessToken, Long productId,
                               ProductUpdateDTO dto, MultipartFile[] newImages) {
        // 1. 권한 검증 (COMPANY)
        String role = jwtUtil.getRole(accessToken);
        if (!"ROLE_COMPANY".equals(role)) throw new IllegalArgumentException("권한이 없습니다.");

        // 2. 엔티티 조회
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));

        // 3. 필드 전체 교체
        product.modifyFields(dto);

        // 4. 이미지 전부 삭제 (orphanRemoval + 파일 삭제)
        if (product.getThumbnailImage() != null) {
            fileStorageService.deleteFile(product.getThumbnailImage().getImageUrl());
            product.setThumbnailImage(null);
        }
        for (ProductImage img : new ArrayList<>(product.getProductImages())) {
            fileStorageService.deleteFile(img.getImageUrl());
            product.getProductImages().remove(img);
        }

        // 5. 새 이미지 저장 & 연관 설정
        if (newImages != null) {
            // 메인 이미지 저장 후 URL 세팅
            String mainImage = fileStorageService.storeFile(newImages[0]);
            ThumbnailImage thumbnailImage = ThumbnailImage.create(new ProductImageItemDTO(productId, mainImage));
            product.setThumbnailImage(thumbnailImage);
        }

        if (Objects.requireNonNull(newImages).length > 1) {
            for (int i = 1; i < newImages.length; i++) {
                MultipartFile file = newImages[i];
                if (!file.isEmpty()) {
                    String url = fileStorageService.storeFile(file);
                    ProductImage img = new ProductImage();
                    img.setProduct(product);
                    img.setImageUrl(url);
                    product.getProductImages().add(img);
                }
            }
        }

        // 6. 자동으로 변경 내용이 Flush
    }


    /* 상품 삭제 */
    public void deleteProduct(String accessToken, Long productId) {

        // 0. 권한 검증 (COMPANY)
        String role = jwtUtil.getRole(accessToken);
        if (!"ROLE_COMPANY".equals(role)) throw new IllegalArgumentException("권한이 없습니다.");

        // 1) DB에서 불러오기
        Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다. id=" + productId));
        // 2) 물리 파일 삭제
        if (product.getThumbnailImage() != null) {
            fileStorageService.deleteFile(product.getThumbnailImage().getImageUrl());
        }
        for (ProductImage img : product.getProductImages()) {
            fileStorageService.deleteFile(img.getImageUrl());
        }
        // 3) 레코드 삭제
        productRepository.delete(product);
    }

    /* 카테고리에 속하는 상품 조회 */
    public ProductBatchPreviewResponse getCategorizedProductsPreview(int categoryId) {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByCategoryId(categoryId);

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 찜하기 수 많은 상품 조회 */
    public ProductBatchPreviewResponse getPopularProductsPreview() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByOrderByLikedDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }

    /* 최신순 상품 조회 */
    public ProductBatchPreviewResponse getLatestProductsPreview() {
        ProductBatchPreviewResponse response = new ProductBatchPreviewResponse();

        response.setBatchesPreviews(new ArrayList<>());
        List<Product> productList = productRepository.findAllByOrderByIdDesc();

        for(Product product : productList) {
            ProductPreviewDTO dto  = ProductPreviewDTO.from(product);
            response.getBatchesPreviews().add(dto);
        }

        return response;
    }
}