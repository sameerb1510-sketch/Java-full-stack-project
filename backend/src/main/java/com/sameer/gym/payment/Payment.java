package com.sameer.gym.payment;

import com.sameer.gym.member.Member;
import com.sameer.gym.plan.Plan;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    protected Payment() {}

    public Payment(Member member, Plan plan, BigDecimal amount, LocalDate paymentDate) {
        this.member = member;
        this.plan = plan;
        this.amount = amount;
        this.paymentDate = paymentDate;
    }

    public Long getId() { return id; }
    public Member getMember() { return member; }
    public Plan getPlan() { return plan; }
    public BigDecimal getAmount() { return amount; }
    public LocalDate getPaymentDate() { return paymentDate; }
}
