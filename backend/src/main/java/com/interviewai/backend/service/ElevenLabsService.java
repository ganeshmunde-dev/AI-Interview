package com.interviewai.backend.service;

import com.interviewai.backend.config.ElevenLabsConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * ElevenLabsService
 *
 * Calls the ElevenLabs Text-to-Speech API to synthesize speech from text.
 * Returns raw MP3 audio bytes which the controller streams to the frontend.
 *
 * Architecture: React → Spring Boot /api/voice/speak → ElevenLabs API
 *
 * The API key is NEVER exposed to the frontend. It is read only from
 * ElevenLabsConfig which reads from the ELEVENLABS_API_KEY environment variable.
 *
 * Error handling:
 * - Missing API key → throws VoiceServiceException (controller → 503)
 * - Empty text      → throws VoiceServiceException (controller → 400)
 * - ElevenLabs 429  → throws VoiceServiceException with rate limit message
 * - ElevenLabs 401/403 → throws VoiceServiceException (invalid key)
 * - Network timeout → throws VoiceServiceException
 * - Any other error → throws VoiceServiceException
 *
 * The controller catches VoiceServiceException and returns a safe,
 * user-friendly JSON error — never raw stack traces or the API key.
 */
@Service
public class ElevenLabsService {

    private static final Logger log = LoggerFactory.getLogger(ElevenLabsService.class);
    private static final int CONNECT_TIMEOUT_SECONDS = 10;
    private static final int REQUEST_TIMEOUT_SECONDS = 30;

    private final ElevenLabsConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    @Autowired
    public ElevenLabsService(ElevenLabsConfig config) {
        this.config = config;
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(CONNECT_TIMEOUT_SECONDS))
                .build();

