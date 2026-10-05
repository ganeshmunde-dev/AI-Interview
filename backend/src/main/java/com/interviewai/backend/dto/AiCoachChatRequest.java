package com.interviewai.backend.dto;

import java.util.List;
import java.util.Map;

/**
 * AiCoachChatRequest
 *
 * Question from candidate along with their historical context for the coach.
 */
public class AiCoachChatRequest {

    private String message;
    private String role;
    private int overallScore;
    private List<String> weakSkills;
    private List<String> strongSkills;
    private List<Map<String, String>> conversationHistory;

    public AiCoachChatRequest() {}

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
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

    public List<Map<String, String>> getConversationHistory() {
        return conversationHistory;
    }

    public void setConversationHistory(List<Map<String, String>> conversationHistory) {
        this.conversationHistory = conversationHistory;
    }
}
