package com.sameer.gym.attendance;

import com.sameer.gym.member.Member;

import java.time.LocalDate;

public record AttendanceResponse(Long id, Long memberId, String memberName, String memberCode, LocalDate checkInDate) {
    public static AttendanceResponse from(Attendance attendance) {
        Member member = attendance.getMember();
        return new AttendanceResponse(attendance.getId(), member.getId(), member.getName(),
                member.getMemberCode(), attendance.getCheckInDate());
    }
}
