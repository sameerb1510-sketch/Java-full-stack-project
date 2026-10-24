package com.sameer.gym.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record MemberRequest(
        @NotBlank(message = "Name is required")
        String name,
        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "\\d{10}", message = "Phone must be exactly 10 digits")
        String phone,
        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,
        @NotNull(message = "Join date is required")
        @PastOrPresent(message = "Join date cannot be in the future")
        LocalDate joinDate,
        @NotNull(message = "Choose a membership plan")
        Long planId
) {}
