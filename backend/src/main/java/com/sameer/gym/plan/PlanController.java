package com.sameer.gym.plan;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plans")
public class PlanController {
    private final PlanService planService;

    public PlanController(PlanService planService) {
        this.planService = planService;
    }

    @GetMapping
    public List<Plan> findAll() { return planService.findAll(); }

    @GetMapping("/{id}")
    public Plan findById(@PathVariable Long id) { return planService.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Plan create(@Valid @RequestBody PlanRequest request) { return planService.create(request); }

    @PutMapping("/{id}")
    public Plan update(@PathVariable Long id, @Valid @RequestBody PlanRequest request) {
        return planService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { planService.delete(id); }
}
