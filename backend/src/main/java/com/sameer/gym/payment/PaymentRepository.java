package com.sameer.gym.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByMemberIdOrderByPaymentDateDesc(Long memberId);
    boolean existsByMemberId(Long memberId);
    boolean existsByPlanId(Long planId);
}
