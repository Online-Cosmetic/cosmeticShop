package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.OrderItemDTO;
import Midas.cosmeticshop.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    /* 필요 검증 : 상품 재고 부족 */

    /* 주문을 완료한 상품 정보는 결제완료 전까지 세션저장소에 남아있다가
    * 결제가 완료되면 주문이 생성되고 정보가 DB 로 넘어간다 ?
    * 이건 처리방법을 생각해보자 */

    /* 주문 생성 : 보고 있는 상품 하나 즉시 주문
    * 프론트엔드에서 현재 보고있는 상품 상세 페이지의 정보들이 OrderItemDTO 에 담겨서 요청으로 넘어온다.
    * OrderItemDTO 의 productId 는 현재 보고있는 상품 상세 페이지의 url 의 마지막 부분인 {productId} 를 가져와서 채운다.
    * */
    @PostMapping("")
    public ResponseEntity<?> makeOrder(@Valid @RequestBody OrderItemDTO orderItemDTO) {
        orderService.createSingleOrder(orderItemDTO);
        return ResponseEntity.ok().build();
    }

    /* 주문 생성 : 장바구니에서 선택한 상품들을 한번에 주문
    * 프론트에서 사용자가 여러 아이템들을 체크한 뒤 '주문하기' 버튼을 누르면,
    * 체크한 아이템들에 대한 각 OrderItemDTO 정보가 채워지고,
    * 체크한 아이템 수만큼의 OrderItemDTO 들이 요청에 List 로 넘어온 다음 makeOrder(List<OrderItemDTO>)를 호출한다.
    * */
    @PostMapping("/batch")
    public ResponseEntity<?> makeOrders(@Valid @RequestBody List<OrderItemDTO> orderItemDTOList) {
        orderService.createOrders(orderItemDTOList);
        return ResponseEntity.ok().build();
    }

    /* 확정X ) DeliveryStatus 가 READY 인 주문 수정 */

    /* 주문 상세 조회 : MyPage 기능 구현 때 작성 */

    /* 주문 취소 : MyPage 기능 구현 때 작성 */
}
