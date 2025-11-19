package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.aitems.AitemsInteractionDTO;
import Midas.cosmeticshop.dto.aitems.AitemsItemDTO;
import Midas.cosmeticshop.dto.aitems.AitemsUserDTO;
import Midas.cosmeticshop.entity.Cart;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.Review;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.product.ProductLike;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.CartRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import Midas.cosmeticshop.repository.ProductLikeRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.ReviewRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * AiTEMS Dataset CSV Export Service
 * user/item/interaction Dataset을 CSV 파일로 생성
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AitemsDatasetExportService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final ProductLikeRepository productLikeRepository;

    /**
     * User Dataset CSV 생성
     * @return CSV 파일의 바이트 배열
     */
    public byte[] exportUserDataset() {
        log.info("User Dataset CSV Export 시작");
        
        try {
            List<User> users = userRepository.findAllUsersForAitems();
            log.info("조회된 User 수: {}", users.size());

            List<AitemsUserDTO> userDTOs = users.stream()
                .map(AitemsUserDTO::from)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

            return generateCsv(
                AitemsUserDTO.getCsvHeader(),
                userDTOs.stream()
                    .map(AitemsUserDTO::toCsvRow)
                    .collect(Collectors.toList())
            );
        } catch (Exception e) {
            log.error("User Dataset CSV Export 실패", e);
            throw new RuntimeException("User Dataset CSV Export 실패: " + e.getMessage(), e);
        }
    }

    /**
     * Item Dataset CSV 생성
     * @return CSV 파일의 바이트 배열
     */
    public byte[] exportItemDataset() {
        log.info("Item Dataset CSV Export 시작");
        
        try {
            List<Product> products = productRepository.findAllActiveProductsForAitems();
            log.info("조회된 Product 수: {}", products.size());

            List<AitemsItemDTO> itemDTOs = products.stream()
                .map(AitemsItemDTO::from)
                .filter(dto -> dto != null)
                .collect(Collectors.toList());

            return generateCsv(
                AitemsItemDTO.getCsvHeader(),
                itemDTOs.stream()
                    .map(AitemsItemDTO::toCsvRow)
                    .collect(Collectors.toList())
            );
        } catch (Exception e) {
            log.error("Item Dataset CSV Export 실패", e);
            throw new RuntimeException("Item Dataset CSV Export 실패: " + e.getMessage(), e);
        }
    }

    /**
     * Interaction Dataset CSV 생성
     * @return CSV 파일의 바이트 배열
     */
    public byte[] exportInteractionDataset() {
        log.info("Interaction Dataset CSV Export 시작");
        
        try {
            List<AitemsInteractionDTO> interactions = new ArrayList<>();

            // Cart 데이터 수집
            List<Cart> carts = cartRepository.findAllCartsForAitems();
            log.info("조회된 Cart 수: {}", carts.size());
            carts.forEach(cart -> {
                AitemsInteractionDTO dto = AitemsInteractionDTO.fromCart(cart);
                if (dto != null) {
                    interactions.add(dto);
                }
            });

            // OrderItem 데이터 수집
            List<Order> orders = orderRepository.findAllOrderItemsForAitems();
            log.info("조회된 Order 수: {}", orders.size());
            orders.forEach(order -> {
                if (order.getOrderItems() != null) {
                    order.getOrderItems().forEach(orderItem -> {
                        AitemsInteractionDTO dto = AitemsInteractionDTO.fromOrderItem(orderItem, order);
                        if (dto != null) {
                            interactions.add(dto);
                        }
                    });
                }
            });

            // Review 데이터 수집
            List<Review> reviews = reviewRepository.findAllReviewsForAitems();
            log.info("조회된 Review 수: {}", reviews.size());
            reviews.forEach(review -> {
                AitemsInteractionDTO dto = AitemsInteractionDTO.fromReview(review);
                if (dto != null) {
                    interactions.add(dto);
                }
            });

            // ProductLike 데이터 수집
            List<ProductLike> productLikes = productLikeRepository.findAllProductLikesForAitems();
            log.info("조회된 ProductLike 수: {}", productLikes.size());
            productLikes.forEach(productLike -> {
                AitemsInteractionDTO dto = AitemsInteractionDTO.fromProductLike(productLike);
                if (dto != null) {
                    interactions.add(dto);
                }
            });

            // TIMESTAMP 기준 정렬
            Collections.sort(interactions);
            log.info("총 Interaction 수: {}", interactions.size());

            return generateCsv(
                AitemsInteractionDTO.getCsvHeader(),
                interactions.stream()
                    .map(AitemsInteractionDTO::toCsvRow)
                    .collect(Collectors.toList())
            );
        } catch (Exception e) {
            log.error("Interaction Dataset CSV Export 실패", e);
            throw new RuntimeException("Interaction Dataset CSV Export 실패: " + e.getMessage(), e);
        }
    }

    /**
     * CSV 파일 생성 헬퍼 메서드
     * @param header CSV 헤더
     * @param rows CSV 행 데이터 리스트
     * @return CSV 파일의 바이트 배열
     */
    private byte[] generateCsv(String header, List<String> rows) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             OutputStreamWriter writer = new OutputStreamWriter(baos, StandardCharsets.UTF_8)) {

            // BOM 추가 (UTF-8 BOM) - Excel 호환성
            baos.write(0xEF);
            baos.write(0xBB);
            baos.write(0xBF);

            // 헤더 작성
            writer.write(header);
            writer.write("\n");

            // 데이터 행 작성
            for (String row : rows) {
                writer.write(row);
                writer.write("\n");
            }

            writer.flush();
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("CSV 생성 중 오류 발생", e);
            throw new RuntimeException("CSV 생성 실패: " + e.getMessage(), e);
        }
    }
}

