package com.sameer.gym.attendance;

import com.sameer.gym.error.ConflictException;
import com.sameer.gym.error.InvalidPlanException;
import com.sameer.gym.error.MemberNotFoundException;
import com.sameer.gym.member.Member;
import com.sameer.gym.member.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final MemberRepository memberRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, MemberRepository memberRepository) {
        this.attendanceRepository = attendanceRepository;
        this.memberRepository = memberRepository;
    }

    public AttendanceResponse checkIn(String memberCode) {
        Member member = memberRepository.findByMemberCode(memberCode)
                .orElseThrow(() -> new MemberNotFoundException("Member code " + memberCode + " was not found"));
        LocalDate today = LocalDate.now();
        if (member.getExpiryDate().isBefore(today)) {
            throw new InvalidPlanException("This membership expired on " + member.getExpiryDate());
        }
        // The database unique key provides a second guard against same-day duplicate check-ins.
        if (attendanceRepository.existsByMemberIdAndCheckInDate(member.getId(), today)) {
            throw new ConflictException("This member has already checked in today");
        }
        return AttendanceResponse.from(attendanceRepository.save(new Attendance(member, today)));
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> history(Long memberId) {
        if (!memberRepository.existsById(memberId)) throw new MemberNotFoundException(memberId);
        return attendanceRepository.findByMemberIdOrderByCheckInDateDesc(memberId)
                .stream().map(AttendanceResponse::from).toList();
    }
}
