package com.interviewai.backend.service;

import com.interviewai.backend.config.ElevenLabsConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.InputStream;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

/**
 * ElevenLabsServiceTest
 *
 * Tests for ElevenLabsConfig and ElevenLabsService.
 *
 * API key loading order:
 *   1. ELEVENLABS_API_KEY environment variable
 *   2. application-local.properties (gitignored developer secrets file)
 *   3. application.properties default value (should be empty in source control)
 *
 * Tests are designed to be non-blocking: if no real API key is configured,
 * the live synthesis test is skipped, and validation tests use a mock key.
 */
class ElevenLabsServiceTest {

    // ── Config helpers ──────────────────────────────────────────────────────────

    /**
     * Loads the ElevenLabs API key from the same sources Spring Boot would use:
     *   1. ELEVENLABS_API_KEY environment variable
     *   2. application-local.properties (gitignored)
     *   3. application.properties default fallback
     */
    private String resolveApiKey() {
        // 1. Environment variable (highest priority)
        String envKey = System.getenv("ELEVENLABS_API_KEY");
        if (envKey != null && !envKey.isBlank()) return envKey;

        // 2. application-local.properties (developer local secrets, gitignored)
        String localKey = loadPropertyFromFile("application-local.properties", "elevenlabs.api-key");
        if (localKey != null && !localKey.isBlank()) return localKey;

        // 3. application.properties fallback default (should be empty in source)
        String propKey = loadPropertyFromFile("application.properties", "elevenlabs.api-key");
        return extractDefault(propKey);
    }

    private String resolveVoiceId() {
        String envId = System.getenv("ELEVENLABS_VOICE_ID");
        if (envId != null && !envId.isBlank()) return envId;
        String localId = loadPropertyFromFile("application-local.properties", "elevenlabs.voice-id");
        if (localId != null && !localId.isBlank()) return localId;
        return extractDefault(loadPropertyFromFile("application.properties", "elevenlabs.voice-id"));
    }

    private String loadPropertyFromFile(String filename, String key) {
        Properties props = new Properties();
        try (InputStream in = getClass().getClassLoader().getResourceAsStream(filename)) {
            if (in != null) {
                props.load(in);
                return props.getProperty(key, "");
            }
        } catch (Exception ignored) {}
        return "";
    }

    private ElevenLabsConfig buildConfig(String apiKey, String voiceId) {
        ElevenLabsConfig config = new ElevenLabsConfig();
        ReflectionTestUtils.setField(config, "apiKey",    apiKey  != null ? apiKey  : "");
        ReflectionTestUtils.setField(config, "voiceId",   voiceId != null ? voiceId : "EXAVITQu4vr4xnSDxMaL");
        ReflectionTestUtils.setField(config, "modelId",   "eleven_multilingual_v2");
        ReflectionTestUtils.setField(config, "apiBaseUrl","https://api.elevenlabs.io/v1/text-to-speech");
        return config;
    }

    private String extractDefault(String raw) {
        if (raw == null) return "";
        raw = raw.trim();
        if (raw.startsWith("${") && raw.endsWith("}")) {
            int colonIdx = raw.indexOf(':');
            if (colonIdx > 0) {
                return raw.substring(colonIdx + 1, raw.length() - 1).trim();
            }
            return ""; // no default
        }
        return raw;
    }

    // ── Tests ───────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("Verify ElevenLabsConfig reads property values accurately")
    void testConfigReading() {
        String apiKey  = resolveApiKey();
        String voiceId = resolveVoiceId();

        ElevenLabsConfig config = buildConfig(apiKey, voiceId);

        // These are always stable (set in buildConfig)
        assertEquals("eleven_multilingual_v2", config.getModelId(),
                "Model ID should be eleven_multilingual_v2");
        assertEquals("https://api.elevenlabs.io/v1/text-to-speech", config.getApiBaseUrl(),
                "API base URL should be correct");
        assertTrue(config.hasDefaultVoice(),
                "Voice ID should be configured (default EXAVITQu4vr4xnSDxMaL)");

        // API key presence: only assert if we actually found one; otherwise just log
        if (apiKey != null && !apiKey.isBlank()) {
            assertTrue(config.isConfigured(),
                    "API key must be configured when key is provided");
        } else {
            System.out.println("[TEST] ELEVENLABS_API_KEY not found in env or application-local.properties. " +
                    "Live voice tests will be skipped. Set the env var or create application-local.properties.");
        }
    }

