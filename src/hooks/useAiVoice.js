// src/hooks/useAiVoice.js
// ──────────────────────────────────────────────────────────────────────────────
// useAiVoice — Custom hook managing the AI Interviewer voice lifecycle.
//
// Dual-Tier Architecture:
//   Tier 1: ElevenLabs API via Spring Boot (/api/voice/speak)
//   Tier 2: Browser SpeechSynthesis (Web Speech API) as reliable instant fallback
//
// Responsibilities:
//   - Manages voiceEnabled preference (persisted to localStorage, NOT the API key)
//   - Manages isSpeaking / voiceError state
//   - Deduplicates TTS requests by a unique key (question ID)
//   - Stops previous audio before starting new audio
//   - Cleans up audio on component unmount
//   - Exposes isAiSpeaking guard for disabling the candidate microphone
//   - Unlocks browser AudioContext on first user interaction via unlockAudioContext()
//
// Security: The ElevenLabs API key is NEVER stored here or in localStorage.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from 'react';
import { speakText, stopCurrentAudio, unlockAudio } from '@/services/elevenLabsService';
import {
  speakBrowserText,
  stopBrowserSpeech,
  isBrowserSpeechSupported,
} from '@/services/browserSpeechService';

const LS_VOICE_ENABLED_KEY = 'interviewai_ai_voice_enabled';

