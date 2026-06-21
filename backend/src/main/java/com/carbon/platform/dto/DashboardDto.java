package com.carbon.platform.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardDto {
    private Double currentDayScore;
    private Double weeklyAverage;
    private Map<String, Double> emissionBreakdown; // Transport, Electricity, etc.
    private List<Map<String, Object>> historicData;
}