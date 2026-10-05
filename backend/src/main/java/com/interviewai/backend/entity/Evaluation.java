package com.interviewai.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false, unique = true)
    private InterviewSession session;

    @Column(nullable = false)
    private Integer overallScore = 0;

    @Column(nullable = false)
    private Integer attemptedCount = 0;

    @Column(nullable = false)
    private Integer totalQuestions = 0;

    @Column(nullable = false)
    private String evaluationStatus; // Not Evaluated, Partially Evaluated, Completed

    @Column(length = 1000)
    private String feedbackSummary;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private InterviewResult result;

    public Evaluation() {}

    public Evaluation(InterviewSession session, Integer overallScore, Integer attemptedCount, Integer totalQuestions, String evaluationStatus, String feedbackSummary) {
        this.session = session;
        this.overallScore = overallScore;
        this.attemptedCount = attemptedCount;
        this.totalQuestions = totalQuestions;
        this.evaluationStatus = evaluationStatus;
        this.feedbackSummary = feedbackSummary;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public InterviewSession getSession() { return session; }
    public void setSession(InterviewSession session) { this.session = session; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public Integer getAttemptedCount() { return attemptedCount; }
    public void setAttemptedCount(Integer attemptedCount) { this.attemptedCount = attemptedCount; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public String getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(String evaluationStatus) { this.evaluationStatus = evaluationStatus; }

    public String getFeedbackSummary() { return feedbackSummary; }
    public void setFeedbackSummary(String feedbackSummary) { this.feedbackSummary = feedbackSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public InterviewResult getResult() { return result; }
    public void setResult(InterviewResult result) { this.result = result; }
}
