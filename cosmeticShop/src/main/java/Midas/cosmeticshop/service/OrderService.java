package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.dto.order.OrderItemDTO;
import Midas.cosmeticshop.dto.AddressDTO;
import Midas.cosmeticshop.dto.order.PurchasedOrderItemResponse;
import Midas.cosmeticshop.entity.DeliveryStatus;
import Midas.cosmeticshop.entity.Order;
import Midas.cosmeticshop.entity.OrderAddress;
import Midas.cosmeticshop.entity.OrderItem;
import Midas.cosmeticshop.entity.product.Product;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.OrderItemRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import Midas.cosmeticshop.repository.ProductRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

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
                () -> new RuntimeException("주문 정보가 없습니다 !!!"));

        if (!order.getUser().getUserId().equals(baseUserDetails.getUsername())) {
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

        List<Order> orderList = orderRepository.findAllByUser(user);
        if (orderList.isEmpty()) {
            throw new RuntimeException("주문 정보가 없습니다 !!!");
        }


        return orderList.stream()
                .map(Order::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PurchasedOrderItemResponse> getMyOrderItemsByDeliveryStatus(BaseUserDetails baseUserDetails,
            String deliveryStatus) {
        User user = userRepository.findByUserId(baseUserDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("회원 정보를 불러오지 못했습니다 !!!"));

        DeliveryStatus status = deliveryStatus.equals("COMP") ? DeliveryStatus.COMP
                : deliveryStatus.equals("READY") ? DeliveryStatus.READY : DeliveryStatus.PROG;

        List<Order> allByUser = orderRepository.findAllByUser(user);

        List<PurchasedOrderItemResponse> purchasedOrderItemResponses = new ArrayList<>();
        for (Order order : allByUser) {
            Long orderId = order.getId();
            for (OrderItem item : order.getOrderItems()) {
                if (item.getDeliveryStatus().equals(status)) {
                    purchasedOrderItemResponses
                            .add(new PurchasedOrderItemResponse(item.toDTO(), orderId));
                }
            }
        }

        return purchasedOrderItemResponses;
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
}
