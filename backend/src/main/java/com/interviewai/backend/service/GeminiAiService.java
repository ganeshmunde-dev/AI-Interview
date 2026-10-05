package com.interviewai.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewai.backend.dto.AiEvaluationRequest;
import com.interviewai.backend.dto.AiEvaluationResponse;
import com.interviewai.backend.dto.AiFollowUpRequest;
import com.interviewai.backend.dto.AiFollowUpResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * GeminiAiService
 *
 * Sends the interview question + candidate answer to Google Gemini AI API.
 * Parses the structured JSON evaluation response.
 * Falls back to rule-based scoring if AI is unavailable or API key is not configured.
 *
 * API Key must be set via:
 *   - environment variable:  GEMINI_API_KEY=<your-key>
 *   - or application.properties: ai.gemini.api-key=<your-key>
 *
 * The key is NEVER exposed to the React frontend.
 */
@Service
public class GeminiAiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.api-url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent}")
    private String apiUrl;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Evaluate a single answer using Gemini AI.
     * Returns an AiEvaluationResponse with scores and feedback.
     * Falls back to rule-based scoring if AI is unavailable.
     */
    public AiEvaluationResponse evaluate(AiEvaluationRequest req) {
        // If no API key configured, use fallback
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            log.warn("[GeminiAI] No API key configured. Using rule-based fallback evaluation.");
            return fallbackEvaluation(req, "AI API key not configured");
        }

        // If no answer submitted, return zero score
        if (req.getAnswer() == null || req.getAnswer().trim().isEmpty()) {
            return buildZeroScoreResponse("No answer submitted.");
        }

        try {
            return callGeminiApi(req);
        } catch (Exception e) {
            log.error("[GeminiAI] API call failed: {}", e.getMessage());
            return fallbackEvaluation(req, "AI service temporarily unavailable: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Gemini API Call
    // ─────────────────────────────────────────────────────────────────────────

    private AiEvaluationResponse callGeminiApi(AiEvaluationRequest req) throws Exception {
        String prompt = buildEvaluationPrompt(req);

        // Build Gemini API request body
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.2,
                "maxOutputTokens", 512,
                "responseMimeType", "application/json"
            )
        );

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String rawResponse = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return parseGeminiResponse(rawResponse, req);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Prompt Builder
    // ─────────────────────────────────────────────────────────────────────────

    private String buildEvaluationPrompt(AiEvaluationRequest req) {
        boolean isHR = "hr".equalsIgnoreCase(req.getRole()) || "hr".equalsIgnoreCase(req.getInterviewType());

        String evaluationCriteria = isHR
                ? """
                  Evaluate strictly using HR & Behavioral interview criteria:
                  1. Communication quality & clarity
                  2. Confidence & professional tone
                  3. Structure (STAR method - Situation, Task, Action, Result where applicable)
                  4. Situation handling & judgment
                  5. Teamwork & collaboration mindset
                  6. Leadership & initiative
                  7. Professionalism & workplace ethics
                  8. Problem solving & analytical thinking
                  Do NOT evaluate technical code or programming syntax for HR.
                  """
                : """
                  Evaluate strictly using Technical interview criteria for the specified role:
                  1. Technical correctness & accuracy
                  2. Conceptual understanding & principles
                  3. Depth of explanation & edge cases
                  4. Relevance directly to the question asked
                  5. Practical understanding & real-world trade-offs
                  6. Reasoning & logical flow
                  7. Clarity of communication
                  """;

        String followUpContext = "";
        if (req.getFollowUpAnswer() != null && !req.getFollowUpAnswer().trim().isEmpty()) {
            followUpContext = String.format("""
                
                AI Follow-Up Asked:
                "%s"
                
                Candidate's Follow-Up Answer:
                "%s"
                
                Note: Treat the follow-up answer as deeper evidence for the same skill. Combine both answers to determine conceptual depth and final score.
                """,
                req.getFollowUpQuestion() != null ? req.getFollowUpQuestion() : "Follow-up question",
                req.getFollowUpAnswer()
            );
        }

        return String.format("""
            You are an expert %s interviewer evaluating a candidate's answer for a %s position.
            
            Interview Context:
            - Role: %s
            - Skill Area: %s
            - Difficulty Level: %s
            - Interview Type: %s
            - Personality Tone: %s
            
            Primary Question Asked:
            "%s"
            
            Candidate's Primary Answer:
            "%s"
            %s
            
            Evaluation Rubric:
            %s
            
            Score each metric from 0 to 100 (0 = no answer / completely wrong, 100 = comprehensive industry-grade answer).
            
            Return ONLY valid JSON in this exact structure (no markdown fences, no explanatory text):
            {
              "score": <0-100 overall weighted score>,
              "rating": "<Strong | Good | Adequate | Needs Improvement>",
              "skill": "%s",
              "relevance": <0-100>,
              "correctness": <0-100>,
              "depth": <0-100>,
              "completeness": <0-100>,
              "clarity": <0-100>,
              "feedback": "<2-3 sentence personalized, constructive feedback referencing actual points stated>",
              "strengths": ["<specific strength based on their response>", "<second specific strength>"],
              "improvements": ["<specific area to improve based on missing points>", "<second specific improvement>"],
              "idealAnswer": "<a concise 2-3 sentence model interview answer demonstrating best practices>",
              "followUpRecommended": <true | false>
            }
            """,
                isHR ? "HR & Behavioral" : "Technical",
                req.getRole(),
                req.getRole(),
                req.getSkill(),
                req.getDifficulty(),
                req.getInterviewType() != null ? req.getInterviewType() : "technical",
                req.getPersonality() != null ? req.getPersonality() : "professional",
                req.getQuestion(),
                req.getAnswer(),
                followUpContext,
                evaluationCriteria,
                req.getSkill()
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Response Parser
    // ─────────────────────────────────────────────────────────────────────────

    private AiEvaluationResponse parseGeminiResponse(String rawResponse, AiEvaluationRequest req) throws Exception {
        JsonNode root = objectMapper.readTree(rawResponse);

        // Navigate: candidates[0].content.parts[0].text
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new RuntimeException("No candidates in Gemini response");
        }

        String text = candidates.get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();

        // Clean potential markdown code fences
        text = text.trim();
        if (text.startsWith("```json")) {
            text = text.substring(7);
        }
        if (text.startsWith("```")) {
            text = text.substring(3);
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }
        text = text.trim();

        // Parse structured JSON from AI
        JsonNode evalJson = objectMapper.readTree(text);

        AiEvaluationResponse response = new AiEvaluationResponse();
        int score = clamp(evalJson.path("score").asInt(50));
        response.setScore(score);
        response.setRating(evalJson.path("rating").asText(score >= 80 ? "Strong" : score >= 65 ? "Good" : score >= 45 ? "Adequate" : "Needs Improvement"));
        response.setSkill(evalJson.path("skill").asText(req.getSkill()));
        response.setCorrectness(clamp(evalJson.path("correctness").asInt(score)));
        response.setRelevance(clamp(evalJson.path("relevance").asInt(score)));
        response.setDepth(clamp(evalJson.path("depth").asInt(Math.max(20, score - 5))));
        response.setCompleteness(clamp(evalJson.path("completeness").asInt(score)));
        response.setClarity(clamp(evalJson.path("clarity").asInt(score)));
        response.setFeedback(evalJson.path("feedback").asText("Good attempt. Focus on adding more depth and practical examples."));
        response.setIdealAnswer(evalJson.path("idealAnswer").asText(null));
        response.setFollowUpRecommended(evalJson.path("followUpRecommended").asBoolean(score >= 35 && score <= 72));
        response.setEvaluatedByAi(true);

        // Parse strengths array
        JsonNode strengthsNode = evalJson.path("strengths");
        if (strengthsNode.isArray() && !strengthsNode.isEmpty()) {
            List<String> strengths = new java.util.ArrayList<>();
            strengthsNode.forEach(n -> strengths.add(n.asText()));
            response.setStrengths(strengths);
        } else {
            response.setStrengths(List.of("Demonstrated fundamental understanding of " + req.getSkill()));
        }

        // Parse improvements array
        JsonNode improvementsNode = evalJson.path("improvements");
        if (improvementsNode.isArray() && !improvementsNode.isEmpty()) {
            List<String> improvements = new java.util.ArrayList<>();
            improvementsNode.forEach(n -> improvements.add(n.asText()));
            response.setImprovements(improvements);
        } else {
            response.setImprovements(List.of("Explore edge cases and deeper architectural trade-offs in " + req.getSkill()));
        }

        log.info("[GeminiAI] Evaluated '{}...' → score={}", req.getQuestion().substring(0, Math.min(40, req.getQuestion().length())), response.getScore());
        return response;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Rule-Based Fallback Evaluation
    // ─────────────────────────────────────────────────────────────────────────

    private AiEvaluationResponse fallbackEvaluation(AiEvaluationRequest req, String reason) {
        String answer = req.getAnswer() != null ? req.getAnswer().trim() : "";
        if (answer.isEmpty()) return buildZeroScoreResponse("No answer submitted.");

        int wordCount = answer.split("\\s+").length;
        if (req.getFollowUpAnswer() != null && !req.getFollowUpAnswer().trim().isEmpty()) {
            wordCount += req.getFollowUpAnswer().trim().split("\\s+").length;
        }

        int baseScore = 40;
        if (wordCount > 50) baseScore = 88;
        else if (wordCount > 30) baseScore = 78;
        else if (wordCount > 15) baseScore = 68;
        else if (wordCount > 5) baseScore = 55;

        String lowerAnswer = answer.toLowerCase();
        int depthBonus = 0;
        for (String marker : new String[]{"for example", "because", "such as", "however", "therefore", "instance", "step", "result"}) {
            if (lowerAnswer.contains(marker)) depthBonus += 3;
        }
        int score = Math.min(97, baseScore + depthBonus);

        boolean isHR = "hr".equalsIgnoreCase(req.getRole()) || "hr".equalsIgnoreCase(req.getInterviewType());

        AiEvaluationResponse response = new AiEvaluationResponse();
        response.setScore(score);
        response.setRating(score >= 80 ? "Strong" : score >= 65 ? "Good" : score >= 45 ? "Adequate" : "Needs Improvement");
        response.setSkill(req.getSkill());
        response.setCorrectness(score);
        response.setRelevance(Math.min(100, score + 5));
        response.setDepth(Math.max(20, score - 8));
        response.setCompleteness(Math.max(20, score - 10));
        response.setClarity(wordCount > 10 ? 80 : 60);
        response.setFeedback(isHR 
            ? "Your behavioral answer provided constructive context. For optimal results, structure responses with Situation, Task, Action, and Result."
            : "Your answer demonstrated core familiarity with " + req.getSkill() + ". Continue to expand on implementation details and trade-offs."
        );
        response.setStrengths(List.of(
            isHR
                ? "Provided clear context and professional communication on " + req.getSkill()
                : "Addressed core concepts in " + req.getSkill() + " with relevant terminology"
        ));
        response.setImprovements(List.of(
            isHR
                ? "Incorporate measurable outcomes and specific actions taken into behavioral answers"
                : "Deepen explanation with real-world scenarios and edge-case handling in " + req.getSkill()
        ));
        response.setIdealAnswer(null);
        response.setFollowUpRecommended(score >= 35 && score <= 72);
        response.setEvaluatedByAi(false);
        response.setFallbackReason(reason);
        return response;
    }

    private AiEvaluationResponse buildZeroScoreResponse(String reason) {
        AiEvaluationResponse response = new AiEvaluationResponse();
        response.setScore(0);
        response.setRating("Not Evaluated");
        response.setCorrectness(0);
        response.setRelevance(0);
        response.setDepth(0);
        response.setCompleteness(0);
        response.setClarity(0);
        response.setFeedback("No answer was submitted, so this question could not be evaluated.");
        response.setStrengths(List.of());
        response.setImprovements(List.of("Submit an answer to receive evaluation feedback"));
        response.setIdealAnswer(null);
        response.setFollowUpRecommended(false);
        response.setEvaluatedByAi(false);
        response.setFallbackReason(reason);
        return response;
    }

    private int clamp(int value) {
        return Math.max(0, Math.min(100, value));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Follow-Up Question Generation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a contextual follow-up question based on the candidate's answer.
     * Returns an AiFollowUpResponse with source "AI" or "FALLBACK".
     */
    public AiFollowUpResponse generateFollowUp(AiFollowUpRequest req) {
        // If no API key configured, use contextual fallback
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            log.info("[GeminiAI] No API key configured. Using contextual fallback follow-up.");
            return fallbackFollowUp(req);
        }

        // If no answer provided, return fallback
        if (req.getAnswer() == null || req.getAnswer().trim().isEmpty()) {
            return fallbackFollowUp(req);
        }

        try {
            return callGeminiFollowUpApi(req);
        } catch (Exception e) {
            log.error("[GeminiAI] Follow-up API call failed: {}", e.getMessage());
            return fallbackFollowUp(req);
        }
    }

    private AiFollowUpResponse callGeminiFollowUpApi(AiFollowUpRequest req) throws Exception {
        boolean isHR = "hr".equalsIgnoreCase(req.getRole()) || "hr".equalsIgnoreCase(req.getInterviewType());
        String personality = req.getPersonality() != null ? req.getPersonality().toLowerCase() : "professional";
        
        String personalityInstruction;
        switch (personality) {
            case "friendly":
                personalityInstruction = "You are a friendly and supportive interviewer. Use warm, approachable, and encouraging language while maintaining interview standards.";
                break;
            case "strict":
                personalityInstruction = "You are a challenging and strict interviewer. Be direct and demanding. Probe edge cases, trade-offs, and weaknesses in the candidate's reasoning. Never insult or humiliate the candidate.";
                break;
            case "hr":
                personalityInstruction = "You are a professional HR interviewer. Focus on communication, teamwork, leadership, conflict resolution, emotional intelligence, and behavioral reasoning. Encourage STAR-style answers.";
                break;
            case "professional":
            default:
                personalityInstruction = "You are a professional interviewer. Be formal, precise, objective, and structured. Probe conceptual depth and trade-offs.";
                break;
        }

        String prompt = String.format("""
            Interviewer Persona & Style:
            %s
            
            Interview Context:
            - Role: %s
            - Skill Area: %s
            - Difficulty Level: %s
            - Interview Type: %s
            
            Primary Question Asked:
            "%s"
            
            Candidate's Answer:
            "%s"
            
            Instructions:
            - You are the interviewer. Ask exactly ONE relevant, probing follow-up question directly based on the candidate's answer and the primary question.
            - Follow the Interviewer Persona & Style instruction for your communication tone and phrasing.
            - Match the role (%s) and difficulty level (%s).
            - Do NOT answer the question.
            - Do NOT provide evaluation, feedback, or scores.
            - Do NOT generate multiple questions.
            - Keep it concise: 1 to 2 sentences maximum.
            
            Return ONLY valid JSON in this exact structure (no markdown, no other text):
            {
              "followUpQuestion": "<The single follow-up question text>"
            }
            """,
                personalityInstruction,
                req.getRole() != null ? req.getRole() : "frontend",
                req.getSkill() != null ? req.getSkill() : "General",
                req.getDifficulty() != null ? req.getDifficulty() : "medium",
                req.getInterviewType() != null ? req.getInterviewType() : "technical",
                req.getQuestion() != null ? req.getQuestion() : "",
                req.getAnswer() != null ? req.getAnswer() : "",
                req.getRole() != null ? req.getRole() : "frontend",
                req.getDifficulty() != null ? req.getDifficulty() : "medium"
        );

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.3,
                "maxOutputTokens", 256,
                "responseMimeType", "application/json"
            )
        );

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String rawResponse = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new RuntimeException("No candidates in Gemini response");
        }

        String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText().trim();
        if (text.startsWith("```json")) text = text.substring(7);
        if (text.startsWith("```")) text = text.substring(3);
        if (text.endsWith("```")) text = text.substring(0, text.length() - 3);
        text = text.trim();

        JsonNode json = objectMapper.readTree(text);
        String followUp = json.path("followUpQuestion").asText("");

        if (followUp.isBlank()) {
            return fallbackFollowUp(req);
        }

        log.info("[GeminiAI] Generated AI follow-up for '{}...': '{}'", 
                req.getQuestion().substring(0, Math.min(30, req.getQuestion().length())), followUp);

        return new AiFollowUpResponse(followUp, "AI");
    }

    private AiFollowUpResponse fallbackFollowUp(AiFollowUpRequest req) {
        String role = req.getRole() != null ? req.getRole().toLowerCase() : "frontend";
        String question = req.getQuestion() != null ? req.getQuestion().toLowerCase() : "";
        String answer = req.getAnswer() != null ? req.getAnswer().toLowerCase() : "";
        String skill = req.getSkill() != null ? req.getSkill().toLowerCase() : "";
        String personality = req.getPersonality() != null ? req.getPersonality().toLowerCase() : "professional";

        String followUp;

        if (role.contains("hr") || skill.contains("hr") || "hr".equalsIgnoreCase(req.getInterviewType())) {
            if (answer.contains("team") || answer.contains("collaborat")) {
                followUp = "Can you describe a situation where a team member disagreed with your approach, and how you reached a resolution?";
            } else if (answer.contains("conflict") || answer.contains("disagree")) {
                followUp = "What specific steps did you take to maintain a constructive working relationship afterwards?";
            } else if (answer.contains("lead") || answer.contains("project")) {
                followUp = "How did you measure the ultimate success and impact of that initiative on your team or organization?";
            } else {
                followUp = "Can you provide a specific real-world example from your past experience that illustrates how you handled that situation?";
            }
        } else if (role.contains("react") || question.contains("react") || skill.contains("react")) {
            if (question.contains("state") || answer.contains("state")) {
                if ("friendly".equals(personality)) {
                    followUp = "That's a good start! Could you explain how state updates trigger rendering and why state shouldn't be mutated directly?";
                } else if ("strict".equals(personality)) {
                    followUp = "Explain precisely how state updates trigger React rendering and what issues occur if state is mutated directly.";
                } else {
                    followUp = "Can you explain how state updates trigger rendering and why state shouldn't be mutated directly?";
                }
            } else if (question.contains("prop") || answer.contains("prop")) {
                if ("friendly".equals(personality)) {
                    followUp = "Good point. How do you usually handle prop drilling in deeply nested component trees?";
                } else if ("strict".equals(personality)) {
                    followUp = "What specific architectural patterns prevent prop drilling in deep trees, and what are their performance trade-offs?";
                } else {
                    followUp = "How do you handle prop drilling in deeply nested component trees without passing props through intermediate components?";
                }
            } else if (question.contains("hook") || question.contains("useeffect") || answer.contains("hook")) {
                if ("friendly".equals(personality)) {
                    followUp = "Nice! Could you explain what can happen if dependency arrays in useEffect are configured incorrectly?";
                } else if ("strict".equals(personality)) {
                    followUp = "Detail the exact rules of React hooks and the precise runtime consequences of stale closures in useEffect dependencies.";
                } else {
                    followUp = "What are the key rules of React hooks, and what issues can occur if dependency arrays in useEffect are specified incorrectly?";
                }
            } else if (question.contains("virtual dom") || answer.contains("virtual dom")) {
                if ("strict".equals(personality)) {
                    followUp = "Detail the exact algorithmic complexity and heuristics React uses in its reconciliation diffing algorithm.";
                } else {
                    followUp = "How does React's diffing algorithm optimize updates when comparing two Virtual DOM trees?";
                }
            } else {
                followUp = "How would you optimize the performance of this component if it re-renders frequently with large datasets?";
            }
        } else if (role.contains("java") || skill.contains("java") || role.contains("spring")) {
            if (question.contains("hashmap") || question.contains("collection") || answer.contains("map")) {
                if ("friendly".equals(personality)) {
                    followUp = "That makes sense. Could you explain how HashMap handles bucket collisions in Java 8+ when trees are used?";
                } else if ("strict".equals(personality)) {
                    followUp = "Specify the exact threshold for HashMap treeification in Java 8+ and how hashCode/equals contracts affect collision resolution.";
                } else {
                    followUp = "How does HashMap handle bucket collisions in Java 8+ when the threshold is exceeded, and why is treeification used?";
                }
            } else if (question.contains("thread") || question.contains("concurren") || answer.contains("thread")) {
                if ("strict".equals(personality)) {
                    followUp = "Compare synchronized vs ReentrantLock at bytecode and JVM level regarding fairness, condition queues, and thread starvation.";
                } else {
                    followUp = "What is the difference between synchronized blocks and ReentrantLock in terms of fairness and lock interruption?";
                }
            } else if (question.contains("oop") || question.contains("class") || question.contains("interface")) {
                followUp = "In what practical design scenario would you prefer an abstract class over a default method in an interface?";
            } else if (question.contains("spring") || role.contains("spring")) {
                followUp = "How does the Spring IoC container manage bean lifecycles and resolve circular dependencies?";
            } else {
                followUp = "What potential exceptions or edge cases should be accounted for when implementing this in production?";
            }
        } else if (role.contains("php")) {
            if (question.contains("pdo") || question.contains("mysql") || answer.contains("query")) {
                followUp = "How do prepared statements in PDO protect against SQL injection compared to string concatenation?";
            } else if (question.contains("session") || answer.contains("cookie")) {
                followUp = "What security measures (such as HttpOnly and SameSite flags) should be applied to session management?";
            } else {
                followUp = "How would you structure this pattern using modern object-oriented PHP principles and namespaces?";
            }
        } else {
            // General Frontend / Web
            if (question.contains("javascript") || question.contains("closure") || answer.contains("scope")) {
                if ("friendly".equals(personality)) {
                    followUp = "Great! Could you give an example of how closures can retain memory if references are left uncleared?";
                } else if ("strict".equals(personality)) {
                    followUp = "Demonstrate the precise memory leak mechanism with JavaScript closures and how the garbage collector handles them.";
                } else {
                    followUp = "Can you give an example of how closures can lead to memory retention issues if references are not cleared?";
                }
            } else if (question.contains("css") || question.contains("flex") || question.contains("grid")) {
                followUp = "How would you ensure this layout remains fully accessible and performant across mobile and desktop devices?";
            } else {
                followUp = "Can you explain a practical edge case with this approach and how you would handle it?";
            }
        }

        return new AiFollowUpResponse(followUp, "FALLBACK");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Stage 7: AI Coaching Generation
    // ─────────────────────────────────────────────────────────────────────────

    public com.interviewai.backend.dto.AiCoachingResponse generateCoaching(com.interviewai.backend.dto.AiCoachingRequest req) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            log.warn("[GeminiAI] No API key configured. Using rule-based fallback coaching.");
            return fallbackCoaching(req);
        }

        try {
            return callGeminiCoachingApi(req);
        } catch (Exception e) {
            log.error("[GeminiAI] Coaching API call failed: {}", e.getMessage());
            return fallbackCoaching(req);
        }
    }

    private com.interviewai.backend.dto.AiCoachingResponse callGeminiCoachingApi(com.interviewai.backend.dto.AiCoachingRequest req) throws Exception {
        String prompt = buildCoachingPrompt(req);

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.3,
                "maxOutputTokens", 1024,
                "responseMimeType", "application/json"
            )
        );

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String rawResponse = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode root = objectMapper.readTree(rawResponse);
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();

        com.interviewai.backend.dto.AiCoachingResponse resp = objectMapper.readValue(text, com.interviewai.backend.dto.AiCoachingResponse.class);
        resp.setSource("AI");
        return resp;
    }

    private String buildCoachingPrompt(com.interviewai.backend.dto.AiCoachingRequest req) {
        return String.format("""
            You are a Senior Technical Interview Coach for software engineers.
            Analyze the following candidate's interview performance data and generate a structured coaching roadmap.
            
            Candidate Context:
            - Target Role: %s
            - Interview Type: %s
            - Overall Average Score: %d%%
            - Completed Sessions: %d
            - Strongest Skills: %s
            - Weakest Skills: %s
            
            Return a JSON object with this exact schema:
            {
              "executiveSummary": "Concise 2-3 sentence personalized assessment of candidate strengths and main improvement priority",
              "strengths": [
                {"skill": "Skill Name", "score": 85, "summary": "Why they excel and how to leverage this"}
              ],
              "weaknesses": [
                {"skill": "Skill Name", "score": 55, "why": "What was missing in answers", "action": "Actionable study advice", "priority": "HIGH"}
              ],
              "studyRoadmap": [
                {"week": "Week 1", "phase": "Core Fundamentals", "topics": ["topic1", "topic2"], "goal": "Weekly goal"},
                {"week": "Week 2", "phase": "Practical Application", "topics": ["topic1", "topic2"], "goal": "Weekly goal"},
                {"week": "Week 3", "phase": "Advanced Mastery & Trade-offs", "topics": ["topic1", "topic2"], "goal": "Weekly goal"}
              ],
              "practiceQuestions": [
                {"topic": "Weak Topic", "question": "Technical question", "focus": "What the interviewer looks for"}
              ],
              "nextInterviewRecommendation": {
                "role": "%s",
                "difficulty": "Medium",
                "mode": "AI Interview",
                "focusTopics": ["topic1", "topic2"],
                "rationale": "Why this session will boost the candidate's score"
              }
            }
            Ensure advice is realistic, constructive, and tailored strictly to the candidate's actual data.
            """,
            req.getRole() != null ? req.getRole() : "Software Developer",
            req.getInterviewType() != null ? req.getInterviewType() : "Technical",
            req.getOverallScore(),
            req.getTotalInterviews(),
            req.getStrongSkills() != null ? String.join(", ", req.getStrongSkills()) : "Core Concepts",
            req.getWeakSkills() != null ? String.join(", ", req.getWeakSkills()) : "Advanced Trade-offs",
            req.getRole() != null ? req.getRole() : "Software Developer"
        );
    }

    public com.interviewai.backend.dto.AiCoachingResponse fallbackCoaching(com.interviewai.backend.dto.AiCoachingRequest req) {
        com.interviewai.backend.dto.AiCoachingResponse resp = new com.interviewai.backend.dto.AiCoachingResponse();
        resp.setSource("RULE_BASED_FALLBACK");

        String role = (req.getRole() != null ? req.getRole() : "Software Developer").toLowerCase();
        boolean isHR = role.contains("hr") || "hr".equalsIgnoreCase(req.getInterviewType());

        List<String> weak = (req.getWeakSkills() != null && !req.getWeakSkills().isEmpty()) 
            ? req.getWeakSkills() 
            : (isHR ? List.of("Situational Judgment", "Leadership Examples") : List.of("System Trade-offs", "Concurrency & Edge Cases"));

        List<String> strong = (req.getStrongSkills() != null && !req.getStrongSkills().isEmpty())
            ? req.getStrongSkills()
            : (isHR ? List.of("Communication", "Teamwork") : List.of("Core Fundamentals", "Syntax & Structure"));

        resp.setExecutiveSummary(String.format(
            "Your technical knowledge is solidly demonstrated in %s. To elevate your overall performance to senior levels, prioritize structured explanations and practical trade-offs in %s.",
            String.join(" and ", strong),
            String.join(" and ", weak)
        ));

        // Strengths
        resp.setStrengths(List.of(
            Map.of("skill", strong.get(0), "score", Math.max(78, req.getOverallScore() + 8), "summary", "Consistent conceptual accuracy and structured clarity."),
            Map.of("skill", strong.size() > 1 ? strong.get(1) : "Core Fundamentals", "score", Math.max(74, req.getOverallScore() + 4), "summary", "Good terminology usage and direct answering.")
        ));

        // Weaknesses
        resp.setWeaknesses(List.of(
            Map.of(
                "skill", weak.get(0),
                "score", Math.min(65, Math.max(45, req.getOverallScore() - 12)),
                "why", isHR ? "Responses could benefit from clearer STAR framework context and quantifiable impact." : "Answers demonstrate foundational understanding but lack real-world examples and edge-case handling.",
                "action", isHR ? "Structure answers with Situation, Task, Action, and specific Result." : "Practice explaining internal mechanisms and complexity trade-offs.",
                "priority", "HIGH"
            ),
            Map.of(
                "skill", weak.size() > 1 ? weak.get(1) : "Edge Case Reasoning",
                "score", Math.min(68, Math.max(50, req.getOverallScore() - 8)),
                "why", "Follow-up questions revealed opportunities for deeper technical justification.",
                "action", "Anticipate common interviewer follow-up probes before completing your primary answer.",
                "priority", "MEDIUM"
            )
        ));

        // Roadmap
        resp.setStudyRoadmap(List.of(
            Map.of(
                "week", "Week 1",
                "phase", "Core Foundations",
                "topics", List.of(weak.get(0), "Key Terminology & Definitions"),
                "goal", "Master direct answers with precise technical terminology without hesitation."
            ),
            Map.of(
                "week", "Week 2",
                "phase", "Practical Scenarios",
                "topics", List.of("Implementation Trade-offs", weak.size() > 1 ? weak.get(1) : "Design Patterns"),
                "goal", "Incorporate real-world production examples and concurrency/memory considerations."
            ),
            Map.of(
                "week", "Week 3",
                "phase", "Mock Mastery",
                "topics", List.of("Timed AI Voice Interviews", "Hard Difficulty Probes"),
                "goal", "Simulate full interviews at Hard difficulty with 100% follow-up response accuracy."
            )
        ));

        // Practice Questions
        resp.setPracticeQuestions(List.of(
            Map.of(
                "topic", weak.get(0),
                "question", isHR ? "Tell me about a time you handled conflict within a cross-functional engineering team." : "How would you diagnose and resolve a severe performance bottleneck in production for this role?",
                "focus", isHR ? "STAR structure, empathy, and constructive resolution." : "Systematic root cause analysis, tooling, and architectural trade-offs."
            ),
            Map.of(
                "topic", weak.size() > 1 ? weak.get(1) : "Technical Depth",
                "question", isHR ? "Describe a project where you took leadership without formal authority." : "What are the common failure modes and edge cases associated with this architecture?",
                "focus", isHR ? "Initiative, stakeholder communication, and delivery." : "Defensive programming, resilience, and scalability."
            )
        ));

        // Next Recommendation
        resp.setNextInterviewRecommendation(Map.of(
            "role", req.getRole() != null ? req.getRole() : "Software Developer",
            "difficulty", req.getOverallScore() >= 75 ? "Hard" : "Medium",
            "mode", "AI Interview",
            "focusTopics", weak,
            "rationale", String.format("Practicing %s in an AI Voice session will directly address your highest-priority growth opportunities.", String.join(", ", weak))
        ));

        return resp;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Stage 7: AI Coach Interactive Chat
    // ─────────────────────────────────────────────────────────────────────────

    public com.interviewai.backend.dto.AiCoachChatResponse chatWithCoach(com.interviewai.backend.dto.AiCoachChatRequest req) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            return fallbackChatReply(req);
        }

        try {
            return callGeminiCoachChatApi(req);
        } catch (Exception e) {
            log.error("[GeminiAI] Coach Chat API call failed: {}", e.getMessage());
            return fallbackChatReply(req);
        }
    }

    private com.interviewai.backend.dto.AiCoachChatResponse callGeminiCoachChatApi(com.interviewai.backend.dto.AiCoachChatRequest req) throws Exception {
        String prompt = String.format("""
            You are a helpful, senior technical interview coach speaking directly to a candidate preparing for interviews.
            
            Candidate Context:
            - Target Role: %s
            - Current Average Score: %d%%
            - Weakest Skills: %s
            - Strongest Skills: %s
            
            Candidate's Question:
            "%s"
            
            Provide a direct, motivating, and actionable response (under 150 words) with concrete examples.
            """,
            req.getRole() != null ? req.getRole() : "Software Developer",
            req.getOverallScore(),
            req.getWeakSkills() != null ? String.join(", ", req.getWeakSkills()) : "Technical Depth",
            req.getStrongSkills() != null ? String.join(", ", req.getStrongSkills()) : "Fundamentals",
            req.getMessage()
        );

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.4,
                "maxOutputTokens", 256
            )
        );

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String rawResponse = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JsonNode root = objectMapper.readTree(rawResponse);
        String text = root.path("candidates")
                .path(0)
                .path("content")
                .path("parts")
                .path(0)
                .path("text")
                .asText();

        return new com.interviewai.backend.dto.AiCoachChatResponse(text.trim(), "AI");
    }

    public com.interviewai.backend.dto.AiCoachChatResponse fallbackChatReply(com.interviewai.backend.dto.AiCoachChatRequest req) {
        String msg = (req.getMessage() != null ? req.getMessage() : "").toLowerCase();
        String weak = (req.getWeakSkills() != null && !req.getWeakSkills().isEmpty()) ? req.getWeakSkills().get(0) : "system trade-offs";

        String reply;
        if (msg.contains("improve") || msg.contains("better")) {
            reply = String.format("To improve your performance, structure your answers in 3 phases: 1) Direct definition, 2) Production code example, and 3) Trade-offs & edge cases. Based on your history, focusing on %s will give you the fastest score boost.", weak);
        } else if (msg.contains("score") || msg.contains("low")) {
            reply = String.format("Your current average is %d%%. Scores increase most when you explain 'why' a technology was chosen, not just 'how' it works. Elaborating on edge cases in %s will immediately elevate your score.", req.getOverallScore(), weak);
        } else if (msg.contains("question") || msg.contains("practice")) {
            reply = String.format("Try answering this practice probe: 'How would you handle high concurrency and race conditions when updating shared state in %s?' Focus on thread safety and lock contention.", req.getRole() != null ? req.getRole() : "your role");
        } else {
            reply = String.format("Great question! For %s interviews, senior interviewers look for candidates who proactively discuss failure modes and trade-offs. Review your %s study roadmap in the dashboard below.", req.getRole() != null ? req.getRole() : "technical", weak);
        }

        return new com.interviewai.backend.dto.AiCoachChatResponse(reply, "RULE_BASED_FALLBACK");
    }
}

