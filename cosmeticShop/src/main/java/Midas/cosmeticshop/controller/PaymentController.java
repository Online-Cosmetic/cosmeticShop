package Midas.cosmeticshop.controller;

import Midas.cosmeticshop.dto.payment.*;
import com.siot.IamportRestClient.IamportClient;
import Midas.cosmeticshop.entity.PaymentHistory;
import Midas.cosmeticshop.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final IamportClient iamportClient;
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(@Value("${iamport.api.key}") String api_key,
                             @Value("${iamport.api.secret}") String api_secretKey,
                             PaymentService paymentService) {
        // 아임포트 관리자에서 발급받은 REST API 키/시크릿 입력
        this.iamportClient = new IamportClient(api_key, api_secretKey);
        this.paymentService = paymentService;
    }

    // 결제 요청 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody PaymentCreateRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentHistory payment = paymentService.createPayment(request);
            response.put("success", true);
            response.put("paymentId", payment.getId());
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 카드 결제 처리
    @PostMapping("/card")
    public ResponseEntity<Map<String, Object>> processCardPayment(@RequestBody PaymentProcessRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentHistory payment = paymentService.processCardPayment(request);
            response.put("success", true);
            response.put("paymentId", payment.getId());
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 계좌이체 처리
    @PostMapping("/bank-transfer")
    public ResponseEntity<Map<String, Object>> processBankTransfer(@RequestBody PaymentProcessRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentHistory payment = paymentService.processBankTransfer(request);
            response.put("success", true);
            response.put("paymentId", payment.getId());
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 카카오페이 처리
    @PostMapping("/kakao-pay")
    public ResponseEntity<Map<String, Object>> processKakaoPay(@RequestBody PaymentProcessRequest request) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentHistory payment = paymentService.processKakaoPay(request);
            response.put("success", true);
            response.put("paymentId", payment.getId());
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 결제 완료 처리
    @PostMapping("/{paymentId}/complete")
    public ResponseEntity<Map<String, Object>> completePayment(
        @PathVariable Long paymentId,
        @RequestBody PaymentCompleteRequest request
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            PaymentHistory payment = paymentService.completePayment(paymentId, request);
            response.put("success", true);
            response.put("payment", payment);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 결제 검증
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String impUid = request.get("imp_uid");
            String merchantUid = request.get("merchant_uid");
            String payMethod = request.getOrDefault("pay_method", "card");
            // orderId는 프론트에서 추가로 넘겨주거나, merchantUid로 매핑 필요
            Long orderId = request.containsKey("order_id") ? Long.valueOf(request.get("order_id")) : null;
            PaymentHistory paymentHistory = paymentService.confirmPayment(impUid, merchantUid, payMethod, orderId);
            response.put("success", true);
            response.put("payment", paymentHistory);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
        }
        return ResponseEntity.ok(response);
    }

    // 주문별 결제 정보 조회
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentHistory> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentHistory payment = paymentService.getPaymentByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        return ResponseEntity.ok(payment);
    }

    // 결제 상태 조회
    @GetMapping("/{orderId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentStatus(@PathVariable Long orderId) {
        PaymentHistory payment = paymentService.getPaymentByOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        
        PaymentResponseDTO response = PaymentResponseDTO.builder()
            .paymentId(payment.getId())
            .orderId(payment.getOrderId())
            .amount(payment.getAmount())
            .paymentMethod(payment.getPaymentMethod())
            .status(payment.getStatus())
            .buyerName(payment.getBuyerName())
            .buyerEmail(payment.getBuyerEmail())
            .build();
            
        return ResponseEntity.ok(response);
    }

    /* 특정기업 최근 1주일간 판매 금액 통계 반환 */
    @GetMapping("/statistics/weekly/{companyName}")
    public ResponseEntity<Map<String, Integer>> getWeeklySalesStatistics(
        @PathVariable String companyName) {
        Map<String, Integer> statistics = paymentService.getWeeklySalesStatistics(companyName);
        return ResponseEntity.ok(statistics);
    }

    /* 특정 기업 가장 많이 팔린 제품 top 5 정보 반환 */
    @GetMapping("/statistics/top-products/{companyName}")
    public ResponseEntity<List<TopProductDTO>> getTop5Products(
        @PathVariable String companyName) {
        List<TopProductDTO> topProducts = paymentService.getTop5ProductsByCompany(companyName);
        return ResponseEntity.ok(topProducts);
    }

    /* 특정 기업의 최신순 payment 트랜잭션 기록 반환 */
    @GetMapping("/transactions/{companyName}")
    public ResponseEntity<List<TransactionDTO>> getLatestTransactions(
        @PathVariable String companyName,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size) {
        List<TransactionDTO> transactions = paymentService.getLatestTransactionsByCompany(
            companyName, page, size);
        return ResponseEntity.ok(transactions);
    }
}