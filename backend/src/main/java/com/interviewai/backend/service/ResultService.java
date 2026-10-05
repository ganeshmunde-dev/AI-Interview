package com.interviewai.backend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.dto.InterviewResultDTO;
import com.interviewai.backend.entity.Evaluation;
import com.interviewai.backend.entity.InterviewResult;
import com.interviewai.backend.entity.InterviewSession;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ResultService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public InterviewResultDTO convertToDTO(InterviewResult result) {
        if (result == null || result.getEvaluation() == null) return null;

        Evaluation eval = result.getEvaluation();
        InterviewSession session = eval.getSession();

        InterviewResultDTO dto = new InterviewResultDTO();
        dto.setInterviewId(String.valueOf(session.getId()));
        dto.setRole(formatRoleName(session.getRole()));
        dto.setRoleKey(session.getRole());
        dto.setDifficulty(session.getDifficulty());
        dto.setType(session.getType());
        dto.setDate(session.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        dto.setDuration(session.getQuestionCount() * 2 + " mins");
        dto.setTotalQuestions(eval.getTotalQuestions());
        dto.setAttempted(eval.getAttemptedCount());
        dto.setOverallScore(eval.getOverallScore());
        dto.setEvaluationStatus(eval.getEvaluationStatus());
        dto.setFeedbackSummary(eval.getFeedbackSummary());

        try {
            if (result.getSkillScoresJson() != null) {
                List<InterviewResultDTO.SkillScoreDTO> skills = objectMapper.readValue(
                        result.getSkillScoresJson(),
                        new TypeReference<List<InterviewResultDTO.SkillScoreDTO>>() {}
                );
                dto.setSkillScores(skills);
            }
            if (result.getStrengthsJson() != null) {
                List<String> strengths = objectMapper.readValue(
                        result.getStrengthsJson(),
                        new TypeReference<List<String>>() {}
                );
                dto.setStrengths(strengths);
            }
            if (result.getWeaknessesJson() != null) {
                List<String> weaknesses = objectMapper.readValue(
                        result.getWeaknessesJson(),
                        new TypeReference<List<String>>() {}
                );
                dto.setWeaknesses(weaknesses);
            }
            if (result.getRecommendationsJson() != null) {
                List<InterviewResultDTO.RecommendationDTO> recs = objectMapper.readValue(
                        result.getRecommendationsJson(),
                        new TypeReference<List<InterviewResultDTO.RecommendationDTO>>() {}
                );
                dto.setRecommendations(recs);
            }
        } catch (Exception e) {
            dto.setSkillScores(new ArrayList<>());
            dto.setStrengths(new ArrayList<>());
            dto.setWeaknesses(new ArrayList<>());
            dto.setRecommendations(new ArrayList<>());
        }

        return dto;
    }

    private String formatRoleName(String role) {
        if (role == null) return "Developer";
        switch (role.toLowerCase()) {
            case "frontend": return "Frontend Developer";
            case "react_dev": return "React Developer";
            case "java_dev": return "Java Developer";
            case "spring_boot": return "Spring Boot Developer";
            case "php": return "PHP Developer";
            case "fullstack": return "Java Full Stack Developer";
            case "backend": return "Backend Developer";
            case "hr": return "HR Interview Round";
            default: return role.substring(0, 1).toUpperCase() + role.substring(1);
        }
    }
}
