package com.sameer.gym.attendance;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {
    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) { this.attendanceService = attendanceService; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AttendanceResponse checkIn(@Valid @RequestBody AttendanceRequest request) {
        return attendanceService.checkIn(request.memberCode().trim());
    }

    @GetMapping("/{memberId}")
    public List<AttendanceResponse> history(@PathVariable Long memberId) {
        return attendanceService.history(memberId);
    }
}
