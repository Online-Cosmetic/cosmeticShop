package Midas.cosmeticshop.service;

import Midas.cosmeticshop.dto.HourlyProductOrderStatsBatchDTO;
import Midas.cosmeticshop.entity.product.HourlyProductOrderStats;
import Midas.cosmeticshop.repository.HourlyProductOrderStatsRepository;
import Midas.cosmeticshop.repository.OrderRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class HourlyProductOrderStatsBatchService {


    private final OrderRepository orderRepository;
    private final HourlyProductOrderStatsRepository hourlyProductOrderStatsRepository;

    public HourlyProductOrderStatsBatchService(OrderRepository orderRepository, HourlyProductOrderStatsRepository hourlyProductOrderStatsRepository) {
        this.orderRepository = orderRepository;
        this.hourlyProductOrderStatsRepository = hourlyProductOrderStatsRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void generateLastHourStats() {
        LocalDateTime hour = LocalDateTime.now().minusHours(1);
        LocalDateTime start = hour.truncatedTo(ChronoUnit.HOURS);
        LocalDateTime end = start.plusHours(1);
        List<HourlyProductOrderStatsBatchDTO> hourlyProductOrderStatsBatchDTOList = orderRepository.findProductOrderStatsBetween(start, end);
        for(HourlyProductOrderStatsBatchDTO dto : hourlyProductOrderStatsBatchDTOList) {
            HourlyProductOrderStats stats = new HourlyProductOrderStats();
            stats.setHour(dto.getHour());
            stats.setProduct(dto.getProduct());
            stats.setQuantity(dto.getQuantity());
            hourlyProductOrderStatsRepository.save(stats);
        }
    }
}
