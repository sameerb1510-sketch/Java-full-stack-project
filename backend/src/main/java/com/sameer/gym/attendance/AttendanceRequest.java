package com.sameer.gym.attendance;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AttendanceRequest(
        @NotBlank(message = "Enter a member code")
        @Pattern(regexp = "\\d{4}", message = "Member code must be 4 digits")
        String memberCode
) {}
