package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.DailyOrderStatsDTO;
import Midas.cosmeticshop.dto.MonthlyOrderStatsDTO;
import Midas.cosmeticshop.dto.YearlyOrderStatsDTO;
import Midas.cosmeticshop.entity.DailyOrderStats;
import Midas.cosmeticshop.entity.user.Admin;
import Midas.cosmeticshop.repository.DailyOrderStatsRepository;
import Midas.cosmeticshop.repository.user.AdminRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderStatsService {

    private final AdminRepository AdminRepo;
    private final DailyOrderStatsRepository DailyOrderStatsRepo;

    public OrderStatsService (AdminRepository AdminRepo, DailyOrderStatsRepository DailyOrderStatsRepo) {
        this.AdminRepo = AdminRepo;
        this.DailyOrderStatsRepo = DailyOrderStatsRepo;
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

}
