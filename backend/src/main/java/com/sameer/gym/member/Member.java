package com.sameer.gym.member;

import com.sameer.gym.plan.Plan;
import com.sameer.gym.attendance.Attendance;
import com.sameer.gym.payment.Payment;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "members", uniqueConstraints = {
        @UniqueConstraint(columnNames = "member_code"),
        @UniqueConstraint(columnNames = "phone"),
        @UniqueConstraint(columnNames = "email")
})
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_code", nullable = false, unique = true, length = 4)
    private String memberCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String phone;

    @Column(nullable = false, unique = true, length = 160)
    private String email;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Attendance> attendanceRecords = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    protected Member() {}

    public Member(String memberCode, String name, String phone, String email,
                  LocalDate joinDate, LocalDate expiryDate, Plan plan) {
        this.memberCode = memberCode;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.joinDate = joinDate;
        this.expiryDate = expiryDate;
        this.plan = plan;
    }

    public Long getId() { return id; }
    public String getMemberCode() { return memberCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDate getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public Plan getPlan() { return plan; }
    public void setPlan(Plan plan) { this.plan = plan; }
}
