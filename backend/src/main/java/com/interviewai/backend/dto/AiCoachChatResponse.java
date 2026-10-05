package com.interviewai.backend.dto;

/**
 * AiCoachChatResponse
 *
 * Interactive coaching reply from Gemini / Spring Boot.
 */
public class AiCoachChatResponse {

    private String reply;
    private String source; // "AI" or "RULE_BASED_FALLBACK"

    public AiCoachChatResponse() {}

    public AiCoachChatResponse(String reply, String source) {
        this.reply = reply;
        this.source = source;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
