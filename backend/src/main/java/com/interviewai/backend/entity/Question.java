package com.interviewai.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(nullable = false)
    private Integer questionNumber;

    @Column(nullable = false, length = 1000)
    private String questionText;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private Integer timeLimit = 90;

    public Question() {}

    public Question(InterviewSession session, Integer questionNumber, String questionText, String category, String skill, Integer timeLimit) {
        this.session = session;
        this.questionNumber = questionNumber;
        this.questionText = questionText;
        this.category = category;
        this.skill = skill;
        this.timeLimit = timeLimit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }

    public Integer getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(Integer questionNumber) { this.questionNumber = questionNumber; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public Integer getTimeLimit() { return timeLimit; }
    public void setTimeLimit(Integer timeLimit) { this.timeLimit = timeLimit; }
}
