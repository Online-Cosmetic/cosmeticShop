package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.payment.*;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import Midas.cosmeticshop.entity.PaymentHistory;
import Midas.cosmeticshop.repository.PaymentHistoryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final IamportClient iamportClient;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final String iamportApiKey;

    public PaymentService(
            IamportClient iamportClient,
            PaymentHistoryRepository paymentHistoryRepository,
            @Value("${iamport.api.key}") String iamportApiKey
    ) {
        this.iamportClient = iamportClient;
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.iamportApiKey = iamportApiKey;
    }

    @Transactional
    public PaymentHistory createPayment(PaymentCreateRequest request) {
        PaymentHistory payment = new PaymentHistory();
        payment.setImpUid(request.getImpUid());
        payment.setMerchantUid(request.getMerchantUid());
        payment.setOrderId(request.getOrderId());
        payment.setAmount(request.getAmount().intValue());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setStatus(request.getPaymentStatus());
        payment.setBuyerName(request.getBuyerName());
        payment.setBuyerEmail(request.getBuyerEmail());
        
        return paymentHistoryRepository.save(payment);
    }

    @Transactional
    public PaymentHistory processCardPayment(PaymentProcessRequest request) {
        // 결제 검증
        verifyPayment(request.getImpUid(), request.getAmount());
        
        // 결제 정보 업데이트
        PaymentHistory payment = paymentHistoryRepository.findByImpUid(request.getImpUid())
            .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        
        payment.setStatus("PROCESSING");
        return paymentHistoryRepository.save(payment);
    }

    @Transactional
    public PaymentHistory processBankTransfer(PaymentProcessRequest request) {
        // 결제 검증
        verifyPayment(request.getImpUid(), request.getAmount());
        
        // 결제 정보 업데이트
        PaymentHistory payment = paymentHistoryRepository.findByImpUid(request.getImpUid())
            .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        
        payment.setStatus("PROCESSING");
        return paymentHistoryRepository.save(payment);
    }

    @Transactional
    public PaymentHistory processKakaoPay(PaymentProcessRequest request) {
        // 결제 검증
        verifyPayment(request.getImpUid(), request.getAmount());
        
        // 결제 정보 업데이트
        PaymentHistory payment = paymentHistoryRepository.findByImpUid(request.getImpUid())
            .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        
        payment.setStatus("PROCESSING");
        return paymentHistoryRepository.save(payment);
    }

    @Transactional
    public PaymentHistory completePayment(Long paymentId, PaymentCompleteRequest request) {
        PaymentHistory payment = paymentHistoryRepository.findById(paymentId)
            .orElseThrow(() -> new RuntimeException("결제 정보를 찾을 수 없습니다."));
        
        payment.setStatus(request.getStatus());
        
        return paymentHistoryRepository.save(payment);
    }

    @Transactional
    public PaymentHistory confirmPayment(String impUid, String merchantUid, String payMethod, Long orderId) {
        try {
            // 아임포트 서버에서 결제 정보 조회
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(impUid);
            Payment iamportPayment = iamportResponse.getResponse();

            // 결제 정보 저장 또는 업데이트
            PaymentHistory payment = paymentHistoryRepository.findByImpUid(impUid)
                .orElse(new PaymentHistory());

            payment.setImpUid(impUid);
            payment.setMerchantUid(merchantUid);
            payment.setOrderId(orderId);
            payment.setAmount(iamportPayment.getAmount().intValue());
            // 항상 "paid"로 설정 (테스트용)
            payment.setStatus(iamportPayment.getStatus());
            payment.setPaymentMethod(payMethod);

            return paymentHistoryRepository.save(payment);
        } catch (Exception e) {
            throw new RuntimeException("결제 확인 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    public Optional<PaymentHistory> getPaymentByOrderId(Long orderId) {
        return paymentHistoryRepository.findByOrderId(orderId);
    }

    private void verifyPayment(String impUid, Long amount) {
        // ✅ 테스트 모드: 결제 검증 스킵
        if ("dummy-key".equals(iamportApiKey)) {
            System.out.println("[TEST] verifyPayment SKIP - impUid=" + impUid + ", amount=" + amount);
            return;
        }
        try {
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(impUid);
            Payment payment = iamportResponse.getResponse();

            if (payment.getAmount().longValue() != amount) {
                throw new RuntimeException("결제 금액이 일치하지 않습니다.");
            }
        } catch (Exception e) {
            throw new RuntimeException("결제 검증 중 오류가 발생했습니다: " + e.getMessage());
        }
    }


    /* 지난 1주일간 특정 기업 제품의 세일즈 금액 통계 반환 */
    @Transactional(readOnly = true)
    public Map<String, Integer> getWeeklySalesStatistics(String companyName) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        List<Object[]> results = paymentHistoryRepository.findWeeklySalesByCompany(companyName, startDate);

        Map<String, Integer> dailySales = new HashMap<>();

        // 최근 7일간의 날짜를 모두 포함하도록 초기화
        for (int i = 0; i < 7; i++) {
            String date = LocalDateTime.now().minusDays(i).toLocalDate().toString();
            dailySales.put(date, 0);
        }

        // 실제 판매 데이터로 업데이트
        for (Object[] result : results) {
            String date = ((Date) result[0]).toLocalDate().toString();
            Integer total = ((Number) result[1]).intValue();
            dailySales.put(date, total);
        }

        return dailySales;
    }

    /* 특정 기업 가장 많이 팔린 제품 top 5 정보 반환 */
    @Transactional(readOnly = true)
    public List<TopProductDTO> getTop5ProductsByCompany(String companyName) {
        List<Object[]> results = paymentHistoryRepository.findTop5ProductsByCompany(companyName);

        return results.stream().map(result ->
            TopProductDTO.builder()
                .productId(((Number) result[0]).longValue())
                .productName((String) result[1])
                .price(((Number) result[2]).intValue())
                .totalQuantity(((Number) result[3]).intValue())
                .totalSales(((Number) result[4]).longValue())
                .build()
        ).collect(Collectors.toList());
    }

    /* 지난 1주일간 특정 기업의 전체 판매 수량 반환 */
    @Transactional(readOnly = true)
    public Long getWeeklyTotalQuantity(String companyName) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        Long totalQuantity = paymentHistoryRepository.findTotalQuantityByCompany(companyName, startDate);
        return totalQuantity != null ? totalQuantity : 0L;
    }

    /* 특정 기업의 최신순 payment 트랜잭션 기록 반환 */
    @Transactional(readOnly = true)
    public List<TransactionDTO> getLatestTransactionsByCompany(String companyName, int page, int size) {
        int offset = page * size;
        List<Object[]> results = paymentHistoryRepository.findLatestTransactionsByCompany(
            companyName, size, offset);

        return results.stream().map(result ->
            TransactionDTO.builder()
                .id(((Number) result[0]).longValue())
                .impUid((String) result[1])
                .merchantUid((String) result[2])
                .amount(((Number) result[3]).intValue())
                .paymentMethod((String) result[4])
                .status((String) result[5])
                .buyerName((String) result[6])
                .buyerEmail((String) result[7])
                .createdAt(((Timestamp) result[8]).toLocalDateTime())
                .orderId(((Number) result[9]).longValue())
                .build()
        ).collect(Collectors.toList());
    }

}
