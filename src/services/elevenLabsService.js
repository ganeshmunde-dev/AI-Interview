// src/services/elevenLabsService.js
// ──────────────────────────────────────────────────────────────────────────────
// ElevenLabs Voice Service (Frontend Proxy)
//
// Architecture: React → Spring Boot /api/voice/speak → ElevenLabs API
//
// IMPORTANT SECURITY NOTE:
//   The ElevenLabs API key is NEVER stored here or anywhere in the frontend.
//   This service only calls our own Spring Boot backend endpoint.
//   The backend holds and uses the ElevenLabs API key server-side.
// ──────────────────────────────────────────────────────────────────────────────

const BACKEND_URL    = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
const SPEAK_ENDPOINT = `${BACKEND_URL}/api/voice/speak`;

// ── Audio instance tracker ────────────────────────────────────────────────────
// We keep a single current audio context to prevent multiple voices playing simultaneously.
let currentAudio     = null;
let currentObjectUrl = null;

// ── AudioContext unlock state ─────────────────────────────────────────────────
// Some browsers require a user gesture before any audio can be played.
// We prime the context by creating and immediately suspending an AudioContext
// on first user interaction (e.g. clicking "Start Interview").
let audioUnlocked = false;

/**
 * Attempt to unlock browser audio on user interaction.
 * Safe to call multiple times — idempotent after first successful unlock.
 * Call this inside any user-click event handler (e.g. "Start Interview" button).
 */
export async function unlockAudio() {
  if (audioUnlocked) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      // Play a short silent buffer to prime audio element output
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      setTimeout(() => {
        try { ctx.close(); } catch { /* ignore */ }
      }, 300);
    }
    // Also prime SpeechSynthesis if available in this browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        /* ignore */
      }
    }
    audioUnlocked = true;
    console.log('[AI VOICE] AudioContext & SpeechSynthesis unlocked on user gesture.');
  } catch (err) {
    console.log('[AI VOICE] AudioContext unlock skipped or error:', err);
    audioUnlocked = true; // Mark as done so we don't keep trying
  }
}

/**
 * Revokes the current object URL and cleans up the audio instance.
 * Must be called before creating a new audio instance.
 */
function cleanupCurrentAudio() {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
  } catch {
    // Ignore cleanup errors
  }

  try {
    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
      currentObjectUrl = null;
    }
  } catch {
    // Ignore revoke errors
  }
}

/**
 * Stops any currently playing AI voice audio immediately.
 * Safe to call even when nothing is playing.
 */
export function stopCurrentAudio() {
  cleanupCurrentAudio();
}

/**
 * Requests TTS synthesis from the Spring Boot backend, plays the audio,
 * and returns a Promise that resolves when audio finishes (or rejects on error).
 *
 * @param {string} text - The text to be spoken.
 * @param {Object} [options]
 * @param {string} [options.voiceId] - Optional voice ID override (uses backend default if omitted).
 * @param {AbortSignal} [options.signal] - Optional AbortSignal to cancel mid-request.
 *
 * @returns {Promise<{ success: boolean, error?: string, isAutoplayBlocked?: boolean }>}
 *   Resolves when audio finishes playing.
 *   On failure: resolves with { success: false, error: '...' } (NEVER rejects)
 *   so callers do not need try/catch — the interview always continues.
 */
