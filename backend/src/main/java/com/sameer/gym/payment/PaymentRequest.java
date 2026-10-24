package com.sameer.gym.payment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentRequest(
        @NotNull(message = "Choose a member") @Positive(message = "Member id must be positive") Long memberId,
        @NotNull(message = "Choose a renewal plan") @Positive(message = "Plan id must be positive") Long planId
) {}
