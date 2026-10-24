package com.sameer.gym.plan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PlanRequest(
        @NotBlank(message = "Plan name is required") String name,
        @Min(value = 1, message = "Plan duration must be at least one month") int durationMonths,
        @NotNull(message = "Plan price is required")
        @DecimalMin(value = "0.0", message = "Price cannot be negative") BigDecimal price
) {}
