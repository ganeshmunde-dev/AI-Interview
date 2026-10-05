package com.interviewai.backend.controller;

import com.interviewai.backend.dto.ApiResponse;
import com.interviewai.backend.dto.QuestionDTO;
import com.interviewai.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<QuestionDTO>>> getQuestions(
            @RequestParam(defaultValue = "frontend") String role,
            @RequestParam(defaultValue = "medium") String difficulty,
            @RequestParam(defaultValue = "technical") String type,
            @RequestParam(defaultValue = "10") int count
    ) {
        List<QuestionDTO> questions = questionService.generateQuestionsForSession(role, difficulty, type, count);
        return ResponseEntity.ok(ApiResponse.success("Questions retrieved successfully", questions));
    }
}
