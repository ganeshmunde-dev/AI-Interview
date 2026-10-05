package com.interviewai.backend.service;

import com.interviewai.backend.dto.AiEvaluationRequest;
import com.interviewai.backend.dto.AiEvaluationResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * GeminiAiServiceTest
 * Validates evaluation logic, fallback handling, and zero-answer protection.
 */
class GeminiAiServiceTest {

    @Test
    @DisplayName("Verify fallback evaluation handles zero answer correctly")
    void testZeroAnswerFallback() {
        GeminiAiService service = new GeminiAiService();

        AiEvaluationRequest req = new AiEvaluationRequest();
        req.setQuestion("What is React reconciliation?");
        req.setAnswer("");
        req.setRole("frontend");
        req.setSkill("React");
        req.setDifficulty("medium");

        AiEvaluationResponse response = service.evaluate(req);

        assertNotNull(response);
        assertEquals(0, response.getScore(), "Zero answer must result in 0 score");
        assertEquals("Not Evaluated", response.getRating());
        assertEquals(0, response.getCorrectness());
        assertTrue(response.getStrengths().isEmpty(), "Zero answer should have no fake strengths");
    }

    @Test
    @DisplayName("Verify fallback evaluation scores answered technical questions proportionally")
    void testAnsweredTechnicalEvaluation() {
        GeminiAiService service = new GeminiAiService();

        AiEvaluationRequest req = new AiEvaluationRequest();
        req.setQuestion("Explain how the virtual DOM works in React.");
        req.setAnswer("The virtual DOM is an in-memory representation of real DOM elements. When state changes, React computes the diff with the previous virtual DOM tree and efficiently batches updates to the real DOM.");
        req.setRole("frontend");
        req.setSkill("React");
        req.setDifficulty("medium");

        AiEvaluationResponse response = service.evaluate(req);

        assertNotNull(response);
        assertTrue(response.getScore() >= 60, "Substantive technical answer should score >= 60");
        assertNotNull(response.getFeedback());
        assertFalse(response.getStrengths().isEmpty());
    }

    @Test
    @DisplayName("Verify HR evaluation rubric produces non-programming feedback")
    void testHrEvaluationCriteria() {
        GeminiAiService service = new GeminiAiService();

        AiEvaluationRequest req = new AiEvaluationRequest();
        req.setQuestion("Describe a time you handled conflict within your team.");
        req.setAnswer("In my previous project, we had a disagreement regarding architecture choices. I organized an open discussion where each member presented trade-offs, and we collaboratively decided on the best solution.");
        req.setRole("hr");
        req.setSkill("Teamwork");
        req.setDifficulty("medium");
        req.setInterviewType("hr");

        AiEvaluationResponse response = service.evaluate(req);

        assertNotNull(response);
        assertTrue(response.getScore() > 50);
        assertEquals("Teamwork", response.getSkill());
    }

    @Test
    @DisplayName("Verify AI Coaching fallback generates personalized roadmap and practice questions")
    void testGenerateCoachingFallback() {
        GeminiAiService service = new GeminiAiService();

        com.interviewai.backend.dto.AiCoachingRequest req = new com.interviewai.backend.dto.AiCoachingRequest();
        req.setRole("Java Developer");
        req.setInterviewType("technical");
        req.setOverallScore(72);
        req.setTotalInterviews(4);
        req.setStrongSkills(java.util.List.of("Core Java", "OOP"));
        req.setWeakSkills(java.util.List.of("Concurrency", "JVM Internals"));

        com.interviewai.backend.dto.AiCoachingResponse resp = service.generateCoaching(req);

        assertNotNull(resp);
        assertNotNull(resp.getExecutiveSummary());
        assertFalse(resp.getStrengths().isEmpty(), "Strengths must be generated");
        assertFalse(resp.getWeaknesses().isEmpty(), "Weaknesses must be generated");
        assertEquals(3, resp.getStudyRoadmap().size(), "3-week study roadmap must be present");
        assertFalse(resp.getPracticeQuestions().isEmpty(), "Practice questions must be generated");
        assertNotNull(resp.getNextInterviewRecommendation());
    }

    @Test
    @DisplayName("Verify AI Coach chat reply provides contextual guidance")
    void testChatWithCoachFallback() {
        GeminiAiService service = new GeminiAiService();

        com.interviewai.backend.dto.AiCoachChatRequest req = new com.interviewai.backend.dto.AiCoachChatRequest();
        req.setRole("React Developer");
        req.setOverallScore(68);
        req.setWeakSkills(java.util.List.of("State Management"));
        req.setMessage("How can I improve my interview score?");

        com.interviewai.backend.dto.AiCoachChatResponse resp = service.chatWithCoach(req);

        assertNotNull(resp);
        assertNotNull(resp.getReply());
        assertTrue(resp.getReply().length() > 20);
    }
}
