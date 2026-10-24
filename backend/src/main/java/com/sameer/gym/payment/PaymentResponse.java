package com.sameer.gym.payment;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentResponse(Long id, Long memberId, String memberName, Long planId, String planName,
                              int planDurationMonths, BigDecimal amount, LocalDate paymentDate) {
    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(payment.getId(), payment.getMember().getId(), payment.getMember().getName(),
                payment.getPlan().getId(), payment.getPlan().getName(), payment.getPlan().getDurationMonths(),
                payment.getAmount(), payment.getPaymentDate());
    }
}
