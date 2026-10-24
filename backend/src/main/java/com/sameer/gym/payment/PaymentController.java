package com.sameer.gym.payment;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse create(@Valid @RequestBody PaymentRequest request) {
        return paymentService.create(request.memberId(), request.planId());
    }

    @GetMapping("/{memberId}")
    public List<PaymentResponse> history(@PathVariable Long memberId) {
        return paymentService.history(memberId);
    }
}
