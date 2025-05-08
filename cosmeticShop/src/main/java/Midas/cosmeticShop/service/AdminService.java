package Midas.cosmeticShop.service;

import Midas.cosmeticShop.repository.ReviewRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final ReviewRepository ReviewRepo;

    public AdminService (ReviewRepository ReviewRepo) {
        this.ReviewRepo = ReviewRepo;
    }


}
