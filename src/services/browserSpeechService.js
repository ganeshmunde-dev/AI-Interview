// src/services/browserSpeechService.js
// ──────────────────────────────────────────────────────────────────────────────
// Browser Speech Synthesis (Web Speech API) Service
//
// Fallback & client-side TTS engine using window.speechSynthesis.
// Features:
//   - Asynchronous voice loading with `voiceschanged` event support
//   - Intelligent voice selection (prioritizes high-quality natural/English voices)
//   - Chrome long-speech freeze workaround (speechSynthesis.resume() heartbeat)
//   - Safe cancellation and AbortSignal support
//   - Stale-event prevention and memory leak cleanup
// ──────────────────────────────────────────────────────────────────────────────

let availableVoices = [];
let voiceLoadPromise = null;
let resumeIntervalId = null;
let currentUtterance = null;

/**
 * Checks if SpeechSynthesis is supported in the current browser.
 */
export function isBrowserSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

/**
 * Wait for speech synthesis voices to be loaded by the browser.
 * Chrome and Edge populate voices asynchronously via the `voiceschanged` event.
 *
 * @param {number} timeoutMs Max wait time in ms (default 1500ms)
 * @returns {Promise<SpeechSynthesisVoice[]>}
 */
export function getBrowserVoices(timeoutMs = 1500) {
  if (!isBrowserSpeechSupported()) {
    return Promise.resolve([]);
  }

  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) {
    availableVoices = existing;
    return Promise.resolve(existing);
  }

  if (voiceLoadPromise) {
    return voiceLoadPromise;
  }

  voiceLoadPromise = new Promise((resolve) => {
    let resolved = false;

    const cleanup = () => {
      resolved = true;
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        cleanup();
        availableVoices = window.speechSynthesis.getVoices() || [];
        resolve(availableVoices);
      }
    }, timeoutMs);

    const onVoicesChanged = () => {
      if (!resolved) {
        clearTimeout(timer);
        cleanup();
        availableVoices = window.speechSynthesis.getVoices() || [];
        resolve(availableVoices);
      }
    };

    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    // Trigger getVoices() once to nudge the browser
    const immediate = window.speechSynthesis.getVoices();
    if (immediate && immediate.length > 0) {
      clearTimeout(timer);
      cleanup();
      availableVoices = immediate;
      resolve(immediate);
    }
  });

  return voiceLoadPromise;
}

/**
 * Select the best English voice from the loaded voices list.
 *
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} [_personality]
 * @returns {SpeechSynthesisVoice|null}
 */
function selectBestVoice(voices, _personality = 'professional') {
  if (!voices || voices.length === 0) return null;

  // Preferred voice keywords for high-quality natural speech
  const preferredKeywords = [
    'natural', 'premium', 'google us english', 'microsoft jenny',
    'microsoft guy', 'microsoft aria', 'samantha', 'karen', 'daniel', 'serena'
  ];

  // Try to find matching preferred English voice
  for (const keyword of preferredKeywords) {
    const match = voices.find(
      (v) => v.name.toLowerCase().includes(keyword) && v.lang.toLowerCase().startsWith('en')
    );
    if (match) return match;
  }

  // Fallback to any en-US voice
  const enUs = voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
  if (enUs) return enUs;

  // Fallback to any English voice
  const anyEn = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
  if (anyEn) return anyEn;

  // Default voice
  const defaultVoice = voices.find((v) => v.default);
  return defaultVoice || voices[0];
}

/**
 * Stops any currently active browser speech synthesis immediately.
 */
export function stopBrowserSpeech() {
  if (!isBrowserSpeechSupported()) return;

  if (resumeIntervalId) {
    clearInterval(resumeIntervalId);
    resumeIntervalId = null;
  }

  if (currentUtterance) {
    currentUtterance.onstart = null;
    currentUtterance.onend = null;
    currentUtterance.onerror = null;
    currentUtterance = null;
  }

  try {
    window.speechSynthesis.cancel();
  } catch (err) {
    console.warn('[BrowserSpeech] cancel error:', err);
  }
}

/**
 * Speaks text using the browser Web Speech API.
 * Returns a promise that resolves when speech completes or fails.
 *
 * @param {string} text
 * @param {Object} [options]
 * @param {string} [options.personality] - 'professional' | 'friendly' | 'strict' | 'hr'
 * @param {AbortSignal} [options.signal] - Optional AbortSignal to cancel mid-speech
 * @returns {Promise<{ success: boolean, error?: string, isAutoplayBlocked?: boolean, cancelled?: boolean }>}
 */
