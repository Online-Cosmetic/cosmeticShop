// src/main/java/com/example/payment/controller/PaymentController.java
package Midas.cosmeticshop.controller;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final IamportClient iamportClient;
    public PaymentController(@Value("${iamport.api.key}") String api_key,
                             @Value("${iamport.api.secret}") String api_secretKey) {
        // 아임포트 관리자에서 발급받은 REST API 키/시크릿 입력
        this.iamportClient = new IamportClient(api_key, api_secretKey);
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyPayment(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String impUid = request.get("imp_uid");
            Payment payment = iamportClient.paymentByImpUid(impUid).getResponse();

            // 결제 금액 등 검증 로직
            if (payment.getAmount().intValue() == 1000 && "paid".equals(payment.getStatus())) {
                response.put("success", true);
            } else {
                response.put("success", false);
            }
        } catch (Exception e) {
            response.put("success", false);
        }
        return response;
    }
}