export async function speakText(text, options = {}) {
  // Stop any previously playing audio first
  cleanupCurrentAudio();

  if (!text || !text.trim()) {
    console.log('[AI-VOICE-DEBUG] speakText failed: No text provided');
    return { success: false, error: 'No text provided.' };
  }

  const { voiceId, signal } = options;

  // Set a 7-second fetch safety timeout
  const fetchController = new AbortController();
  const fetchTimeoutId = setTimeout(() => {
    fetchController.abort(new Error('Fetch timeout'));
  }, 7000);

  const onExternalAbort = () => {
    clearTimeout(fetchTimeoutId);
    fetchController.abort();
  };

  if (signal) {
    if (signal.aborted) {
      clearTimeout(fetchTimeoutId);
      return { success: false, error: 'Playback cancelled.', cancelled: true };
    }
    signal.addEventListener('abort', onExternalAbort, { once: true });
  }

  try {
    console.log(`[AI VOICE] Requesting speech: "${text.trim().slice(0, 60)}..." (${text.trim().length} chars)`);
    console.log('[AI-VOICE-DEBUG] ElevenLabs synthesis request START');

    const requestBody = { text: text.trim() };
    if (voiceId) requestBody.voiceId = voiceId;

    const response = await fetch(SPEAK_ENDPOINT, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(requestBody),
      signal:  fetchController.signal,
    });

    clearTimeout(fetchTimeoutId);
    if (signal) signal.removeEventListener('abort', onExternalAbort);

    console.log('[AI-VOICE-DEBUG] ElevenLabs synthesis request END');
    console.log(`[AI-VOICE-DEBUG] Response status: ${response.status}`);
    const contentType = response.headers.get('Content-Type') || '';
    console.log(`[AI VOICE] Content-Type: "${contentType}"`);

    // If the backend returned a non-audio response, it's an error JSON
    if (!response.ok || !contentType.includes('audio')) {
      let errorMessage = 'AI voice is temporarily unavailable. You can continue the interview using text.';
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // Could not parse error JSON — use default
      }

      // Special-case: 503 = not configured / quota — quiet fallback
      if (response.status === 503) {
        errorMessage = errorMessage.includes('quota') || errorMessage.includes('credit')
          ? errorMessage
          : 'AI voice is not configured on this server. Interview continues in text mode.';
      }

      console.warn(`[AI VOICE] Backend error (${response.status}):`, errorMessage);
      return { success: false, error: errorMessage };
    }

    // Get audio bytes and create a blob URL
    const audioBlob = await response.blob();
    console.log('[AI-VOICE-DEBUG] Audio blob received');
    console.log(`[AI-VOICE-DEBUG] Audio blob size: ${audioBlob.size}`);
    console.log(`[AI VOICE] Received audio blob: ${audioBlob.size} bytes, type: "${audioBlob.type}"`);

    if (!audioBlob || audioBlob.size === 0) {
      console.warn('[AI VOICE] Empty audio blob received.');
      return { success: false, error: 'Received empty audio from voice service.' };
    }

    const objectUrl = URL.createObjectURL(audioBlob);
    currentObjectUrl = objectUrl;
    console.log('[AI VOICE] Blob URL created, starting playback...');

    // Play via HTMLAudioElement with max duration based on text length + 6s buffer
    const estimatedSec = Math.max(6, Math.min(25, Math.ceil(text.trim().length / 10) + 6));
    return await playAudioBlob(objectUrl, signal, estimatedSec * 1000);

  } catch (err) {
    clearTimeout(fetchTimeoutId);
    if (signal) signal.removeEventListener('abort', onExternalAbort);

    // AbortError is expected when we cancel playback (next question, nav, etc.)
    if (err.name === 'AbortError' || err.message === 'Fetch timeout') {
      cleanupCurrentAudio();
      if (err.message === 'Fetch timeout') {
        console.warn('[AI VOICE] Backend fetch timed out after 7s.');
        return { success: false, error: 'Voice request timed out.' };
      }
      console.log('[AI VOICE] Fetch cancelled by AbortSignal.');
      return { success: false, error: 'Playback cancelled.', cancelled: true };
    }

    console.warn('[AI VOICE] Network or fetch error:', err.message);
    return {
      success: false,
      error: 'AI voice is temporarily unavailable. You can continue the interview using text.',
    };
  }
}

