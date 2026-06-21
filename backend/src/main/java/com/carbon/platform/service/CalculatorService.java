package com.carbon.platform.service;

import com.carbon.platform.dto.CarbonInputDto;
import com.carbon.platform.model.CarbonRecord;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.CarbonRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class CalculatorService {

    @Autowired 
    private CarbonRecordRepository carbonRecordRepository;

    public double calculateTransport(String mode, double distance) {
        if (mode == null || distance < 0) return 0.0;
        return switch (mode.trim().toLowerCase()) {
            case "bike" -> distance * 0.08;
            case "car" -> distance * 0.21;
            case "bus" -> distance * 0.10;
            case "cycle" -> 0.0;
            default -> 0.0;
        };
    }

    public double calculateElectricity(double units) {
        if (units < 0) return 0.0;
        return units * 0.82;
    }

    public double calculateFood(String profile) {
        if (profile == null) return 3.0; // Fallback to safe mid-value
        return switch (profile.trim().toLowerCase()) {
            case "vegetarian" -> 1.5;
            case "mixed" -> 3.0;
            case "nonveg" -> 5.0;
            default -> 3.0;
        };
    }

    public double calculateShopping(String level) {
        if (level == null) return 15.0; // Fallback to safe mid-value
        return switch (level.trim().toLowerCase()) {
            case "low" -> 5.0;
            case "medium" -> 15.0;
            case "high" -> 30.0;
            default -> 15.0;
        };
    }

    public CarbonRecord saveAndAggregate(CarbonInputDto dto, User user) {
        double transport = calculateTransport(dto.getTransportMode(), dto.getTransportDistance());
        double electricity = calculateElectricity(dto.getElectricityUnits());
        double food = calculateFood(dto.getFoodType());
        double shopping = calculateShopping(dto.getShoppingLevel());
        double totalDaily = transport + electricity + food + shopping;

        CarbonRecord record = carbonRecordRepository.findByUserAndRecordDate(user, LocalDate.now())
                .orElse(CarbonRecord.builder().user(user).recordDate(LocalDate.now()).build());

        record.setTransportEmission(transport);
        record.setElectricityEmission(electricity);
        record.setFoodEmission(food);
        record.setShoppingEmission(shopping);
        record.setTotalEmission(totalDaily);

        return carbonRecordRepository.save(record);
    }
}