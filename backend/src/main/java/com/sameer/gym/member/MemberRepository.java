package com.sameer.gym.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMemberCode(String memberCode);
    boolean existsByMemberCode(String memberCode);
    boolean existsByPhone(String phone);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhoneAndIdNot(String phone, Long id);
    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
    boolean existsByPlanId(Long planId);
    List<Member> findByNameContainingIgnoreCaseOrderByNameAsc(String name);
    List<Member> findByExpiryDateLessThanEqualOrderByExpiryDateAsc(LocalDate date);
    long countByExpiryDateGreaterThanEqual(LocalDate date);
    long countByExpiryDateBefore(LocalDate date);
}
