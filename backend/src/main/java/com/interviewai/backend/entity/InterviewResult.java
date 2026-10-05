package com.interviewai.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_results")
public class InterviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluation_id", nullable = false, unique = true)
    private Evaluation evaluation;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String skillScoresJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String strengthsJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String weaknessesJson;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String recommendationsJson;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public InterviewResult() {}

    public InterviewResult(Evaluation evaluation, String skillScoresJson, String strengthsJson, String weaknessesJson, String recommendationsJson) {
        this.evaluation = evaluation;
        this.skillScoresJson = skillScoresJson;
        this.strengthsJson = strengthsJson;
        this.weaknessesJson = weaknessesJson;
        this.recommendationsJson = recommendationsJson;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Evaluation getEvaluation() { return evaluation; }
    public void setEvaluation(Evaluation evaluation) { this.evaluation = evaluation; }

    public String getSkillScoresJson() { return skillScoresJson; }
    public void setSkillScoresJson(String skillScoresJson) { this.skillScoresJson = skillScoresJson; }

    public String getStrengthsJson() { return strengthsJson; }
    public void setStrengthsJson(String strengthsJson) { this.strengthsJson = strengthsJson; }

    public String getWeaknessesJson() { return weaknessesJson; }
    public void setWeaknessesJson(String weaknessesJson) { this.weaknessesJson = weaknessesJson; }

    public String getRecommendationsJson() { return recommendationsJson; }
    public void setRecommendationsJson(String recommendationsJson) { this.recommendationsJson = recommendationsJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
