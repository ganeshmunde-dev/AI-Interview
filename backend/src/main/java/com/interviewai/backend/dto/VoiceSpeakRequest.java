package com.interviewai.backend.dto;

/**
 * VoiceSpeakRequest
 *
 * DTO for POST /api/voice/speak
 *
 * The frontend sends the text to be spoken and optionally a voiceId.
 * If voiceId is absent or blank, the backend uses the configured default
 * from ELEVENLABS_VOICE_ID environment variable.
 *
 * The ElevenLabs API key is NEVER part of this DTO — it is read exclusively
 * from backend environment/configuration and never sent to the frontend.
 */
public class VoiceSpeakRequest {

    /**
     * The text the AI interviewer should speak.
     * Must be non-null and non-blank.
     */
    private String text;

    /**
     * Optional: ElevenLabs voice ID to use for this request.
     * If blank or null, the backend-configured default voice is used.
     * The frontend cannot override security-sensitive config (API key, model).
     */
    private String voiceId;

    public VoiceSpeakRequest() {}

    public VoiceSpeakRequest(String text, String voiceId) {
        this.text = text;
        this.voiceId = voiceId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getVoiceId() {
        return voiceId;
    }

    public void setVoiceId(String voiceId) {
        this.voiceId = voiceId;
    }

    /**
     * Returns the effective voice ID: provided value or null (caller should use configured default).
     */
    public String getEffectiveVoiceId() {
        return (voiceId != null && !voiceId.isBlank()) ? voiceId.trim() : null;
    }
}
