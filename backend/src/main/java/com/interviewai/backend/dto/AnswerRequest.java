package com.interviewai.backend.dto;

import jakarta.validation.constraints.NotNull;

public class AnswerRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private String answerText;

    public AnswerRequest() {}

    public AnswerRequest(Long questionId, String answerText) {
        this.questionId = questionId;
        this.answerText = answerText;
    }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
