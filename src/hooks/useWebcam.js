// src/hooks/useWebcam.js
import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing browser webcam access via MediaDevices API.
 * Handles permissions, stream lifecycle, error reporting, and cleanup.
 */
export function useWebcam() {
  const [stream, setStream] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('idle'); // 'idle' | 'granted' | 'denied' | 'unsupported'
  const [error, setError] = useState(null);

  // Keep a ref to the active stream for reliable cleanup in effects & async callbacks
  const streamRef = useRef(null);

  // Helper to stop all tracks in an active stream
  const stopTracks = useCallback((mediaStream) => {
    if (mediaStream && mediaStream.getTracks) {
      mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping media track:', e);
        }
      });
    }
  }, []);

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopTracks(streamRef.current);
      streamRef.current = null;
    }
    setStream(null);
    setIsStreaming(false);
    setIsLoading(false);
  }, [stopTracks]);

  // Start camera function
  const startCamera = useCallback(async () => {
    setError(null);

    // Verify browser support
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      const msg = 'Webcam access is not supported by your browser.';
      setError(msg);
      setPermissionStatus('unsupported');
      return;
    }

    setIsLoading(true);

    try {
      // If there's an existing stream, stop it first
      if (streamRef.current) {
        stopTracks(streamRef.current);
        streamRef.current = null;
      }

      // Request video only (no microphone in this feature)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsStreaming(true);
      setPermissionStatus('granted');
      setError(null);
    } catch (err) {
      console.error('Webcam getUserMedia error:', err);
      let userMessage = 'An error occurred while accessing the camera.';

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userMessage =
          'Camera permission was denied. Please allow camera access in your browser settings and try again.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userMessage = 'No camera device was detected. Please connect a camera and try again.';
        setPermissionStatus('denied');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        userMessage =
          'Your camera is currently unavailable. Please close other applications using the camera and try again.';
        setPermissionStatus('denied');
      } else if (
        err.name === 'OverconstrainedError' ||
        err.name === 'ConstraintNotSatisfiedError'
      ) {
        userMessage = 'The requested camera resolution or settings are not supported.';
        setPermissionStatus('denied');
      } else if (err.name === 'SecurityError') {
        userMessage =
          'Camera access was blocked due to a security restriction (e.g. non-HTTPS context).';
        setPermissionStatus('denied');
      } else {
        userMessage = err.message || userMessage;
        setPermissionStatus('denied');
      }

      setError(userMessage);
      setIsStreaming(false);
      setStream(null);
    } finally {
      setIsLoading(false);
    }
  }, [stopTracks]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (isStreaming) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isStreaming, startCamera, stopCamera]);

  // Cleanup on unmount - ensures camera LED turns off when leaving the page
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopTracks(streamRef.current);
        streamRef.current = null;
      }
    };
  }, [stopTracks]);

  return {
    stream,
    isStreaming,
    isLoading,
    permissionStatus,
    error,
    startCamera,
    stopCamera,
    toggleCamera,
  };
}

export default useWebcam;
