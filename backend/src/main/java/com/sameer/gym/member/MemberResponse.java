package com.sameer.gym.member;

import java.time.LocalDate;
import java.math.BigDecimal;

public record MemberResponse(
        Long id,
        String memberCode,
        String name,
        String phone,
        String email,
        LocalDate joinDate,
        LocalDate expiryDate,
        Long planId,
        String planName,
        int planDurationMonths,
        BigDecimal planPrice
) {
    public static MemberResponse from(Member member) {
        return new MemberResponse(
                member.getId(), member.getMemberCode(), member.getName(), member.getPhone(),
                member.getEmail(), member.getJoinDate(), member.getExpiryDate(),
                member.getPlan().getId(), member.getPlan().getName(), member.getPlan().getDurationMonths(), member.getPlan().getPrice());
    }
}
