package Midas.cosmeticshop.service;

import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import Midas.cosmeticshop.dto.payment.PaymentCreateRequest;
import Midas.cosmeticshop.dto.payment.PaymentProcessRequest;
import Midas.cosmeticshop.dto.payment.PaymentCompleteRequest;
import Midas.cosmeticshop.entity.PaymentHistory;
import Midas.cosmeticshop.repository.PaymentHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class PaymentService {

    private final IamportClient iamportClient;
    private final PaymentHistoryRepository paymentHistoryRepository;

    public PaymentService(IamportClient iamportClient, PaymentHistoryRepository paymentHistoryRepository) {
        this.iamportClient = iamportClient;
        this.paymentHistoryRepository = paymentHistoryRepository;
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
}
