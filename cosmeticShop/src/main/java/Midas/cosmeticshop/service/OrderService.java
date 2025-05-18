package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.OrderDTO;
import Midas.cosmeticshop.dto.OrderItemDTO;
import Midas.cosmeticshop.entity.DeliveryStatus;
import Midas.cosmeticshop.entity.Order;
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

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    /* 단일 상품 주문 */
    @Transactional
    public void createSingleOrder(OrderItemDTO orderItemDTO) {
        Product product = productRepository.findById(orderItemDTO.getProductId()).get();
        int discountRate = product.getDiscountRate();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = (User) auth.getPrincipal(); // UserDetails 를 구현한 객체를 가져 온다
//        user = userRepository.findById(user.getId()).get();
        BaseUserDetails baseUserDetails = (BaseUserDetails) auth.getPrincipal(); // UserDetails 를 구현한 객체를 가져 온다
        Optional<User> user = userRepository.findByUserId(baseUserDetails.getUsername());

        int discountedPrice =  orderItemDTO.getPrice() * (100 - discountRate) / 100;
        int totalPrice = discountedPrice * orderItemDTO.getQuantity();

        Order order = new Order();
        OrderItem orderItem = new OrderItem(
            order,
            product,
            orderItemDTO.getQuantity(),
            discountedPrice,
            DeliveryStatus.READY);
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(orderItem);
        OrderDTO orderDTO = new OrderDTO(
            totalPrice,
            orderItemDTO.getCity(),
            orderItemDTO.getStreet(),
            orderItemDTO.getDetail(),
            orderItems
        );

        order = order.makeOrder(user.orElse(null), orderDTO);

        user.get().getOrders().add(order);
        orderRepository.save(order);
        orderItemRepository.save(orderItem);
    }

    /* 장바구니에서 선택한 여러 상품들 한번에 주문 */
    @Transactional
    public void createOrders(List<OrderItemDTO> orderItemDTOList) {
        for(OrderItemDTO orderItemDTO : orderItemDTOList) {
            createSingleOrder(orderItemDTO);
        }
    }
}
