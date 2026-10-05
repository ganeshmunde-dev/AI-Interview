package com.interviewai.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * ElevenLabsConfig
 *
 * Reads ElevenLabs configuration from environment variables or application.properties.
 *
 * Environment variables:
 *   ELEVENLABS_API_KEY   — your ElevenLabs secret API key
 *   ELEVENLABS_VOICE_ID  — the voice ID to use for TTS
 *   ELEVENLABS_MODEL_ID  — ElevenLabs model (default: eleven_multilingual_v2)
 *
 * The API key is NEVER returned to or logged for the React frontend.
 * The React frontend calls /api/voice/speak on Spring Boot, never ElevenLabs directly.
 *
 * If ELEVENLABS_API_KEY is not set, the service will return a 503 gracefully
 * and the interview continues in text mode.
 */
@Configuration
public class ElevenLabsConfig {

    private static final Logger log = LoggerFactory.getLogger(ElevenLabsConfig.class);

    @Value("${elevenlabs.api-key:}")
    private String apiKey;

    @Value("${elevenlabs.voice-id:}")
    private String voiceId;

    @Value("${elevenlabs.model-id:eleven_multilingual_v2}")
    private String modelId;

    @Value("${elevenlabs.api-url:https://api.elevenlabs.io/v1/text-to-speech}")
    private String apiBaseUrl;

    /**
     * Returns true if the API key is configured and non-empty.
     */
    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    /**
     * Returns true if a default voice ID is configured.
     */
    public boolean hasDefaultVoice() {
        return voiceId != null && !voiceId.isBlank();
    }

    /**
     * Returns the API key. Never expose this to the frontend.
     */
    public String getApiKey() {
        return apiKey;
    }

    /**
     * Returns the configured default voice ID, or empty string if not set.
     */
    public String getVoiceId() {
        return voiceId;
    }

    /**
     * Returns the ElevenLabs model ID (e.g. eleven_multilingual_v2).
     */
    public String getModelId() {
        return modelId;
    }

    /**
     * Returns the ElevenLabs TTS API base URL.
     */
    public String getApiBaseUrl() {
        return apiBaseUrl;
    }

    /**
     * Called at startup — logs configuration status without exposing the key.
     */
    public void logConfigurationStatus() {
        if (isConfigured()) {
            log.info("[ElevenLabs] API key configured. Voice ID: {}. Model: {}.",
                    hasDefaultVoice() ? voiceId : "(none set — must be supplied per request)",
                    modelId);
        } else {
            log.warn("[ElevenLabs] No API key configured. Voice features will return 503. " +
                     "Set ELEVENLABS_API_KEY environment variable to enable voice.");
        }
    }
}
