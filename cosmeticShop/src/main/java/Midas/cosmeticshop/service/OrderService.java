package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.order.OrderDTO;
import Midas.cosmeticshop.dto.order.OrderItemDTO;
import Midas.cosmeticshop.dto.AddressDTO;
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

    /* 단일 상품 주문 */
    @Transactional
    public void createSingleOrder(OrderItemDTO orderItemDTO, AddressDTO addressDTO) {
        Product product = productRepository.findById(orderItemDTO.getProductId()).get();
        int discountRate = product.getDiscountRate();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        BaseUserDetails baseUserDetails = (BaseUserDetails) auth.getPrincipal();
        Optional<User> user = userRepository.findByUserId(baseUserDetails.getUsername());

        int discountedPrice =  orderItemDTO.getPrice() * (100 - discountRate) / 100;
        int totalPrice = discountedPrice * orderItemDTO.getQuantity();

        Order order = new Order();
        OrderItem orderItem = new OrderItem(
            order,
            product,
            orderItemDTO.getQuantity(),
            discountedPrice,
            DeliveryStatus.READY
        );

        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(orderItem);

        OrderDTO orderDTO = OrderDTO.builder().
            totalPrice(totalPrice).
            city(addressDTO.getCity()).
            street(addressDTO.getStreet()).
            detail(addressDTO.getDetail()).
            orderItems(List.of(orderItem.toDTO())).
            build();

        order = order.makeOrder(user.orElse(null), orderDTO);

        user.get().getOrders().add(order);
        orderRepository.save(order);
        orderItemRepository.save(orderItem);
    }

    /* 장바구니에서 선택한 여러 상품들 한번에 주문 */
    @Transactional
    public void createOrders(List<OrderItemDTO> orderItemDTOList, AddressDTO addressDTO) {
        for(OrderItemDTO orderItemDTO : orderItemDTOList) {
            createSingleOrder(orderItemDTO, addressDTO);
        }
    }

    /* 단일 주문 상세 조회 */
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

        return OrderDTO.builder().
            totalPrice(order.getTotalPrice()).
            city(orderAddress.getCity()).
            street(orderAddress.getStreet()).
            detail(orderAddress.getDetail()).
            orderItems(orderItemDTOs).
            build();
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders(BaseUserDetails baseUserDetails) {
        User user = userRepository.findByUserId(baseUserDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("회원 정보를 불러오지 못했습니다 !!!"));

        List<Order> orderList = orderRepository.findAllByUser(user)
            .orElseThrow(() -> new RuntimeException("주문 정보가 없습니다 !!!")
        );

        /* Order 리스트 -> OrderDTO 리스트로 매핑해서 반환 */
        return orderList.stream()
            .map(Order::toDTO)
            .collect(Collectors.toList());
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

        // 주문 아이템 및 주문 삭제
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
