package com.sameer.gym.config;

import com.sameer.gym.member.Member;
import com.sameer.gym.member.MemberRepository;
import com.sameer.gym.payment.Payment;
import com.sameer.gym.payment.PaymentRepository;
import com.sameer.gym.plan.Plan;
import com.sameer.gym.plan.PlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DemoDataInitializer {
    @Bean
    CommandLineRunner seedDemoData(PlanRepository plans, MemberRepository members, PaymentRepository payments) {
        return args -> {
            // Seed only empty tables so restarting the app never overwrites user data.
            if (plans.count() == 0) {
                plans.saveAll(List.of(
                        new Plan("Monthly", 1, new BigDecimal("999.00")),
                        new Plan("Quarterly", 3, new BigDecimal("2499.00")),
                        new Plan("Yearly", 12, new BigDecimal("8999.00"))));
            }
            if (members.count() == 0) {
                Plan monthly = plans.findAll().stream().filter(plan -> plan.getName().equalsIgnoreCase("Monthly")).findFirst().orElseThrow();
                Plan quarterly = plans.findAll().stream().filter(plan -> plan.getName().equalsIgnoreCase("Quarterly")).findFirst().orElseThrow();
                Plan yearly = plans.findAll().stream().filter(plan -> plan.getName().equalsIgnoreCase("Yearly")).findFirst().orElseThrow();
                LocalDate today = LocalDate.now();
                members.saveAll(List.of(
                        sample("4102", "Aarav Sharma", "9876501201", "aarav@example.com", today.minusMonths(1), today, monthly),
                        sample("5827", "Diya Patel", "9876501202", "diya@example.com", today.minusMonths(3), today.plusDays(3), quarterly),
                        sample("7364", "Kabir Mehta", "9876501203", "kabir@example.com", today, today.plusMonths(12), yearly),
                        sample("2941", "Mira Iyer", "9876501204", "mira@example.com", today.minusMonths(1).minusDays(2), today.minusDays(2), monthly),
                        sample("8635", "Reyansh Rao", "9876501205", "reyansh@example.com", today.minusMonths(6), today.minusMonths(3), quarterly)));
            }

            seedSamplePaymentHistory(members, payments);
        };
    }

    private void seedSamplePaymentHistory(MemberRepository members, PaymentRepository payments) {
        LocalDate today = LocalDate.now();
        List<String> sampleEmails = List.of("aarav@example.com", "diya@example.com", "kabir@example.com",
                "mira@example.com", "reyansh@example.com");
        for (Member member : members.findAll()) {
            if (sampleEmails.contains(member.getEmail()) && !payments.existsByMemberId(member.getId())) {
                payments.saveAll(List.of(
                        new Payment(member, member.getPlan(), member.getPlan().getPrice(), today.minusMonths(2)),
                        new Payment(member, member.getPlan(), member.getPlan().getPrice(), today.minusMonths(1))));
            }
        }
    }

    private Member sample(String code, String name, String phone, String email,
                          LocalDate joinDate, LocalDate expiryDate, Plan plan) {
        return new Member(code, name, phone, email, joinDate, expiryDate, plan);
    }
}
