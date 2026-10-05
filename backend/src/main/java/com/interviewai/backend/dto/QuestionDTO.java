package com.interviewai.backend.dto;

public class QuestionDTO {

    private Long id;
    private Integer questionNumber;
    private String question;
    private String category;
    private String skill;
    private Integer timeLimit;

    public QuestionDTO() {}

    public QuestionDTO(Long id, Integer questionNumber, String question, String category, String skill, Integer timeLimit) {
        this.id = id;
        this.questionNumber = questionNumber;
        this.question = question;
        this.category = category;
        this.skill = skill;
        this.timeLimit = timeLimit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }
}