        // Log configuration status at startup (key presence only, not the key itself)
        config.logConfigurationStatus();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Synthesizes text to speech using ElevenLabs API.
     *
     * @param text    The text to speak. Must be non-null and non-blank.
     * @param voiceId The ElevenLabs voice ID. If null/blank, uses configured default.
     * @return Raw MP3 audio bytes ready to stream as audio/mpeg.
     * @throws VoiceServiceException if synthesis fails for any reason.
     */
    public byte[] synthesize(String text, String voiceId) throws VoiceServiceException {
        // Validate API key presence
        if (!config.isConfigured()) {
            log.warn("[ElevenLabs] Synthesis requested but API key is not configured.");
            throw new VoiceServiceException("not_configured",
                    "Voice service is not configured. Please set ELEVENLABS_API_KEY on the backend.");
        }

        // Validate text
        if (text == null || text.isBlank()) {
            throw new VoiceServiceException("empty_text", "Text is required for speech synthesis.");
        }

        // Resolve voice ID: use provided, fall back to config, then error if neither
        String resolvedVoiceId = resolveVoiceId(voiceId);
        if (resolvedVoiceId == null || resolvedVoiceId.isBlank()) {
            throw new VoiceServiceException("no_voice_id",
                    "No voice ID provided and no default voice configured. " +
                    "Please set ELEVENLABS_VOICE_ID environment variable.");
        }

        // Sanitize text (limit length to prevent abuse)
        String sanitizedText = sanitizeText(text);

        log.debug("[ElevenLabs] Synthesizing {} characters with voice ID: {}", sanitizedText.length(), resolvedVoiceId);

        return callElevenLabsApi(sanitizedText, resolvedVoiceId);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Calls the ElevenLabs TTS API and returns raw audio bytes.
     */
    private byte[] callElevenLabsApi(String text, String voiceId) throws VoiceServiceException {
        String url = config.getApiBaseUrl() + "/" + voiceId;

        // Build request body
        Map<String, Object> requestBody = buildRequestBody(text);
        String requestBodyJson;
        try {
            requestBodyJson = objectMapper.writeValueAsString(requestBody);
        } catch (Exception e) {
            log.error("[ElevenLabs] Failed to serialize request body: {}", e.getMessage());
            throw new VoiceServiceException("serialization_error", "Failed to prepare voice request.");
        }

        HttpRequest request;
        try {
            request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(REQUEST_TIMEOUT_SECONDS))
                    .header("xi-api-key", config.getApiKey())          // Key on backend only
                    .header("Content-Type", "application/json")
                    .header("Accept", "audio/mpeg")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBodyJson))
                    .build();
        } catch (Exception e) {
            log.error("[ElevenLabs] Failed to build HTTP request: {}", e.getMessage());
            throw new VoiceServiceException("request_build_error", "Failed to prepare voice request.");
        }

        HttpResponse<byte[]> response;
        try {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
        } catch (IOException e) {
            log.error("[ElevenLabs] Network error calling TTS API: {}", e.getMessage());
            throw new VoiceServiceException("network_error",
                    "Could not connect to voice service. Please check your network.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("[ElevenLabs] Request interrupted.");
            throw new VoiceServiceException("interrupted", "Voice request was interrupted.");
        }

        return handleResponse(response, voiceId);
    }

    /**
     * Handles the ElevenLabs HTTP response, mapping status codes to exceptions.
     */
    private byte[] handleResponse(HttpResponse<byte[]> response, String voiceId) throws VoiceServiceException {
        int status = response.statusCode();

        switch (status) {
            case 200:
            case 201: {
                byte[] body = response.body();
                if (body == null || body.length == 0) {
                    log.warn("[ElevenLabs] API returned 200 but empty audio body.");
                    throw new VoiceServiceException("empty_audio", "Voice service returned empty audio.");
                }
                log.debug("[ElevenLabs] Successfully received {} bytes of audio.", body.length);
                return body;
            }
            case 400:
                log.warn("[ElevenLabs] Bad request (400). Voice ID: {}", voiceId);
                throw new VoiceServiceException("bad_request",
                        "Invalid voice request. Please check the voice ID configuration.");
            case 401:
            case 403:
                // Do NOT log the key itself — only the status
                log.error("[ElevenLabs] Authentication failed ({}). API key may be invalid or expired.", status);
                throw new VoiceServiceException("auth_failed",
                        "Voice service authentication failed. Please check backend API key configuration.");
            case 402:
                log.warn("[ElevenLabs] Quota exceeded or credits exhausted (402).");
                throw new VoiceServiceException("quota_exceeded",
                        "Voice service credit or character quota reached. Interview continues in text mode.");
            case 404:
                log.warn("[ElevenLabs] Voice ID not found (404). Voice ID: {}", voiceId);
                throw new VoiceServiceException("voice_not_found",
                        "The configured voice ID was not found. Please update ELEVENLABS_VOICE_ID.");
            case 422:
                log.warn("[ElevenLabs] Unprocessable entity (422) — invalid text or parameters.");
                throw new VoiceServiceException("invalid_text",
                        "Voice service could not process the text. Please try again.");
            case 429:
                log.warn("[ElevenLabs] Rate limited (429). Too many requests.");
                throw new VoiceServiceException("rate_limited",
                        "Voice service rate limit reached. Please wait a moment and try again.");
            case 500:
            case 502:
            case 503:
            case 504:
                log.error("[ElevenLabs] Server error ({}) from ElevenLabs API.", status);
                throw new VoiceServiceException("server_error",
                        "Voice service is temporarily unavailable. Please try again shortly.");
            default:
                log.error("[ElevenLabs] Unexpected response status: {}", status);
                throw new VoiceServiceException("unexpected_error",
                        "An unexpected error occurred with the voice service.");
        }
    }

    /**
     * Builds the ElevenLabs TTS request body.
     * Uses the configured model ID.
     */
    private Map<String, Object> buildRequestBody(String text) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("text", text);
        body.put("model_id", config.getModelId());

        // Voice settings for natural-sounding speech
        Map<String, Object> voiceSettings = new LinkedHashMap<>();
        voiceSettings.put("stability", 0.5);
        voiceSettings.put("similarity_boost", 0.75);
        voiceSettings.put("style", 0.0);
        voiceSettings.put("use_speaker_boost", true);
        body.put("voice_settings", voiceSettings);

        return body;
    }

    /**
     * Resolves the effective voice ID from request or config default.
     */
    private String resolveVoiceId(String requestedVoiceId) {
        if (requestedVoiceId != null && !requestedVoiceId.isBlank()) {
            return requestedVoiceId.trim();
        }
        if (config.hasDefaultVoice()) {
            return config.getVoiceId();
        }
        return null;
    }

    /**
     * Sanitizes text: trims, normalizes whitespace, limits length.
     * Prevents sending enormous payloads to ElevenLabs.
     */
    private String sanitizeText(String text) {
        if (text == null) return "";
        String trimmed = text.trim();
        // Normalize excessive whitespace
        trimmed = trimmed.replaceAll("\\s+", " ");
        // Limit to 5000 characters (ElevenLabs supports more but this is more than enough for questions)
        if (trimmed.length() > 5000) {
            trimmed = trimmed.substring(0, 5000);
            log.warn("[ElevenLabs] Text truncated to 5000 characters.");
        }
        return trimmed;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Inner exception class
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Typed exception carrying an error code and user-safe message.
     * The controller maps error codes to HTTP status codes.
     * The message is safe to show to the user — it NEVER contains the API key.
     */
    public static class VoiceServiceException extends Exception {

        private final String errorCode;

        public VoiceServiceException(String errorCode, String message) {
            super(message);
            this.errorCode = errorCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }
}
