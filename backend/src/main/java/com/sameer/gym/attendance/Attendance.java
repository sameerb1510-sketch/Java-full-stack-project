package com.sameer.gym.attendance;

import com.sameer.gym.member.Member;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "attendance", uniqueConstraints =
        @UniqueConstraint(name = "uq_attendance_member_day", columnNames = {"member_id", "check_in_date"}))
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    protected Attendance() {}

    public Attendance(Member member, LocalDate checkInDate) {
        this.member = member;
        this.checkInDate = checkInDate;
    }

    public Long getId() { return id; }
    public Member getMember() { return member; }
    public LocalDate getCheckInDate() { return checkInDate; }
}
