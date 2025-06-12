package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.BaseUserDetails;
import Midas.cosmeticshop.dto.order.*;
import Midas.cosmeticshop.repository.ThumbnailImageRepository;
import Midas.cosmeticshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    private final ThumbnailImageRepository thumbnailImageRepository;
    /* 필요 검증 : 상품 재고 부족 */

    /* 주문을 완료한 상품 정보는 결제완료 전까지 세션저장소에 남아있다가
    * 결제가 완료되면 주문이 생성되고 정보가 DB 로 넘어간다 ?
    * 이건 처리방법을 생각해보자 */

    /* 주문 생성 : 보고 있는 상품 하나 즉시 주문
    * 프론트엔드에서 현재 보고있는 상품 상세 페이지의 정보들이 OrderItemDTO 에 담겨서 요청으로 넘어온다.
    * OrderItemDTO 의 productId 는 현재 보고있는 상품 상세 페이지의 url 의 마지막 부분인 {productId} 를 가져와서 채운다.
    * */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        Long orderId = orderService.createSingleOrder(
            orderRequest.getOrderItemDTO(),
            orderRequest.getAddressDTO(),
            orderRequest.getTotalPrice()
        );
        return ResponseEntity.ok().body(Map.of("orderId", orderId));
    }

    /* 주문 생성 : 장바구니에서 선택한 상품들을 한번에 주문
    * 프론트에서 사용자가 여러 아이템들을 체크한 뒤 '주문하기' 버튼을 누르면,
    * 체크한 아이템들에 대한 각 OrderItemDTO 정보가 채워지고,
    * 체크한 아이템 수만큼의 OrderItemDTO 들이 요청에 List 로 넘어온 다음 makeOrder(List<OrderItemDTO>)를 호출한다.
    cd* */
    @PostMapping("/batch")
    public ResponseEntity<?> createOrders(@Valid @RequestBody OrderBatchRequest orderBatchRequest) {
        orderService.createOrders(orderBatchRequest.getOrderItemDTOList(), orderBatchRequest.getAddressDTO(), orderBatchRequest.getTotalPrice());
        return ResponseEntity.ok().build();
    }

    /* 단일 주문 상세 조회 : MyPage 기능 구현 때 작성
    * 리스트에서 각각의 OrderItem 정보 꺼내는건 프론트에서 */
    @GetMapping("{orderId}")
    public ResponseEntity<Map<String, Object>> getSingleOrderDetail(
        @AuthenticationPrincipal BaseUserDetails baseUserDetails,
        @PathVariable Long orderId) {

        OrderDTO orderDTO = orderService.getSingleOrderDetail(baseUserDetails, orderId);
        Long productId = orderDTO.getOrderItems().get(0).getProductId();
//        String thumbnailUrl = thumbnailImageRepository.findByProduct_Id(productId).get().getImageUrl();

        Map<String, Object> response = new HashMap<>();
        response.put("order", orderDTO);
//        response.put("thumbnailUrl", thumbnailUrl);

        return ResponseEntity.ok(response);
    }

    /* 주문 내역 전체 조회 : Order가 주내용 */
    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(@AuthenticationPrincipal BaseUserDetails baseUserDetails) {

        List<OrderDTO> orderDTOs = orderService.getMyOrders(baseUserDetails);
        return ResponseEntity.ok(orderDTOs);
    }

    /* 배송상태에 따른 '주문상품' 조회 : orderItem이 주내용 */
    @GetMapping("/my/{deliveryStatus}")
    public ResponseEntity<List<PurchasedOrderItemResponse>> getMyOrdersByDeliveryStatus(
        @AuthenticationPrincipal BaseUserDetails baseUserDetails,
        @PathVariable String deliveryStatus) {

        // PurchasedOrderItemResponse = OrderItemDTO + orderId
        List<PurchasedOrderItemResponse> purchasedOrderItems = orderService.getMyOrderItemsByDeliveryStatus(baseUserDetails, deliveryStatus);
        return ResponseEntity.ok(purchasedOrderItems);
    }

    /* 확정X ) DeliveryStatus 가 READY 인 주문 수정 */

    /* 단일 상품주문 취소(OrderItem) */
    @DeleteMapping("/{orderItemId}")
    public ResponseEntity<?> cancelOrderItem(@AuthenticationPrincipal BaseUserDetails baseUserDetails,
                                         @PathVariable Long orderItemId) {

        orderService.cancelOrderItem(orderItemId, baseUserDetails);
        return ResponseEntity.ok().build();
    }

    /* 여러개 상품주문 취소(OrderItem) */
    @DeleteMapping("/all")
    public ResponseEntity<?> cancelOrderItems(@AuthenticationPrincipal BaseUserDetails baseUserDetails,
                                              @RequestBody List<Long> orderItemIdList) {

        orderService.cancelOrderItems(orderItemIdList, baseUserDetails);
        return ResponseEntity.ok().build();
    }

    /* 주문 취소(Order) : DeliveryStatus 가 READY 인 상품만 취소 가능 */
    @DeleteMapping("/batch/{orderId}")
    public ResponseEntity<?> cancelOrder(@AuthenticationPrincipal BaseUserDetails baseUserDetails,
                                         @PathVariable Long orderId) {

        orderService.cancelOrder(orderId, baseUserDetails);
        return ResponseEntity.ok().build();
    }

    /* 여러개 주문 한 번에 취소 */
    @DeleteMapping("/batch/all")
    public ResponseEntity<?> cancelOrders(@AuthenticationPrincipal BaseUserDetails baseUserDetails,
                                          @RequestBody List<Long> orderIdList) {
        orderService.cancelOrders(orderIdList, baseUserDetails);
        return ResponseEntity.ok().build();
    }

    /* 기업회원) 자사 상품에 대한 모든 orderItem 내역 조회 */
    @GetMapping("/company/{companyName}")
    public ResponseEntity<List<PurchasedOrderItemResponse>> getCompanyOrderItems(@PathVariable String companyName) {
        return orderService.getAllOrderItemsByCompany(companyName);
    }

    /* 기업회원) OrderItem 의 deliveryStatus 변경 : READY -> PROG, PROG -> COMP */
    @PatchMapping("/{orderItemId}")
    public ResponseEntity<Void> changeItemDeliveryStatus(
        @AuthenticationPrincipal BaseUserDetails baseUserDetails,
        @PathVariable Long orderItemId,
        @Valid @RequestBody DeliveryStatusDTO deliveryStatusDTO) {

        try {
            System.out.println("DeliveryStatusDTO = " + deliveryStatusDTO.toString());
            return orderService.changeItemDeliveryStatus(baseUserDetails, orderItemId, deliveryStatusDTO);
        } catch (Exception e) {
            // 예외 로깅
            // logger.error("배송 상태 변경 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}