export function useAiVoice() {
  // ── Voice enabled preference ────────────────────────────────────────────────
  const [voiceEnabled, setVoiceEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(LS_VOICE_ENABLED_KEY);
      if (stored === null) return true;
      return stored === 'true';
    } catch {
      return true;
    }
  });

  // ── Speaking and error state ─────────────────────────────────────────────────
  const [isSpeaking, setIsSpeaking]               = useState(false);
  const [voiceError, setVoiceError]               = useState(null);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);

  // ── Deduplication ref ────────────────────────────────────────────────────────
  const lastSpokenKeyRef = useRef(null);

  // ── Abort controller for cancelling in-flight requests ───────────────────────
  const abortControllerRef = useRef(null);

  // ── Track last blocked text + key so unlockAndPlay can retry ─────────────────
  const blockedSpeechRef = useRef({ text: null, uniqueKey: null });

  // ── Persist voiceEnabled to localStorage ─────────────────────────────────────
  const setVoiceEnabled = useCallback((enabled) => {
    setVoiceEnabledState(enabled);
    try {
      localStorage.setItem(LS_VOICE_ENABLED_KEY, String(enabled));
    } catch {
      // no-op
    }
  }, []);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled(!voiceEnabled);
  }, [voiceEnabled, setVoiceEnabled]);

  // ── Stop voice ───────────────────────────────────────────────────────────────
  const stopVoice = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopCurrentAudio();
    stopBrowserSpeech();
    setIsSpeaking(false);
  }, []);

  // ── Unlock AudioContext on user gesture ───────────────────────────────────────
  const unlockAudioContext = useCallback(async () => {
    await unlockAudio();
  }, []);

  // ── Internal speak engine ────────────────────────────────────────────────────
  /**
   * Core speak engine with automatic Web Speech fallback.
   *
   * Flow:
   * 1. Try ElevenLabs via backend proxy
   * 2. If ElevenLabs fails (network error, backend down, 503 quota), automatically
   *    fall back to Browser SpeechSynthesis (Web Speech API)
   * 3. If both fail or are unsupported, return voiceFailed so UI can show text fallback
   *
   * Guarantees:
   *   { success: true }                — audio played fully (ElevenLabs or Browser TTS)
   *   { success: false, skipped: true }— deduplicated / voiceEnabled=false / no text
   *   { success: false, isAutoplayBlocked: true } — browser blocked autoplay
   *   { success: false, voiceFailed: true, error: '...' } — all voice engines failed
   *   { success: false, cancelled: true }           — aborted by stopVoice / next question
   */
  const _speak = useCallback(async (text, uniqueKey, options = {}) => {
    // Cancel any previously in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Stop any currently playing audio
    stopCurrentAudio();
    stopBrowserSpeech();

    // Mark as current before async so re-renders cannot queue duplicates
    lastSpokenKeyRef.current = uniqueKey;

    setIsSpeaking(true);
    setVoiceError(null);
    setIsAutoplayBlocked(false);

    // ── Tier 1: Try ElevenLabs Synthesis ───────────────────────────────────────
    let result = await speakText(text, { ...options, signal: controller.signal });

    // If cancelled mid-request, bail out immediately
    if (controller.signal.aborted) {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsSpeaking(false);
      }
      return { success: false, cancelled: true };
    }

    // If ElevenLabs failed and it's NOT an explicit cancellation or autoplay block,
    // attempt Tier 2: Browser Web Speech API fallback
    if (!result.success && !result.isAutoplayBlocked && !result.cancelled) {
      if (isBrowserSpeechSupported()) {
        console.log('[AI VOICE] ElevenLabs unavailable. Falling back to Browser SpeechSynthesis...');
        console.log('[AI-VOICE-DEBUG] Falling back to Browser SpeechSynthesis...');
        result = await speakBrowserText(text, {
          personality: options.personality || 'professional',
          signal: controller.signal,
        });
      }
    }

    // Only process result if this controller is still current
    if (abortControllerRef.current === controller) {
      abortControllerRef.current = null;
      setIsSpeaking(false);

      if (result.isAutoplayBlocked) {
        blockedSpeechRef.current = { text, uniqueKey };
        setIsAutoplayBlocked(true);
        lastSpokenKeyRef.current = null; // allow retry
        return { ...result, isAutoplayBlocked: true };
      }

      if (!result.success && result.error && !result.cancelled) {
        if (!result.error.includes('cancelled') && !result.error.includes('interrupted')) {
          setVoiceError(result.error);
          lastSpokenKeyRef.current = null; // allow retry
        }
        return { ...result, voiceFailed: true };
      }

      if (result.cancelled || result.error === 'Playback cancelled.' || result.error?.includes('cancelled')) {
        return { ...result, cancelled: true };
      }
    } else {
      return { success: false, cancelled: true };
    }

    return result;
  }, []);

  // ── speakQuestion (fire-and-forget variant) ───────────────────────────────────
  const speakQuestion = useCallback(async (text, uniqueKey, options = {}) => {
    if (!voiceEnabled) {
      return { success: false, skipped: true };
    }
    if (!text || !text.trim() || !uniqueKey) {
      return { success: false, skipped: true };
    }
    if (lastSpokenKeyRef.current === uniqueKey) {
      console.log(`[AI VOICE] speakQuestion skipped — key "${uniqueKey}" already spoken.`);
      return { success: false, skipped: true };
    }
    console.log(`[AI VOICE] speakQuestion called — key: "${uniqueKey}"`);
    return await _speak(text, uniqueKey, options);
  }, [voiceEnabled, _speak]);

  // ── speakAndAwait (awaitable variant for sequential orchestration) ────────────
  const speakAndAwait = useCallback(async (text, uniqueKey, options = {}) => {
    if (!voiceEnabled) {
      console.log('[AI VOICE] speakAndAwait skipped — voiceEnabled is false.');
      return { success: false, skipped: true };
    }
    if (!text || !text.trim() || !uniqueKey) {
      return { success: false, skipped: true };
    }
    if (lastSpokenKeyRef.current === uniqueKey) {
      console.log(`[AI VOICE] speakAndAwait skipped — key "${uniqueKey}" already spoken.`);
      return { success: false, skipped: true };
    }
    console.log(`[AI VOICE] speakAndAwait called — key: "${uniqueKey}"`);
    console.log('[AI-VOICE-DEBUG] speakAndAwait called for key:', uniqueKey);
    const res = await _speak(text, uniqueKey, options);
    console.log('[AI-VOICE-DEBUG] speakAndAwait resolved for key:', uniqueKey, res);
    return res;
  }, [voiceEnabled, _speak]);

  // ── unlockAndPlay ─────────────────────────────────────────────────────────────
  const unlockAndPlay = useCallback((text, uniqueKey, options = {}) => {
    setIsAutoplayBlocked(false);
    lastSpokenKeyRef.current = null;
    const prevBlocked = blockedSpeechRef.current;
    blockedSpeechRef.current = { text: null, uniqueKey: null };

    const effectiveText = text || prevBlocked.text;
    const effectiveKey  = uniqueKey || prevBlocked.uniqueKey;

    if (effectiveText && effectiveKey) {
      speakQuestion(effectiveText, effectiveKey, options);
    }
  }, [speakQuestion]);

  // ── Reset deduplication key on voice re-enable ───────────────────────────────
  const prevVoiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    if (voiceEnabled && !prevVoiceEnabledRef.current) {
      lastSpokenKeyRef.current = null;
    }
    prevVoiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  // ── Stop voice when disabled ──────────────────────────────────────────────────
  useEffect(() => {
    if (!voiceEnabled) {
      stopVoice();
    }
  }, [voiceEnabled, stopVoice]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      stopCurrentAudio();
      stopBrowserSpeech();
    };
  }, []);

  return {
    voiceEnabled,
    isSpeaking,
    voiceError,
    isAutoplayBlocked,
    isAiSpeaking: isSpeaking,
    speakQuestion,
    speakAndAwait,
    unlockAndPlay,
    unlockAudioContext,
    stopVoice,
    toggleVoice,
    setVoiceEnabled,
  };
}
