package com.interviewai.backend.controller;

import com.interviewai.backend.dto.AiEvaluationRequest;
import com.interviewai.backend.dto.AiEvaluationResponse;
import com.interviewai.backend.dto.AiFollowUpRequest;
import com.interviewai.backend.dto.AiFollowUpResponse;
import com.interviewai.backend.dto.ApiResponse;
import com.interviewai.backend.service.GeminiAiService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AiEvaluationController
 *
 * Endpoints:
 * - POST /api/evaluate            - Evaluates question + answer
 * - POST /api/evaluate/follow-up  - Generates contextual follow-up question
 *
 * The API key is NEVER sent to or visible in the frontend.
 * Architecture: React → Spring Boot → Gemini AI API
 */
@RestController
@RequestMapping("/api/evaluate")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiEvaluationController {

    @Autowired
    private GeminiAiService geminiAiService;

    @PostMapping
    public ResponseEntity<ApiResponse<AiEvaluationResponse>> evaluate(
            @Valid @RequestBody AiEvaluationRequest request
    ) {
        AiEvaluationResponse evaluation = geminiAiService.evaluate(request);
        return ResponseEntity.ok(ApiResponse.success("Answer evaluated successfully", evaluation));
    }

    @PostMapping("/follow-up")
    public ResponseEntity<ApiResponse<AiFollowUpResponse>> followUp(
            @Valid @RequestBody AiFollowUpRequest request
    ) {
        AiFollowUpResponse followUpResponse = geminiAiService.generateFollowUp(request);
        return ResponseEntity.ok(ApiResponse.success("Follow-up question generated successfully", followUpResponse));
    }
}
