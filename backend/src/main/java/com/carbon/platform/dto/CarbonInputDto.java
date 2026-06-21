package com.carbon.platform.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CarbonInputDto {
    @NotNull private String transportMode; // Bike, Car, Bus, Cycle
    @NotNull private Double transportDistance; // in km
    @NotNull private Double electricityUnits;
    @NotNull private String foodType; // Vegetarian, Mixed, NonVeg
    @NotNull private String shoppingLevel; // Low, Medium, High
}