package com.interviewai.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * AiCoachingResponse
 *
 * Structured coaching analysis returned by Gemini / Spring Boot.
 */
public class AiCoachingResponse {

    private String executiveSummary;
    private List<Map<String, Object>> strengths;
    private List<Map<String, Object>> weaknesses;
    private List<Map<String, Object>> studyRoadmap;
    private List<Map<String, Object>> practiceQuestions;
    private Map<String, Object> nextInterviewRecommendation;
    private String source; // "AI" or "RULE_BASED_FALLBACK"

    public AiCoachingResponse() {}

    public String getExecutiveSummary() {
        return executiveSummary;
    }

    public void setExecutiveSummary(String executiveSummary) {
        this.executiveSummary = executiveSummary;
    }

    public List<Map<String, Object>> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<Map<String, Object>> strengths) {
        this.strengths = strengths;
    }

    public List<Map<String, Object>> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<Map<String, Object>> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<Map<String, Object>> getStudyRoadmap() {
        return studyRoadmap;
    }

    public void setStudyRoadmap(List<Map<String, Object>> studyRoadmap) {
        this.studyRoadmap = studyRoadmap;
    }

    public List<Map<String, Object>> getPracticeQuestions() {
        return practiceQuestions;
    }

    public void setPracticeQuestions(List<Map<String, Object>> practiceQuestions) {
        this.practiceQuestions = practiceQuestions;
    }

    public Map<String, Object> getNextInterviewRecommendation() {
        return nextInterviewRecommendation;
    }

    public void setNextInterviewRecommendation(Map<String, Object> nextInterviewRecommendation) {
        this.nextInterviewRecommendation = nextInterviewRecommendation;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