export async function speakBrowserText(text, options = {}) {
  if (!isBrowserSpeechSupported()) {
    return { success: false, error: 'Browser SpeechSynthesis is not supported.' };
  }

  stopBrowserSpeech();

  if (!text || !text.trim()) {
    return { success: false, error: 'No text provided.' };
  }

  const { personality = 'professional', signal } = options;

  // Ensure voices are initialized
  const voices = await getBrowserVoices(1000);
  const voice = selectBestVoice(voices, personality);

  return new Promise((resolve) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      currentUtterance = utterance;

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      // Configure speech rate & pitch based on interviewer personality
      if (personality === 'friendly') {
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
      } else if (personality === 'strict') {
        utterance.rate = 0.95;
        utterance.pitch = 0.92;
      } else {
        utterance.rate = 0.98;
        utterance.pitch = 1.0;
      }

      let isFinished = false;
      let safetyTimerId = null;
      let startCheckTimerId = null;

      const cleanup = () => {
        isFinished = true;
        if (safetyTimerId) { clearTimeout(safetyTimerId); safetyTimerId = null; }
        if (startCheckTimerId) { clearTimeout(startCheckTimerId); startCheckTimerId = null; }
        if (resumeIntervalId) {
          clearInterval(resumeIntervalId);
          resumeIntervalId = null;
        }
        if (signal) {
          signal.removeEventListener('abort', onAbort);
        }
        if (currentUtterance === utterance) {
          currentUtterance = null;
        }
      };

      const onAbort = () => {
        if (isFinished) return;
        cleanup();
        stopBrowserSpeech();
        resolve({ success: false, cancelled: true, error: 'Playback cancelled.' });
      };

      if (signal) {
        if (signal.aborted) {
          resolve({ success: false, cancelled: true, error: 'Playback cancelled.' });
          return;
        }
        signal.addEventListener('abort', onAbort, { once: true });
      }

      // ── Safety timeout ────────────────────────────────────────────────────────
      // Chrome's speechSynthesis can get stuck — utterances queued but onend never fires.
      // We estimate max speech duration from text length (avg ~14 chars/sec at rate 1.0)
      // and add a 4s buffer. This prevents the Promise from hanging.
      const charsPerSecond = Math.max(8, 14 * (utterance.rate || 1.0));
      const estimatedDurationMs = Math.ceil((text.trim().length / charsPerSecond) * 1000);
      const safetyTimeoutMs = Math.max(5000, estimatedDurationMs + 4000);

      safetyTimerId = setTimeout(() => {
        if (isFinished) return;
        console.warn(`[BrowserSpeech] Safety timeout fired after ${safetyTimeoutMs}ms — utterance never completed. Resolving.`);
        cleanup();
        try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
        resolve({ success: true, timedOut: true });
      }, safetyTimeoutMs);

      // ── Start check: if speech hasn't started within 3s, Chrome may be stuck ─
      startCheckTimerId = setTimeout(() => {
        if (isFinished) return;
        // If still pending 3s after speak() was called, attempt a resume nudge
        if (!window.speechSynthesis.speaking) {
          console.warn('[BrowserSpeech] Speech not started after 3s — nudging speechSynthesis...');
          try {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
          } catch { /* ignore */ }
        }
      }, 3000);

      utterance.onstart = () => {
        if (startCheckTimerId) { clearTimeout(startCheckTimerId); startCheckTimerId = null; }
        console.log('[BrowserSpeech] Utterance started speaking.');
        // Chrome bug workaround: keep speechSynthesis active for utterances > 15s
        if (resumeIntervalId) clearInterval(resumeIntervalId);
        resumeIntervalId = setInterval(() => {
          if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);
      };

      utterance.onend = () => {
        if (isFinished) return;
        cleanup();
        console.log('[BrowserSpeech] Utterance ended successfully.');
        resolve({ success: true });
      };

      utterance.onerror = (event) => {
        if (isFinished) return;
        cleanup();

        const errorType = event.error || 'unknown';
        console.warn(`[BrowserSpeech] Speech error: ${errorType}`);

        if (errorType === 'canceled' || errorType === 'interrupted') {
          resolve({ success: false, cancelled: true, error: 'Playback cancelled.' });
        } else if (errorType === 'not-allowed') {
          resolve({
            success: false,
            isAutoplayBlocked: true,
            error: 'Browser autoplay blocked. Click to enable speech.',
          });
        } else {
          resolve({
            success: false,
            error: `Browser speech synthesis error: ${errorType}`,
          });
        }
      };

      // Reset any paused state before speaking
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[BrowserSpeech] Failed to initialize SpeechSynthesisUtterance:', err);
      resolve({
        success: false,
        error: err.message || 'Speech synthesis failed to start.',
      });
    }
  });
}

// Pre-warm voices on module load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  getBrowserVoices().catch(() => {});
}
