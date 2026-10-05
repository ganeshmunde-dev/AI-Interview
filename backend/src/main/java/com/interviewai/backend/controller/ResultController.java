package com.interviewai.backend.controller;

import com.interviewai.backend.dto.ApiResponse;
import com.interviewai.backend.dto.InterviewResultDTO;
import com.interviewai.backend.entity.User;
import com.interviewai.backend.service.AuthService;
import com.interviewai.backend.service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResultController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private AuthService authService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InterviewResultDTO>> getResult(@PathVariable Long id) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        InterviewResultDTO result = interviewService.getResult(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Interview result retrieved successfully", result));
    }
}