/**
 * Creates an HTMLAudioElement, plays the given object URL, and resolves when done.
 *
 * @param {string} objectUrl - Blob URL of the audio file.
 * @param {AbortSignal} [signal] - Optional AbortSignal to stop playback early.
 * @param {number} [maxDurationMs] - Max duration before safety timeout resolves.
 * @returns {Promise<{ success: boolean, error?: string, isAutoplayBlocked?: boolean, cancelled?: boolean }>}
 */
function playAudioBlob(objectUrl, signal, maxDurationMs = 15000) {
  return new Promise((resolve) => {
    console.log('[AI-VOICE-DEBUG] Creating audio element');
    const audio = new Audio(objectUrl);
    currentAudio = audio;
    console.log('[AI-VOICE-DEBUG] Audio element created');

    let settled = false;
    let safetyTimerId = null;

    const cleanup = () => {
      settled = true;
      if (safetyTimerId) {
        clearTimeout(safetyTimerId);
        safetyTimerId = null;
      }
      if (signal) {
        signal.removeEventListener('abort', abortHandler);
      }
      cleanupCurrentAudio();
    };

    // Safety timeout: guaranteed resolution
    safetyTimerId = setTimeout(() => {
      if (settled) return;
      console.warn(`[AI VOICE] Audio playback safety timeout fired after ${maxDurationMs}ms.`);
      cleanup();
      resolve({ success: true, timedOut: true });
    }, maxDurationMs);

    // Abort handler: stop audio if signal fires
    const abortHandler = () => {
      if (settled) return;
      cleanup();
      resolve({ success: false, error: 'Playback cancelled.', cancelled: true });
    };

    if (signal) {
      if (signal.aborted) {
        abortHandler();
        return;
      }
      signal.addEventListener('abort', abortHandler, { once: true });
    }

    audio.onended = () => {
      if (settled) return;
      console.log('[AI-VOICE-DEBUG] Audio playback ENDED');
      console.log('[AI VOICE] Playback ended successfully.');
      cleanup();
      resolve({ success: true });
    };

    audio.onerror = (event) => {
      if (settled) return;
      console.warn('[AI VOICE] Audio element playback error:', event);
      cleanup();
      resolve({
        success: false,
        error:   'Audio playback failed. You can continue the interview using text.',
      });
    };

    audio.onstalled = () => {
      console.warn('[AI VOICE] Audio playback stalled.');
    };

    // Start playback
    console.log('[AI-VOICE-DEBUG] Calling audio.play()');
    audio.play().then(() => {
      console.log('[AI-VOICE-DEBUG] audio.play() RESOLVED');
      console.log('[AI-VOICE-DEBUG] Audio playback STARTED');
      console.log('[AI VOICE] audio.play() resolved — playback started.');

      // If audio duration is known, adjust safety timeout
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        if (safetyTimerId) clearTimeout(safetyTimerId);
        const dynamicTimeout = Math.ceil(audio.duration * 1000) + 4000;
        safetyTimerId = setTimeout(() => {
          if (settled) return;
          console.warn(`[AI VOICE] Dynamic audio safety timeout fired after ${dynamicTimeout}ms.`);
          cleanup();
          resolve({ success: true, timedOut: true });
        }, dynamicTimeout);
      }
    }).catch((err) => {
      if (settled) return;

      if (err.name === 'NotAllowedError') {
        console.warn('[AI VOICE] Autoplay blocked by browser (NotAllowedError). User gesture required.');
        if (safetyTimerId) clearTimeout(safetyTimerId);
        settled = true;
        if (signal) signal.removeEventListener('abort', abortHandler);
        // Don't cleanup here — allow unlockAndPlay to retry with the same objectUrl
        resolve({
          success:          false,
          isAutoplayBlocked: true,
          error:            'Browser autoplay blocked. Click "Enable Voice" to start audio.',
          blockedObjectUrl: objectUrl,
        });
        return;
      }

      console.warn('[AI VOICE] audio.play() rejected:', err.name, err.message);
      cleanup();
      resolve({
        success: false,
        error:   'Audio could not be played in this browser. You can continue using text.',
      });
    });
  });
}
