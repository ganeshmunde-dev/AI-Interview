package com.interviewai.backend.controller;

import com.interviewai.backend.dto.AiCoachChatRequest;
import com.interviewai.backend.dto.AiCoachChatResponse;
import com.interviewai.backend.dto.AiCoachingRequest;
import com.interviewai.backend.dto.AiCoachingResponse;
import com.interviewai.backend.service.GeminiAiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AiCoachingController
 *
 * REST Controller for Candidate AI Coaching and Interactive Coach Chat.
 * Accessible at:
 *   POST /api/coaching/analyze
 *   POST /api/coaching/chat
 */
@RestController
@RequestMapping("/api/coaching")
@CrossOrigin(origins = "*")
public class AiCoachingController {

    private static final Logger log = LoggerFactory.getLogger(AiCoachingController.class);

    private final GeminiAiService geminiAiService;

    public AiCoachingController(GeminiAiService geminiAiService) {
        this.geminiAiService = geminiAiService;
    }

    /**
     * Analyze candidate history and return structured AI coaching advice, roadmap, and practice questions.
     */
    @PostMapping("/analyze")
    public ResponseEntity<AiCoachingResponse> analyze(@RequestBody AiCoachingRequest request) {
        log.info("[AiCoachingController] Generating personalized coaching for role: {}, score: {}%",
                request.getRole(), request.getOverallScore());

        AiCoachingResponse response = geminiAiService.generateCoaching(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Interactive chat with AI Coach based on candidate's performance context.
     */
    @PostMapping("/chat")
    public ResponseEntity<AiCoachChatResponse> chat(@RequestBody AiCoachChatRequest request) {
        log.info("[AiCoachingController] AI Coach chat inquiry for role: {}", request.getRole());

        AiCoachChatResponse response = geminiAiService.chatWithCoach(request);
        return ResponseEntity.ok(response);
    }
}
