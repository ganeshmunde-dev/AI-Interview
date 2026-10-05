package com.interviewai.backend.controller;

import com.interviewai.backend.dto.*;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.service.AuthService;
import com.interviewai.backend.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private AuthService authService;

    @PostMapping("/interviews")
    public ResponseEntity<ApiResponse<InterviewSessionDTO>> createInterview(@Valid @RequestBody CreateInterviewRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        InterviewSessionDTO session = interviewService.createInterview(currentUser, request);
        return ResponseEntity.ok(ApiResponse.success("Interview session created", session));
    }

    @GetMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<InterviewSessionDTO>> getInterview(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        InterviewSessionDTO session = interviewService.getInterview(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview session retrieved", session));
    }

    @PostMapping("/interviews/{id}/answers")
    public ResponseEntity<ApiResponse<String>> submitAnswer(
            @PathVariable Long id,
            @Valid @RequestBody AnswerRequest request
    ) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        interviewService.submitAnswer(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Answer recorded successfully", "Saved"));
    }

    @PostMapping("/interviews/{id}/submit")
    public ResponseEntity<ApiResponse<InterviewResultDTO>> submitInterview(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        InterviewResultDTO result = interviewService.submitInterview(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview evaluated successfully", result));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<InterviewResultDTO>>> getHistory() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<InterviewResultDTO> history = interviewService.getHistory(currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview history retrieved", history));
    }
}
