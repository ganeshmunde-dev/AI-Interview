// src/hooks/useSpeechRecognition.js
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for Web Speech Recognition API.
 * Supports continuous listening, real-time interim results,
 * finalized text extraction without duplicates, error handling, and lifecycle cleanup.
 *
 * @param {Object} options
 * @param {function(string): void} [options.onFinalSegment] - Callback invoked with each unique finalized speech segment
 * @param {string} [options.lang] - Language code (defaults to navigator.language or 'en-US')
 */
export function useSpeechRecognition({ onFinalSegment, lang } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  // Check Web Speech API availability
  const isSupported =
    typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const recognitionRef = useRef(null);
  const isManuallyStoppedRef = useRef(false);
  const onFinalSegmentRef = useRef(onFinalSegment);

  // Keep callback ref updated to prevent stale closures
  useEffect(() => {
    onFinalSegmentRef.current = onFinalSegment;
  }, [onFinalSegment]);

  // Stop listening
  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Reset transcript accumulator
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  // Start listening
  const startListening = useCallback(() => {
    setError(null);

    if (!isSupported) {
      setError("Voice input isn't supported in this browser. You can type your answer instead.");
      return;
    }

    // If an existing instance is running, stop it
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
    }

    try {
      const SpeechRecognitionConstructor =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang || (typeof navigator !== 'undefined' ? navigator.language : 'en-US') || 'en-US';

      isManuallyStoppedRef.current = false;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';

          if (result.isFinal) {
            const trimmed = text.trim();
            if (trimmed) {
              setTranscript((prev) => (prev ? `${prev} ${trimmed}` : trimmed));
              if (onFinalSegmentRef.current) {
                onFinalSegmentRef.current(trimmed);
              }
            }
          } else {
            currentInterim += text;
          }
        }

        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        let userMessage = 'An error occurred during speech recognition.';

        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            userMessage =
              'Microphone permission was denied. Please allow microphone access in your browser settings and try again.';
            setIsListening(false);
            break;
          case 'no-speech':
            // No speech detected is common during pauses; don't break the session
            return;
          case 'network':
            userMessage = 'Network error during speech recognition. Please check your connection.';
            setIsListening(false);
            break;
          case 'audio-capture':
            userMessage = 'No microphone was found or your microphone is busy.';
            setIsListening(false);
            break;
          case 'aborted':
            // Manual abort or user stopped, ignore
            return;
          default:
            userMessage = `Speech recognition error: ${event.error}`;
            setIsListening(false);
            break;
        }

        setError(userMessage);
      };

      recognition.onend = () => {
        // Auto-restart if user did not manually stop (for long pauses on some browsers)
        if (!isManuallyStoppedRef.current && recognitionRef.current === recognition) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      setError('Could not start microphone. Please check permissions.');
      setIsListening(false);
    }
  }, [isSupported, lang]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isManuallyStoppedRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
    toggleListening,
  };
}

export default useSpeechRecognition;
