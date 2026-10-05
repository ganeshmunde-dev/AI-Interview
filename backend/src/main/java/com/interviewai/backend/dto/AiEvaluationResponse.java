package com.interviewai.backend.dto;

import java.util.List;

public class AiEvaluationResponse {

    private Integer score;
    private String rating;
    private String skill;
    private Integer correctness;
    private Integer relevance;
    private Integer depth;
    private Integer completeness;
    private Integer clarity;
    private String feedback;
    private List<String> strengths;
    private List<String> improvements;
    private String idealAnswer;
    private Boolean followUpRecommended;
    private Boolean evaluatedByAi;
    private String fallbackReason;

    public AiEvaluationResponse() {}

    public AiEvaluationResponse(Integer score, Integer correctness, Integer relevance, Integer completeness,
                                Integer clarity, String feedback, List<String> strengths, List<String> improvements,
                                Boolean evaluatedByAi) {
        this.score = score;
        this.correctness = correctness;
        this.relevance = relevance;
        this.completeness = completeness;
        this.clarity = clarity;
        this.feedback = feedback;
        this.strengths = strengths;
        this.improvements = improvements;
        this.evaluatedByAi = evaluatedByAi;
    }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public Integer getCorrectness() { return correctness; }
    public void setCorrectness(Integer correctness) { this.correctness = correctness; }

    public Integer getRelevance() { return relevance; }
    public void setRelevance(Integer relevance) { this.relevance = relevance; }

    public Integer getDepth() { return depth; }
    public void setDepth(Integer depth) { this.depth = depth; }

    public Integer getCompleteness() { return completeness; }
    public void setCompleteness(Integer completeness) { this.completeness = completeness; }

    public Integer getClarity() { return clarity; }
    public void setClarity(Integer clarity) { this.clarity = clarity; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getImprovements() { return improvements; }
    public void setImprovements(List<String> improvements) { this.improvements = improvements; }

    public String getIdealAnswer() { return idealAnswer; }
    public void setIdealAnswer(String idealAnswer) { this.idealAnswer = idealAnswer; }

    public Boolean getFollowUpRecommended() { return followUpRecommended; }
    public void setFollowUpRecommended(Boolean followUpRecommended) { this.followUpRecommended = followUpRecommended; }

    public Boolean getEvaluatedByAi() { return evaluatedByAi; }
    public void setEvaluatedByAi(Boolean evaluatedByAi) { this.evaluatedByAi = evaluatedByAi; }

    public String getFallbackReason() { return fallbackReason; }
    public void setFallbackReason(String fallbackReason) { this.fallbackReason = fallbackReason; }
}
