package com.interviewai.backend.dto;

/**
 * AiFollowUpResponse
 *
 * DTO for returning a generated follow-up question and its source ("AI" or "FALLBACK").
 */
public class AiFollowUpResponse {

    private String followUpQuestion;
    private String source; // "AI" or "FALLBACK"

    public AiFollowUpResponse() {}

    public AiFollowUpResponse(String followUpQuestion, String source) {
        this.followUpQuestion = followUpQuestion;
        this.source = source;
    }

    public String getFollowUpQuestion() {
        return followUpQuestion;
    }

    public void setFollowUpQuestion(String followUpQuestion) {
        this.followUpQuestion = followUpQuestion;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
