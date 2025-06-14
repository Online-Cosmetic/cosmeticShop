package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO;
import Midas.cosmeticshop.dto.DailyOrderStatsDTO;
import Midas.cosmeticshop.dto.MonthlyOrderStatsDTO;
import Midas.cosmeticshop.dto.YearlyOrderStatsDTO;
import Midas.cosmeticshop.entity.DailyOrderStats;
import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.repository.CouponRepository;
import Midas.cosmeticshop.repository.DailyOrderStatsRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import Midas.cosmeticshop.repository.PaymentHistoryRepository;
import Midas.cosmeticshop.repository.user.AdminRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderStatsService {

    private final AdminRepository AdminRepo;
    private final DailyOrderStatsRepository DailyOrderStatsRepo;
    private final OrderRepository orderRepository;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final CouponRepository couponRepository;

    public OrderStatsService (
            AdminRepository AdminRepo, 
            DailyOrderStatsRepository DailyOrderStatsRepo,
            OrderRepository orderRepository,
            PaymentHistoryRepository paymentHistoryRepository,
            CouponRepository couponRepository) {
        this.AdminRepo = AdminRepo;
        this.DailyOrderStatsRepo = DailyOrderStatsRepo;
        this.orderRepository = orderRepository;
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.couponRepository = couponRepository;
    }

    public List<DailyOrderStatsDTO> getDailyOrderStats (LocalDate startDate, LocalDate endDate, String userId) {
        Admin admin = AdminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));

        if(!admin.getRole().equals("ADMIN")) {
            throw  new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        List<DailyOrderStats> dailyOrderStatsList = DailyOrderStatsRepo.findByDateBetween(startDate, endDate);
        List<DailyOrderStatsDTO> dailyOrderStatsDTOList = new ArrayList<>();
        for (DailyOrderStats stats : dailyOrderStatsList) {
            dailyOrderStatsDTOList.add(new DailyOrderStatsDTO(stats));
        }
        return dailyOrderStatsDTOList;
    }

    public List<MonthlyOrderStatsDTO> getMonthlyOrderStats (LocalDate startDate, LocalDate endDate, String userId) {
        Admin admin = AdminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));

        if(!admin.getRole().equals("ADMIN")) {
            throw  new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        return DailyOrderStatsRepo.findMonthlyOrderStats(startDate, endDate);
    }

    public List<YearlyOrderStatsDTO> getYearlyOrderStats (LocalDate startDate, LocalDate endDate, String userId) {
        Admin admin = AdminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));

        if(!admin.getRole().equals("ADMIN")) {
            throw  new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        return DailyOrderStatsRepo.findYearlyOrderStats(startDate, endDate);
    }

    /**
     * Get dashboard statistics including total orders, active users, and active coupons
     * @param userId The ID of the admin user
     * @return A map containing the dashboard statistics
     */
    public Map<String, Object> getDashboardStats(String userId) {
        Admin admin = AdminRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("관리자가 존재하지 않습니다."));

        if(!admin.getRole().equals("ADMIN")) {
            throw new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        Map<String, Object> stats = new HashMap<>();

        // Count total orders
        long totalOrders = orderRepository.count();
        stats.put("totalOrders", totalOrders);

        // Count active users (distinct users who have made payments)
        long activeUsers = paymentHistoryRepository.count();
        stats.put("activeUsers", activeUsers);

        // Count active coupons
        long activeCoupons = couponRepository.count();
        stats.put("activeCoupons", activeCoupons);

        // Calculate total sales from payment history
        LocalDateTime startDate = LocalDateTime.of(2000, 1, 1, 0, 0); // A date far in the past
        LocalDateTime endDate = LocalDateTime.now();
        DailyOrderStatsBatchDTO salesStats = orderRepository.findOrderStatsBetween(startDate, endDate);
        stats.put("totalSales", salesStats.getTotalSales());

        return stats;
    }
}
