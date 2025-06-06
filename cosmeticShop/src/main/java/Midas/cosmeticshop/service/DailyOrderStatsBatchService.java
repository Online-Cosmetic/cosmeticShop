package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.DailyOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.DailyOrderStats;
import Midas.cosmeticshop.repository.DailyOrderStatsRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class DailyOrderStatsBatchService {

    private final OrderRepository orderRepository;
    private final DailyOrderStatsRepository dailyOrderStatsRepository;

    public DailyOrderStatsBatchService (OrderRepository orderRepository, DailyOrderStatsRepository dailyOrderStatsRepository) {
        this.orderRepository = orderRepository;
        this.dailyOrderStatsRepository = dailyOrderStatsRepository;
    }

//    @Scheduled(cron = "0 0 0 * * *")
//    public void generateYesterdayStats() {
//        LocalDate date = LocalDate.now().minusDays(1);
//        LocalDateTime start = date.atStartOfDay();
//        LocalDateTime end = date.plusDays(1).atStartOfDay();
//        DailyOrderStatsBatchDTO dailyOrderStatsBatchDTO = orderRepository.findOrderStatsBetween(start, end);
//        DailyOrderStats dailyOrderStats = new DailyOrderStats();
//        dailyOrderStats.setDate(date);
//        dailyOrderStats.setTotalSales(dailyOrderStatsBatchDTO.getTotalSales());
//        dailyOrderStats.setOrderCount(dailyOrderStatsBatchDTO.getOrderCount());
//        dailyOrderStats.setTotalQuantity(dailyOrderStatsBatchDTO.getTotalQuantity());
//        dailyOrderStatsRepository.save(dailyOrderStats);
//    }


}
