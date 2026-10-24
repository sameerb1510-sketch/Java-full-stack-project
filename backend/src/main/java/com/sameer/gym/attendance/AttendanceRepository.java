package com.sameer.gym.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByMemberIdAndCheckInDate(Long memberId, LocalDate checkInDate);
    List<Attendance> findByMemberIdOrderByCheckInDateDesc(Long memberId);
}
