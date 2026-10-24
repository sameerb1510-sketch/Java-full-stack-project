package com.sameer.gym.member;

import com.sameer.gym.error.ConflictException;
import com.sameer.gym.error.InvalidPlanException;
import com.sameer.gym.error.MemberNotFoundException;
import com.sameer.gym.plan.Plan;
import com.sameer.gym.plan.PlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final PlanRepository planRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public MemberService(MemberRepository memberRepository, PlanRepository planRepository) {
        this.memberRepository = memberRepository;
        this.planRepository = planRepository;
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> findAll() {
        return memberRepository.findAll().stream().map(MemberResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public MemberResponse findById(Long id) {
        return MemberResponse.from(getMember(id));
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> search(String name) {
        return memberRepository.findByNameContainingIgnoreCaseOrderByNameAsc(name == null ? "" : name.trim())
                .stream().map(MemberResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> findExpiredOrExpiringSoon() {
        return memberRepository.findByExpiryDateLessThanEqualOrderByExpiryDateAsc(LocalDate.now().plusDays(7))
                .stream().map(MemberResponse::from).toList();
    }

    public MemberResponse create(MemberRequest request) {
        validateUniqueDetails(request, null);
        Plan plan = findPlan(request.planId());
        LocalDate expiryDate = request.joinDate().plusMonths(plan.getDurationMonths());
        Member member = new Member(generateUniqueMemberCode(), request.name().trim(), request.phone().trim(),
                request.email().trim().toLowerCase(), request.joinDate(), expiryDate, plan);
        return MemberResponse.from(memberRepository.save(member));
    }

    public MemberResponse update(Long id, MemberRequest request) {
        Member member = getMember(id);
        validateUniqueDetails(request, id);
        Plan plan = findPlan(request.planId());
        member.setName(request.name().trim());
        member.setPhone(request.phone().trim());
        member.setEmail(request.email().trim().toLowerCase());
        member.setJoinDate(request.joinDate());
        member.setPlan(plan);
        member.setExpiryDate(request.joinDate().plusMonths(plan.getDurationMonths()));
        return MemberResponse.from(memberRepository.save(member));
    }

    public void delete(Long id) {
        memberRepository.delete(getMember(id));
    }

    @Transactional(readOnly = true)
    public Member getMember(Long id) {
        return memberRepository.findById(id).orElseThrow(() -> new MemberNotFoundException(id));
    }

    private Plan findPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new InvalidPlanException("Choose a valid membership plan"));
    }

    private void validateUniqueDetails(MemberRequest request, Long excludedId) {
        boolean duplicatePhone = excludedId == null
                ? memberRepository.existsByPhone(request.phone().trim())
                : memberRepository.existsByPhoneAndIdNot(request.phone().trim(), excludedId);
        if (duplicatePhone) throw new ConflictException("A member with that phone number already exists");

        String email = request.email().trim();
        boolean duplicateEmail = excludedId == null
                ? memberRepository.existsByEmailIgnoreCase(email)
                : memberRepository.existsByEmailIgnoreCaseAndIdNot(email, excludedId);
        if (duplicateEmail) throw new ConflictException("A member with that email address already exists");
    }

    private String generateUniqueMemberCode() {
        // Check each random four-digit value before saving it so codes stay unique.
        for (int attempt = 0; attempt < 100; attempt++) {
            String code = Integer.toString(1000 + secureRandom.nextInt(9000));
            if (!memberRepository.existsByMemberCode(code)) return code;
        }
        throw new ConflictException("Could not generate a member code. Please try again.");
    }
}
