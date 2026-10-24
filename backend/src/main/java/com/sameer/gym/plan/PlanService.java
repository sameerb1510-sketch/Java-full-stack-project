package com.sameer.gym.plan;

import com.sameer.gym.error.ConflictException;
import com.sameer.gym.error.InvalidPlanException;
import com.sameer.gym.member.MemberRepository;
import com.sameer.gym.payment.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PlanService {
    private final PlanRepository planRepository;
    private final MemberRepository memberRepository;
    private final PaymentRepository paymentRepository;

    public PlanService(PlanRepository planRepository, MemberRepository memberRepository,
                       PaymentRepository paymentRepository) {
        this.planRepository = planRepository;
        this.memberRepository = memberRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public List<Plan> findAll() {
        return planRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Plan findById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new InvalidPlanException("Plan with id " + id + " was not found"));
    }

    public Plan create(PlanRequest request) {
        if (planRepository.existsByNameIgnoreCase(request.name().trim())) {
            throw new ConflictException("A plan with that name already exists");
        }
        return planRepository.save(new Plan(request.name().trim(), request.durationMonths(), request.price()));
    }

    public Plan update(Long id, PlanRequest request) {
        Plan plan = findById(id);
        if (planRepository.existsByNameIgnoreCaseAndIdNot(request.name().trim(), id)) {
            throw new ConflictException("A plan with that name already exists");
        }
        plan.setName(request.name().trim());
        plan.setDurationMonths(request.durationMonths());
        plan.setPrice(request.price());
        return planRepository.save(plan);
    }

    public void delete(Long id) {
        Plan plan = findById(id);
        if (memberRepository.existsByPlanId(id) || paymentRepository.existsByPlanId(id)) {
            throw new ConflictException("This plan is assigned to a member or appears in payment history.");
        }
        planRepository.delete(plan);
    }
}
