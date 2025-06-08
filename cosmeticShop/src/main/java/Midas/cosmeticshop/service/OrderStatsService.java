package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.DailyOrderStatsDTO;
import Midas.cosmeticshop.dto.MonthlyOrderStatsDTO;
import Midas.cosmeticshop.dto.YearlyOrderStatsDTO;
import Midas.cosmeticshop.entity.DailyOrderStats;
import Midas.cosmeticshop.entity.user.User;
import Midas.cosmeticshop.repository.DailyOrderStatsRepository;
import Midas.cosmeticshop.repository.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderStatsService {

    private final UserRepository UserRepo;
    private final DailyOrderStatsRepository DailyOrderStatsRepo;

    public OrderStatsService (UserRepository UserRepo, DailyOrderStatsRepository DailyOrderStatsRepo) {
        this.UserRepo = UserRepo;
        this.DailyOrderStatsRepo = DailyOrderStatsRepo;
    }

    public List<DailyOrderStatsDTO> getDailyOrderStats (LocalDate startDate, LocalDate endDate, String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        if(!user.getRole().equals("ADMIN")) {
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
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        if(!user.getRole().equals("ADMIN")) {
            throw  new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        return DailyOrderStatsRepo.findMonthlyOrderStats(startDate, endDate);
    }

    public List<YearlyOrderStatsDTO> getYearlyOrderStats (LocalDate startDate, LocalDate endDate, String userId) {
        User user = UserRepo.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자가 존재하지 않습니다."));

        if(!user.getRole().equals("ADMIN")) {
            throw  new AccessDeniedException("관리자만 접근 가능합니다.");
        }

        return DailyOrderStatsRepo.findYearlyOrderStats(startDate, endDate);
    }

}
