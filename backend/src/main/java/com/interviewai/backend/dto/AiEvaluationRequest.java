package com.interviewai.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AiEvaluationRequest {

    @NotBlank(message = "Question is required")
    private String question;

    private String answer;

    @NotBlank(message = "Role is required")
    private String role;

    @NotBlank(message = "Skill is required")
    private String skill;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;

    private String interviewType;

    private String personality;

    private String followUpQuestion;

    private String followUpAnswer;

    public AiEvaluationRequest() {}

    public AiEvaluationRequest(String question, String answer, String role, String skill, String difficulty, String interviewType) {
        this.question = question;
        this.answer = answer;
        this.role = role;
        this.skill = skill;
        this.difficulty = difficulty;
        this.interviewType = interviewType;
    }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }

    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }

    public String getFollowUpQuestion() { return followUpQuestion; }
    public void setFollowUpQuestion(String followUpQuestion) { this.followUpQuestion = followUpQuestion; }

    public String getFollowUpAnswer() { return followUpAnswer; }
    public void setFollowUpAnswer(String followUpAnswer) { this.followUpAnswer = followUpAnswer; }
}
