package com.sameer.gym.payment;

import com.sameer.gym.error.MemberNotFoundException;
import com.sameer.gym.member.Member;
import com.sameer.gym.member.MemberRepository;
import com.sameer.gym.error.InvalidPlanException;
import com.sameer.gym.plan.Plan;
import com.sameer.gym.plan.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;

    public PaymentService(PaymentRepository paymentRepository, MemberRepository memberRepository,
                          PlanRepository planRepository) {
        this.paymentRepository = paymentRepository;
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
    }

    public PaymentResponse create(Long memberId, Long planId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberNotFoundException(memberId));
        Plan renewalPlan = planRepository.findById(planId)
                .orElseThrow(() -> new InvalidPlanException("Choose a valid renewal plan"));
        LocalDate today = LocalDate.now();
        // Keep remaining time for active memberships; renew expired ones from today.
        LocalDate renewalBase = member.getExpiryDate().isAfter(today) ? member.getExpiryDate() : today;
        member.setPlan(renewalPlan);
        member.setExpiryDate(renewalBase.plusMonths(renewalPlan.getDurationMonths()));
        memberRepository.save(member);
        return PaymentResponse.from(paymentRepository.save(new Payment(member, renewalPlan, renewalPlan.getPrice(), today)));
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> history(Long memberId) {
        if (!memberRepository.existsById(memberId)) throw new MemberNotFoundException(memberId);
        return paymentRepository.findByMemberIdOrderByPaymentDateDesc(memberId)
                .stream().map(PaymentResponse::from).toList();
    }
}
