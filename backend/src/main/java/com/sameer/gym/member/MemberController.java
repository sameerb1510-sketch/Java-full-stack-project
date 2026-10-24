package com.sameer.gym.member;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) { this.memberService = memberService; }

    @GetMapping
    public List<MemberResponse> findAll() { return memberService.findAll(); }

    @GetMapping("/search")
    public List<MemberResponse> search(@RequestParam(defaultValue = "") String name) {
        return memberService.search(name);
    }

    @GetMapping("/expired")
    public List<MemberResponse> expired() { return memberService.findExpiredOrExpiringSoon(); }

    @GetMapping("/{id}")
    public MemberResponse findById(@PathVariable Long id) { return memberService.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse create(@Valid @RequestBody MemberRequest request) {
        return memberService.create(request);
    }

    @PutMapping("/{id}")
    public MemberResponse update(@PathVariable Long id, @Valid @RequestBody MemberRequest request) {
        return memberService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { memberService.delete(id); }
}
