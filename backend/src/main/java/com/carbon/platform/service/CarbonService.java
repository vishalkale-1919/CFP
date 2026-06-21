package com.carbon.platform.service;

import com.carbon.platform.dto.CarbonInputDto;
import com.carbon.platform.model.CarbonRecord;
import com.carbon.platform.model.User;
import com.carbon.platform.repository.CarbonRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class CarbonService {

    @Autowired private CarbonRecordRepository carbonRecordRepository;

    public CarbonRecord calculateAndSave(CarbonInputDto dto, User user) {
        // Core Logic Emission constants matching design
        double transportFactor = switch (dto.getTransportMode().toLowerCase()) {
            case "bike" -> 0.08; case "car" -> 0.21; case "bus" -> 0.10; default -> 0.0;
        };
        double transportEmission = dto.getTransportDistance() * transportFactor;
        double electricityEmission = dto.getElectricityUnits() * 0.82;
        double foodEmission = switch (dto.getFoodType().toLowerCase()) {
            case "vegetarian" -> 1.5; case "mixed" -> 3.0; default -> 5.0;
        };
        double shoppingEmission = switch (dto.getShoppingLevel().toLowerCase()) {
            case "low" -> 5.0; case "medium" -> 15.0; default -> 30.0;
        };

        double totalEmission = transportEmission + electricityEmission + foodEmission + shoppingEmission;

        CarbonRecord record = carbonRecordRepository.findByUserAndRecordDate(user, LocalDate.now())
                .orElse(CarbonRecord.builder().user(user).recordDate(LocalDate.now()).build());

        record.setTransportEmission(transportEmission);
        record.setElectricityEmission(electricityEmission);
        record.setFoodEmission(foodEmission);
        record.setShoppingEmission(shoppingEmission);
        record.setTotalEmission(totalEmission);

        return carbonRecordRepository.save(record);
    }
}