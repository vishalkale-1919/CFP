package com.carbon.platform.repository;

import com.carbon.platform.model.CarbonRecord;
import com.carbon.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CarbonRecordRepository extends JpaRepository<CarbonRecord, Long> {
    Optional<CarbonRecord> findByUserAndRecordDate(User user, LocalDate date);
    List<CarbonRecord> findByUserAndRecordDateBetweenOrderByRecordDateAsc(User user, LocalDate start, LocalDate end);
}