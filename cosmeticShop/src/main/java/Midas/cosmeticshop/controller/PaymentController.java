//package Midas.cosmeticshop.controller;
//
//import Midas.cosmeticshop.dto.ConfirmRequest;
//import Midas.cosmeticshop.service.PaymentService;
//import com.siot.IamportRestClient.IamportClient;
//import com.siot.IamportRestClient.exception.IamportResponseException;
//import com.siot.IamportRestClient.response.IamportResponse;
//import com.siot.IamportRestClient.response.Payment;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.beans.factory.annotation.*;
//
//import java.io.IOException;
//import java.util.List;
//
//@RestController
//@Slf4j
//@RequiredArgsConstructor
//@RequestMapping("/api")
//public class PaymentController {
//
//    private final PaymentService svc;
//
//    private IamportClient iamportClient;
//
//    @Value("${iamport.api.key}")
//    private String apiKey;
//
//    @Value("${iamport.api.secret}")
//    private String secretKey;
//
//    @PostConstruct
//    public void init() {
//        this.iamportClient = new IamportClient(apiKey, secretKey);
//    }
//
//
//    @PostMapping("/order/payment")
//    public ResponseEntity<String> paymentComplete(@Login SessionUser sessionUser, @RequestBody List<OrderSaveDto> orderSaveDtos) throws IOException {
//        String orderNumber = String.valueOf(orderSaveDtos.get(0).getOrderNumber());
//        try {
//            Long userId = sessionUser.getUserIdNo();
//            paymentService.saveOrder(userId, orderSaveDtos);
//            log.info("결제 성공 : 주문 번호 {}", orderNumber);
//            return ResponseEntity.ok().build();
//        } catch (RuntimeException e) {
//            log.info("주문 상품 환불 진행 : 주문 번호 {}", orderNumber);
//            String token = refundService.getToken(apiKey, secretKey);
//            refundService.refundWithToken(token, orderNumber, e.getMessage());
//            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
//        }
//    }
//
//
//    @PostMapping("/payment/validation/{imp_uid}")
//    @ResponseBody
//    public IamportResponse<Payment> validateIamport(@PathVariable String imp_uid)
//                                                        throws IamportResponseException, IOException {
//        IamportResponse<Payment> payment = iamportClient.paymentByImpUid(imp_uid);
//        log.info("결제 요청 응답. 결제 내역 - 주문 번호: {}", payment.getResponse().getMerchantUid());
//        return payment;
//    }
//
//    // ==================================================================================== //
//
//    // 5.1 결제 요청 (단순히 주문생성 정보만 받고 프론트로 토큰 발급은 프론트에서)
//    @PostMapping
//    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest req) {
//        // 앱 내 주문정보 저장 로직 (orderId, amount 등)
//        return ResponseEntity.ok().build();
//    }
//
//    // 5.1 결제 완료 콜백 처리
//    @PostMapping("/confirm")
//    public ResponseEntity<?> confirm(@RequestBody ConfirmRequest req) {
//        try {
//            svc.confirmPayment(req.getImp_uid(), req.getOrderId());
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//}
