package com.interviewai.backend.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * AiFollowUpRequest
 *
 * DTO for requesting an AI follow-up question from the backend Gemini service.
 */
public class AiFollowUpRequest {

    @NotBlank(message = "Question cannot be blank")
    private String question;

    @NotBlank(message = "Answer cannot be blank")
    private String answer;

    private String role;
    private String skill;
    private String difficulty;
    private String interviewType;
    private String personality;

    public AiFollowUpRequest() {}

    public AiFollowUpRequest(String question, String answer, String role, String skill, String difficulty, String interviewType, String personality) {
        this.question = question;
        this.answer = answer;
        this.role = role;
        this.skill = skill;
        this.difficulty = difficulty;
        this.interviewType = interviewType;
        this.personality = personality;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getInterviewType() {
        return interviewType;
    }

    public void setInterviewType(String interviewType) {
        this.interviewType = interviewType;
    }

    public String getPersonality() {
        return personality;
    }

    public void setPersonality(String personality) {
        this.personality = personality;
    }
}
