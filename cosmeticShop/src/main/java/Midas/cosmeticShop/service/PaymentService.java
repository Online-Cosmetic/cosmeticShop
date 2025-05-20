//package Midas.cosmeticshop.service;
//
//import Midas.cosmeticshop.repository.PaymentRepository;
//import com.siot.IamportRestClient.IamportClient;
//import com.siot.IamportRestClient.response.IamportResponse;
//import com.siot.IamportRestClient.response.Payment;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import java.time.LocalDateTime;
//
//@Service
//public class PaymentService {
//
//    private final IamportClient iamportClient;
//    private final PaymentRepository paymentRepo;
//
//    public PaymentService(IamportClient iamportClient, PaymentRepository paymentRepo) {
//        this.iamportClient = iamportClient;
//        this.paymentRepo = paymentRepo;
//    }
//
//    @Transactional
//    public void confirmPayment(String impUid, Long orderId) throws Exception {
//        // 1) Iamport 에서 결제 정보 조회
//        IamportResponse<Payment> resp = iamportClient.paymentByImpUid(impUid);
//        if (!resp.getResponse().getStatus().equals("paid")) {
//            throw new IllegalStateException("결제 상태가 유효하지 않습니다.");
//        }
//
//        Payment p = resp.getResponse();
//        // 2) DB에 저장
//        Payment entity = new Payment();
//        entity.setImpUid(impUid);
//        entity.setOrderId(orderId);
//        entity.setAmount(p.getAmount());
//        entity.setPaymentMethod(p.getPayMethod());
//        entity.setPaymentStatus(p.getStatus());
//        entity.setPaidAt(LocalDateTime.parse(p.getPaidAt())); // ISO 포맷이라면 parse 가능
//        paymentRepo.save(entity);
//    }
//}
