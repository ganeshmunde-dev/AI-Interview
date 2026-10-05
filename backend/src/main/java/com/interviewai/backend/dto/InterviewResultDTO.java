package com.interviewai.backend.dto;

import java.util.List;

public class InterviewResultDTO {

    private String interviewId;
    private String role;
    private String roleKey;
    private String difficulty;
    private String type;
    private String date;
    private String duration;
    private Integer totalQuestions;
    private Integer attempted;
    private Integer overallScore;
    private String evaluationStatus;
    private String feedbackSummary;

    private List<SkillScoreDTO> skillScores;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<RecommendationDTO> recommendations;

    public InterviewResultDTO() {}

    public static class SkillScoreDTO {
        private String skill;
        private Integer score;
        private Integer maxScore = 100;

        public SkillScoreDTO() {}
        public SkillScoreDTO(String skill, Integer score) {
            this.skill = skill;
            this.score = score;
            this.maxScore = 100;
        }

        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }

        public Integer getMaxScore() { return maxScore; }
        public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    }

    public static class RecommendationDTO {
        private String topic;
        private String resource;

        public RecommendationDTO() {}
        public RecommendationDTO(String topic, String resource) {
            this.topic = topic;
            this.resource = resource;
        }

        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }

        public String getResource() { return resource; }
        public void setResource(String resource) { this.resource = resource; }
    }

    public String getInterviewId() { return interviewId; }
    public void setInterviewId(String interviewId) { this.interviewId = interviewId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getRoleKey() { return roleKey; }
    public void setRoleKey(String roleKey) { this.roleKey = roleKey; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public Integer getAttempted() { return attempted; }
    public void setAttempted(Integer attempted) { this.attempted = attempted; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(String evaluationStatus) { this.evaluationStatus = evaluationStatus; }

    public String getFeedbackSummary() { return feedbackSummary; }
    public void setFeedbackSummary(String feedbackSummary) { this.feedbackSummary = feedbackSummary; }

    public List<SkillScoreDTO> getSkillScores() { return skillScores; }
    public void setSkillScores(List<SkillScoreDTO> skillScores) { this.skillScores = skillScores; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<String> getWeaknesses() { return weaknesses; }
    public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }

    public List<RecommendationDTO> getRecommendations() { return recommendations; }
    public void setRecommendations(List<RecommendationDTO> recommendations) { this.recommendations = recommendations; }
}
