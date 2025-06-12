package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.order.DeliveryStatusDTO;
import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.dto.order.OrderItemDTO;
import Midas.cosmeticshop.dto.AddressDTO;
import Midas.cosmeticshop.dto.order.PurchasedOrderItemResponse;
import Midas.cosmeticshop.entity.DeliveryStatus;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.OrderAddress;
import Midas.cosmeticshop.entity.OrderItem;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.Company;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.OrderItemRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.CompanyRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Comparator.*;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public Long createSingleOrder(List<OrderItemDTO> orderItemDTOs, AddressDTO addressDTO, int totalPrice) {
        // 사용자 조회
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        BaseUserDetails baseUserDetails = (BaseUserDetails) auth.getPrincipal();
        User user = userRepository.findByUserId(baseUserDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 주문 생성
        Order order = new Order();
        List<OrderItemDTO> calculatedOrderItems = new ArrayList<>();

        // 각 주문 아이템 처리
        for (OrderItemDTO orderItemDTO : orderItemDTOs) {
            Product product = productRepository.findById(orderItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다: " + orderItemDTO.getProductId()));

            int discountRate = product.getDiscountRate();
            int discountedPrice = orderItemDTO.getPrice() * (100 - discountRate) / 100;

            OrderItemDTO calculatedOrderItemDTO = OrderItemDTO.builder()
                // orderItemId는 아직 생성되지 않았으므로 넣지 않음
                .productId(product.getId())
                .productName(product.getProductName())
                .quantity(orderItemDTO.getQuantity())
                .price(discountedPrice)
                .deliveryStatus("READY")
                .build();

            calculatedOrderItems.add(calculatedOrderItemDTO);

            OrderItem orderItem = OrderItem.fromDTO(calculatedOrderItemDTO, order, product);
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            order.getOrderItems().add(orderItem);
        }

        // OrderDTO 생성
        OrderDTO orderDTO = OrderDTO.builder()
            .totalPrice(totalPrice)
            .city(addressDTO.getCity())
            .street(addressDTO.getStreet())
            .detail(addressDTO.getDetail())
            .orderItems(calculatedOrderItems)
            .build();

        order = order.makeOrder(user, orderDTO);
        user.getOrders().add(order);

        Order savedOrder = orderRepository.save(order);
        return savedOrder.getId();
    }

    @Transactional
    public void createOrders(List<OrderItemDTO> orderItemDTOList, AddressDTO addressDTO, int totalPrice) {
        createSingleOrder(orderItemDTOList, addressDTO, totalPrice);
    }

    @Transactional(readOnly = true)
    public OrderDTO getSingleOrderDetail(BaseUserDetails baseUserDetails, Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(
            () -> new RuntimeException("주문 정보가 없습니다 !!!")
        );

        if(!order.getUser().getUserId().equals(baseUserDetails.getUsername())) {
            throw new RuntimeException("주문한 사용자 정보가 다릅니다 !!!");
        }

        List<OrderItem> orderItems = orderItemRepository.findAllByOrderId(orderId);
        OrderAddress orderAddress = order.getOrderAddress();

        List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
        for (OrderItem item : orderItems) {
            orderItemDTOs.add(item.toDTO());
        }

        return OrderDTO.builder()
            .totalPrice(order.getTotalPrice())
            .city(orderAddress.getCity())
            .street(orderAddress.getStreet())
            .detail(orderAddress.getDetail())
            .orderItems(orderItemDTOs)
            .build();
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getMyOrders(BaseUserDetails baseUserDetails) {
        User user = userRepository.findByUserId(baseUserDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("회원 정보를 불러오지 못했습니다 !!!"));

        List<Order> orderList = orderRepository.findAllByUser(user)
            .orElseThrow(() -> new RuntimeException("주문 정보가 없습니다 !!!"));

        return orderList.stream()
            .map(Order::toDTO)
            .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<PurchasedOrderItemResponse> getMyOrderItemsByDeliveryStatus(BaseUserDetails baseUserDetails, String deliveryStatus) {
        User user = userRepository.findByUserId(baseUserDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("회원 정보를 불러오지 못했습니다 !!!"));

        DeliveryStatus status = deliveryStatus.equals("COMP") ? DeliveryStatus.COMP
            : deliveryStatus.equals("READY") ? DeliveryStatus.READY : DeliveryStatus.PROG;

        List<Order> allByUser = orderRepository.findAllByUser(user)
            .orElseThrow(() -> new RuntimeException("주문 정보가 없습니다 !!!"));

        List<PurchasedOrderItemResponse> purchasedOrderItemResponses = new ArrayList<>();

        for(Order order : allByUser) {
            OrderAddress orderAddress = order.getOrderAddress();
            // 주소를 하나의 문자열로 조합
            String fullAddress = orderAddress.getCity() + " " +
                                 orderAddress.getStreet() + " " +
                                 orderAddress.getDetail();

            Long orderId = order.getId();
            for(OrderItem item : order.getOrderItems()) {
                if(item.getDeliveryStatus().equals(status)) {
                    purchasedOrderItemResponses.add(
                        PurchasedOrderItemResponse.builder()
                            .orderItemDTO(item.toDTO())
                            .orderId(orderId)
                            .address(fullAddress)
                            .orderDate(order.getCreatedAt())
                            .buyerName(user.getUsername()) // 사용자 이름 사용
                            .build()
                    );
                }
            }
        }

        return purchasedOrderItemResponses;
    }

    /* 단일 상품주문 삭제 */
    @Transactional
    public void cancelOrderItem(Long orderItemId, BaseUserDetails baseUserDetails) {
        OrderItem item = orderItemRepository.findById(orderItemId)
            .orElseThrow(() -> new RuntimeException("상품주문 정보가 없습니다 !!!"));

        Order order = item.getOrder();
        if (!order.getUser().getUserId().equals(baseUserDetails.getUsername())) {
            throw new RuntimeException("주문한 사용자 정보가 다릅니다 !!!");
        }

        if (item.getDeliveryStatus() != DeliveryStatus.READY) {
            throw new RuntimeException("이미 배송이 시작된 상품입니다");
        }

        order.removeOrderItem(item);
        orderItemRepository.delete(item);
    }

    /* 여러개 상품주문 삭제 */
    @Transactional
    public void cancelOrderItems(List<Long> orderItemIds, BaseUserDetails baseUserDetails) {
        List<OrderItem> items = orderItemRepository.findAllById(orderItemIds);

        for(OrderItem item : items) {
            Order order = item.getOrder();
            if (!order.getUser().getUserId().equals(baseUserDetails.getUsername())) {
                throw new RuntimeException("주문한 사용자 정보가 다릅니다 !!!");
            }
            if (item.getDeliveryStatus() != DeliveryStatus.READY) {
                throw new RuntimeException("이미 배송이 시작된 상품입니다");
            }

            order.removeOrderItem(item);
            orderItemRepository.delete(item);
        }
    }

    @Transactional
    public void cancelOrder(Long orderId, BaseUserDetails baseUserDetails) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("주문 정보가 없습니다 !!!"));

        if (!order.getUser().getUserId().equals(baseUserDetails.getUsername())) {
            throw new RuntimeException("주문한 사용자 정보가 다릅니다 !!!");
        }

        List<OrderItem> orderItems = orderItemRepository.findAllByOrderId(orderId);
        for (OrderItem item : orderItems) {
            if (item.getDeliveryStatus() != DeliveryStatus.READY) {
                throw new RuntimeException("이미 배송이 시작된 상품입니다");
            }
        }

        orderItemRepository.deleteAll(orderItems);
        orderRepository.delete(order);
    }

    @Transactional
    public void cancelOrders(List<Long> orderIdList, BaseUserDetails baseUserDetails) {
        for (Long orderId : orderIdList) {
            cancelOrder(orderId, baseUserDetails);
        }
    }

    /* 해당 기업의 상품에 대해 모든 주문상품 내역을 반환 */
    @Transactional(readOnly = true)
    public ResponseEntity<List<PurchasedOrderItemResponse>> getAllOrderItemsByCompany(String companyName) {
        List<OrderItem> orderItems = orderItemRepository.findAllByCompanyName(companyName);
        List<PurchasedOrderItemResponse> purchasedOrderItemResponses = new ArrayList<>();

        for(OrderItem item : orderItems) {
            OrderItemDTO dto = item.toDTO();
            Order order = item.getOrder();
            Long orderId = order.getId();
            User buyer = order.getUser();
            OrderAddress orderAddress = order.getOrderAddress();

            // 주소를 하나의 문자열로 조합
            String fullAddress = orderAddress.getCity() + " " +
                                 orderAddress.getStreet() + " " +
                                 orderAddress.getDetail();

            PurchasedOrderItemResponse response = PurchasedOrderItemResponse.builder()
                .orderItemDTO(dto)
                .orderId(orderId)
                .address(fullAddress)
                .orderDate(order.getCreatedAt())
                .buyerName(buyer.getUsername()) // 사용자 이름 사용
                .build();

            purchasedOrderItemResponses.add(response);
        }

        return ResponseEntity.ok(purchasedOrderItemResponses);
    }

    /* 기업의 주문상품 배송상태 변경 메소드 */
    @Transactional
    public ResponseEntity<Void> changeItemDeliveryStatus(
        BaseUserDetails baseUserDetails, Long orderItemId, @Valid DeliveryStatusDTO deliveryStatusDTO) {

        Company company = companyRepository.findByUserId(baseUserDetails.getUsername());
        if(company == null) {
            return ResponseEntity.badRequest().build();
        }

        DeliveryStatus deliveryStatus = DeliveryStatus.valueOf(deliveryStatusDTO.getDeliveryStatus());

        try {
            orderItemRepository.updateDeliveryStatus(orderItemId, deliveryStatus);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 사용자가 특정 상품을 구매했는지 확인하는 메소드
     * @param userId 사용자 ID
     * @param productId 상품 ID
     * @return 구매 여부 (true: 구매함, false: 구매하지 않음)
     */
    @Transactional(readOnly = true)
    public boolean hasUserPurchasedProduct(String userId, Long productId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        // 사용자가 주문한 모든 주문 아이템 중에서 특정 상품이 포함되어 있는지 확인
        return orderItemRepository.existsByOrderUserAndProductIdAndDeliveryStatusIn(
            user, 
            productId, 
            List.of(DeliveryStatus.COMP, DeliveryStatus.PROG)  // 배송 완료 또는 진행 중인 주문만 포함
        );
    }
}