    @Test
    @DisplayName("Verify ElevenLabsService handles empty and invalid inputs gracefully")
    void testServiceValidation() {
        // Use a non-empty placeholder key so config.isConfigured() returns true,
        // allowing the empty-text / blank-text validation paths to be reached.
        // The key is fake — no real network call is made for these validation checks.
        ElevenLabsConfig config = buildConfig("test-api-key-placeholder", "EXAVITQu4vr4xnSDxMaL");
        ElevenLabsService service = new ElevenLabsService(config);

        ElevenLabsService.VoiceServiceException exEmpty = assertThrows(
                ElevenLabsService.VoiceServiceException.class,
                () -> service.synthesize("", null),
                "Empty text should throw VoiceServiceException"
        );
        assertEquals("empty_text", exEmpty.getErrorCode(),
                "Error code for empty text should be 'empty_text'");

        ElevenLabsService.VoiceServiceException exBlank = assertThrows(
                ElevenLabsService.VoiceServiceException.class,
                () -> service.synthesize("   ", null),
                "Blank text should throw VoiceServiceException"
        );
        assertEquals("empty_text", exBlank.getErrorCode(),
                "Error code for blank text should be 'empty_text'");
    }

    @Test
    @DisplayName("Verify actual live synthesis with configured ElevenLabs credentials")
    void testLiveElevenLabsSynthesis() {
        String apiKey  = resolveApiKey();
        String voiceId = resolveVoiceId();

        ElevenLabsConfig config = buildConfig(apiKey, voiceId);

        if (!config.isConfigured() || !config.hasDefaultVoice()) {
            System.out.println("[TEST] Skipping live synthesis test — no API key configured. " +
                    "Set ELEVENLABS_API_KEY environment variable or add application-local.properties.");
            return;
        }

        ElevenLabsService service = new ElevenLabsService(config);
        try {
            byte[] audioBytes = service.synthesize("Hello, welcome to your interview.", null);
            assertNotNull(audioBytes, "Audio bytes should not be null");
            assertTrue(audioBytes.length > 0, "Audio bytes should have non-zero length");
            // Standard MP3 sync word or ID3 header verification
            boolean isMp3OrId3 = (audioBytes.length > 3) && (
                    (audioBytes[0] == 'I' && audioBytes[1] == 'D' && audioBytes[2] == '3') || // ID3 tag
                    ((audioBytes[0] & 0xFF) == 0xFF && (audioBytes[1] & 0xE0) == 0xE0)         // MP3 sync word
            );
            assertTrue(isMp3OrId3,
                    "Returned audio should be a valid MP3 file format (got " + audioBytes.length + " bytes)");
            System.out.println("[TEST] Live synthesis OK — received " + audioBytes.length + " bytes of valid audio.");
        } catch (ElevenLabsService.VoiceServiceException e) {
            // If quota is reached or auth failed on third-party provider, verify typed error handling
            assertTrue(
                    "quota_exceeded".equals(e.getErrorCode()) ||
                    "rate_limited".equals(e.getErrorCode())   ||
                    "auth_failed".equals(e.getErrorCode()),
                    "Handled error code was: " + e.getErrorCode()
            );
            assertNotNull(e.getMessage(), "Error message should not be null");
            System.out.println("[TEST] ElevenLabs returned expected handled error: " + e.getErrorCode());
        }
    }
}
