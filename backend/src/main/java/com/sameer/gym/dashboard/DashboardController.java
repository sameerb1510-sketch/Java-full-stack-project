package com.sameer.gym.dashboard;

import com.sameer.gym.member.MemberRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
public class DashboardController {
    private final MemberRepository memberRepository;

    public DashboardController(MemberRepository memberRepository) { this.memberRepository = memberRepository; }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        LocalDate today = LocalDate.now();
        long expiringSoon = memberRepository.findByExpiryDateLessThanEqualOrderByExpiryDateAsc(today.plusDays(7))
                .stream().filter(member -> !member.getExpiryDate().isBefore(today)).count();
        return new DashboardResponse(memberRepository.count(),
                memberRepository.countByExpiryDateGreaterThanEqual(today),
                memberRepository.countByExpiryDateBefore(today), expiringSoon);
    }
}
