package com.carbon.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "carbon_records", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "record_date"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarbonRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "record_date", nullable = false)
    private LocalDate recordDate;

    private Double transportEmission;
    private Double electricityEmission;
    private Double foodEmission;
    private Double shoppingEmission;
    private Double totalEmission;
}