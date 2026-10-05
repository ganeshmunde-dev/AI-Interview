package com.interviewai.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.dto.InterviewResultDTO;
import com.interviewai.backend.entity.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EvaluationService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Map<String, List<String>> ROLE_SKILLS_MAP = new HashMap<>();

    static {
        ROLE_SKILLS_MAP.put("frontend", Arrays.asList("HTML", "CSS", "JavaScript", "DOM", "React", "API Integration", "Responsive Design", "Browser Concepts"));
        ROLE_SKILLS_MAP.put("react_dev", Arrays.asList("Components", "Props", "State", "Hooks", "Context API", "React Router", "API Integration", "Performance"));
        ROLE_SKILLS_MAP.put("java_dev", Arrays.asList("Core Java", "OOP", "Collections", "Exception Handling", "Multithreading", "Java 8+", "JVM"));
        ROLE_SKILLS_MAP.put("spring_boot", Arrays.asList("Spring Boot", "REST API", "Spring MVC", "JPA", "Hibernate", "Spring Security", "JWT"));
        ROLE_SKILLS_MAP.put("php", Arrays.asList("PHP", "OOP", "MySQL", "MVC", "Authentication", "Sessions"));
        ROLE_SKILLS_MAP.put("fullstack", Arrays.asList("Java Core", "Spring Boot", "React", "MySQL", "REST APIs", "System Architecture"));
        ROLE_SKILLS_MAP.put("backend", Arrays.asList("REST APIs", "System Design", "Databases & SQL", "Authentication", "API Security", "Caching"));
        ROLE_SKILLS_MAP.put("hr", Arrays.asList("Communication", "Confidence", "Clarity", "Teamwork", "Leadership", "Problem Solving", "Situational Judgment", "Professionalism"));
    }

    public static class EvaluatedAnswer {
        private String skill;
        private int score;
        private String category;

        public EvaluatedAnswer(String skill, int score, String category) {
            this.skill = skill;
            this.score = score;
            this.category = category;
        }

        public String getSkill() { return skill; }
        public int getScore() { return score; }
        public String getCategory() { return category; }
    }

    public Evaluation evaluateSession(InterviewSession session) {
        List<Question> questions = session.getQuestions();
        List<Answer> answers = session.getAnswers();

        Map<Long, Answer> answerMap = new HashMap<>();
        if (answers != null) {
            for (Answer a : answers) {
                if (a.getAnswerText() != null && !a.getAnswerText().trim().isEmpty()) {
                    answerMap.put(a.getQuestion().getId(), a);
                }
            }
        }

        int totalQuestions = questions.size();
        int attemptedCount = answerMap.size();

        Evaluation eval = new Evaluation();
        eval.setSession(session);
        eval.setTotalQuestions(totalQuestions);
        eval.setAttemptedCount(attemptedCount);

        InterviewResult result = new InterviewResult();
        result.setEvaluation(eval);

        String roleKey = session.getRole() != null ? session.getRole().toLowerCase() : "frontend";
        if ("hr".equalsIgnoreCase(session.getType())) roleKey = "hr";
        List<String> canonicalSkills = ROLE_SKILLS_MAP.getOrDefault(roleKey, ROLE_SKILLS_MAP.get("frontend"));

        // ── PROBLEM 1: ZERO ANSWERS ────────────────────────────────────────────
        if (attemptedCount == 0) {
            eval.setOverallScore(0);
            eval.setEvaluationStatus("Not Evaluated");
            eval.setFeedbackSummary("No answers were submitted, so your performance cannot be evaluated.");

            List<InterviewResultDTO.SkillScoreDTO> zeroSkillScores = new ArrayList<>();
            for (String s : canonicalSkills) {
                zeroSkillScores.add(new InterviewResultDTO.SkillScoreDTO(s, 0));
            }

            List<String> zeroStrengths = Collections.singletonList("No strengths can be evaluated yet because you did not answer any questions.");
            List<String> zeroWeaknesses = Collections.singletonList("Complete the interview to receive personalized feedback.");
            List<InterviewResultDTO.RecommendationDTO> zeroRecs = Collections.singletonList(
                    new InterviewResultDTO.RecommendationDTO("Get Started", "Submit answers to receive personalized study recommendations.")
            );

            try {
                result.setSkillScoresJson(objectMapper.writeValueAsString(zeroSkillScores));
                result.setStrengthsJson(objectMapper.writeValueAsString(zeroStrengths));
                result.setWeaknessesJson(objectMapper.writeValueAsString(zeroWeaknesses));
                result.setRecommendationsJson(objectMapper.writeValueAsString(zeroRecs));
            } catch (Exception e) {
                result.setSkillScoresJson("[]");
                result.setStrengthsJson("[]");
                result.setWeaknessesJson("[]");
                result.setRecommendationsJson("[]");
            }

            eval.setResult(result);
            return eval;
        }

        // ── PROBLEM 2 & 3: PARTIAL OR FULL ANSWERS ─────────────────────────────
        boolean isFull = attemptedCount == totalQuestions;
        eval.setEvaluationStatus(isFull ? "Completed" : "Partially Evaluated");

        List<EvaluatedAnswer> evalList = new ArrayList<>();
        Map<String, List<Integer>> skillScorePool = new HashMap<>();

        for (Question q : questions) {
            Answer a = answerMap.get(q.getId());
            if (a != null) {
                int answerScore = evaluateSingleAnswerText(q, a.getAnswerText(), roleKey);
                String qSkill = q.getSkill() != null ? q.getSkill() : q.getCategory();

                evalList.add(new EvaluatedAnswer(qSkill, answerScore, q.getCategory()));
                skillScorePool.computeIfAbsent(qSkill, k -> new ArrayList<>()).add(answerScore);
            }
        }

        // Calculate overall score strictly as average of answered questions
        int sumScores = evalList.stream().mapToInt(EvaluatedAnswer::getScore).sum();
        int overallScore = Math.round((float) sumScores / attemptedCount);
        eval.setOverallScore(overallScore);

        eval.setFeedbackSummary(isFull
                ? String.format("Completed full evaluation with an overall performance score of %d%%.", overallScore)
                : String.format("Partially evaluated %d of %d questions with an average score of %d%%.", attemptedCount, totalQuestions, overallScore)
        );

        // Build skill scores
        List<InterviewResultDTO.SkillScoreDTO> skillScoresList = new ArrayList<>();
        for (String skill : canonicalSkills) {
            List<Integer> scores = skillScorePool.get(skill);
            int score = 0;
            if (scores != null && !scores.isEmpty()) {
                score = Math.round((float) scores.stream().mapToInt(Integer::intValue).sum() / scores.size());
            } else if (attemptedCount > 0) {
                score = Math.min(95, Math.max(30, overallScore));
            }
            skillScoresList.add(new InterviewResultDTO.SkillScoreDTO(skill, score));
        }

        // Strengths & Weaknesses
        List<String> strengths = new ArrayList<>();
        List<String> weaknesses = new ArrayList<>();

        if (!isFull) {
            weaknesses.add(String.format("%d question(s) were skipped, affecting overall completeness.", totalQuestions - attemptedCount));
        }

        for (EvaluatedAnswer ea : evalList) {
            if (ea.getScore() >= 65) {
                strengths.add(String.format("Strong response demonstrated in %s concepts", ea.getSkill()));
            } else {
                weaknesses.add(String.format("%s explanations need deeper technical details and practical examples", ea.getSkill()));
            }
        }

        if (strengths.isEmpty()) {
            strengths.add(String.format("Attempted %d questions showcasing foundational knowledge in %s", attemptedCount, roleKey));
        }
        if (weaknesses.isEmpty()) {
            weaknesses.add("Focus on adding more real-world examples and code snippets in future interviews.");
        }

        List<InterviewResultDTO.RecommendationDTO> recommendations = new ArrayList<>();
        for (String s : canonicalSkills) {
            if (recommendations.size() >= 3) break;
            recommendations.add(new InterviewResultDTO.RecommendationDTO(s, "Review key documentation and practice code exercises for " + s + "."));
        }

        try {
            result.setSkillScoresJson(objectMapper.writeValueAsString(skillScoresList));
            result.setStrengthsJson(objectMapper.writeValueAsString(strengths));
            result.setWeaknessesJson(objectMapper.writeValueAsString(weaknesses));
            result.setRecommendationsJson(objectMapper.writeValueAsString(recommendations));
        } catch (Exception e) {
            result.setSkillScoresJson("[]");
            result.setStrengthsJson("[]");
            result.setWeaknessesJson("[]");
            result.setRecommendationsJson("[]");
        }

        eval.setResult(result);
        return eval;
    }

    private int evaluateSingleAnswerText(Question q, String text, String roleKey) {
        if (text == null || text.trim().isEmpty()) return 0;
        int length = text.trim().length();
        int wordCount = text.trim().split("\\s+").length;

        int score = 40;
        if (wordCount > 50) score = 90;
        else if (wordCount > 30) score = 80;
        else if (wordCount > 15) score = 70;
        else if (wordCount > 5) score = 55;

        if (text.toLowerCase().contains("example") || text.toLowerCase().contains("because") || text.toLowerCase().contains("instance")) {
            score += 8;
        }

        return Math.min(100, Math.max(20, score));
    }
}
