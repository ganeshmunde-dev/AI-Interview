package com.interviewai.backend.controller;

import com.interviewai.backend.dto.VoiceSpeakRequest;
import com.interviewai.backend.service.ElevenLabsService;
import com.interviewai.backend.service.ElevenLabsService.VoiceServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * VoiceController
 *
 * REST endpoint for ElevenLabs AI Voice.
 *
 * POST /api/voice/speak
 *   Request:  { "text": "...", "voiceId": "..." (optional) }
 *   Success:  200 audio/mpeg  (raw MP3 bytes)
 *   Error:    400/503/502 JSON { "error": "...", "code": "..." }
 *
 * Architecture: React → /api/voice/speak → ElevenLabsService → ElevenLabs API
 *
 * Security:
 *   - The ElevenLabs API key is NEVER returned in any response.
 *   - The ElevenLabs API key is NEVER logged with its value.
 *   - Error messages are safe, user-friendly strings.
 *   - Stack traces are NEVER sent to the client.
 */
@RestController
@RequestMapping("/api/voice")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VoiceController {

    private static final Logger log = LoggerFactory.getLogger(VoiceController.class);

    @Autowired
    private ElevenLabsService elevenLabsService;

    /**
     * POST /api/voice/speak
     *
     * Accepts text and optional voiceId, calls ElevenLabs via ElevenLabsService,
     * and streams back raw audio/mpeg bytes.
     *
     * On success:  HTTP 200 with Content-Type: audio/mpeg
     * On failure:  HTTP error with JSON body { "error": "...", "code": "..." }
     */
    @PostMapping("/speak")
    public ResponseEntity<?> speak(@RequestBody VoiceSpeakRequest request) {

        // Basic input validation
        if (request == null || request.getText() == null || request.getText().isBlank()) {
            log.warn("[VoiceController] Received speak request with empty text.");
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "error", "Text is required for speech synthesis.",
                            "code", "empty_text"
                    ));
        }

        // Prevent excessively large requests
        if (request.getText().length() > 5000) {
            log.warn("[VoiceController] Text too long: {} characters.", request.getText().length());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "error", "Text is too long. Maximum 5000 characters.",
                            "code", "text_too_long"
                    ));
        }

        try {
            byte[] audioBytes = elevenLabsService.synthesize(
                    request.getText(),
                    request.getEffectiveVoiceId()
            );

            // Stream audio bytes back with correct content type
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
            headers.setContentLength(audioBytes.length);
            headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
            headers.set("X-Voice-Status", "success");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(audioBytes);

        } catch (VoiceServiceException e) {
            log.warn("[VoiceController] Voice synthesis failed — code: {}, message: {}", e.getErrorCode(), e.getMessage());

            HttpStatus httpStatus = mapErrorCodeToStatus(e.getErrorCode());

            return ResponseEntity
                    .status(httpStatus)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "error", e.getMessage(),
                            "code", e.getErrorCode()
                    ));

        } catch (Exception e) {
            // Catch-all: never expose internal details or stack trace to frontend
            log.error("[VoiceController] Unexpected error during voice synthesis: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "error", "An unexpected error occurred with the voice service. You can continue the interview using text.",
                            "code", "unexpected_error"
                    ));
        }
    }

    /**
     * Maps VoiceServiceException error codes to appropriate HTTP status codes.
     */
    private HttpStatus mapErrorCodeToStatus(String errorCode) {
        if (errorCode == null) return HttpStatus.INTERNAL_SERVER_ERROR;
        return switch (errorCode) {
            case "empty_text", "text_too_long", "bad_request", "invalid_text" -> HttpStatus.BAD_REQUEST;
            case "not_configured", "no_voice_id", "quota_exceeded"             -> HttpStatus.SERVICE_UNAVAILABLE;
            case "auth_failed"                                                  -> HttpStatus.SERVICE_UNAVAILABLE; // Don't expose 401/403 details
            case "voice_not_found"                                              -> HttpStatus.SERVICE_UNAVAILABLE;
            case "rate_limited"                                                 -> HttpStatus.TOO_MANY_REQUESTS;
            case "network_error", "server_error", "interrupted"                -> HttpStatus.BAD_GATEWAY;
            default                                                             -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
    }
}
