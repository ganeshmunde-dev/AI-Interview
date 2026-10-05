package com.interviewai.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * AiCoachingRequest
 *
 * DTO sent from the React frontend to /api/coaching/analyze.
 * Contains aggregated performance metrics from actual candidate history.
 */
public class AiCoachingRequest {

    private String role;
    private String interviewType;
    private int overallScore;
    private int totalInterviews;
    private Map<String, Integer> skillScores;
    private List<String> weakSkills;
    private List<String> strongSkills;
    private List<Map<String, Object>> recentPerformance;
    private List<Map<String, Object>> difficultyHistory;
    private Map<String, Object> followUpPerformance;
    private Map<String, Object> answerQuality;

    public AiCoachingRequest() {}

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public int getTotalInterviews() {
        return totalInterviews;
    }

    public void setTotalInterviews(int totalInterviews) {
        this.totalInterviews = totalInterviews;
    }

    public Map<String, Integer> getSkillScores() {
        return skillScores;
    }

    public void setSkillScores(Map<String, Integer> skillScores) {
        this.skillScores = skillScores;
    }

    public List<String> getWeakSkills() {
        return weakSkills;
    }

    public void setWeakSkills(List<String> weakSkills) {
        this.weakSkills = weakSkills;
    }

    public List<String> getStrongSkills() {
        return strongSkills;
    }

    public void setStrongSkills(List<String> strongSkills) {
        this.strongSkills = strongSkills;
    }

    public List<Map<String, Object>> getRecentPerformance() {
        return recentPerformance;
    }

    public void setRecentPerformance(List<Map<String, Object>> recentPerformance) {
        this.recentPerformance = recentPerformance;
    }

    public List<Map<String, Object>> getDifficultyHistory() {
        return difficultyHistory;
    }

    public void setDifficultyHistory(List<Map<String, Object>> difficultyHistory) {
        this.difficultyHistory = difficultyHistory;
    }

    public Map<String, Object> getFollowUpPerformance() {
        return followUpPerformance;
    }

    public void setFollowUpPerformance(Map<String, Object> followUpPerformance) {
        this.followUpPerformance = followUpPerformance;
    }

    public Map<String, Object> getAnswerQuality() {
        return answerQuality;
    }

    public void setAnswerQuality(Map<String, Object> answerQuality) {
        this.answerQuality = answerQuality;
    }
}
