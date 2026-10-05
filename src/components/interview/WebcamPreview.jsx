// src/components/interview/WebcamPreview.jsx
import { useEffect, useRef } from 'react';
import {
  HiOutlineVideoCamera,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { useWebcam } from '@/hooks/useWebcam';

export default function WebcamPreview({ autoStart = false }) {
  const {
    stream,
    isStreaming,
    isLoading,
    permissionStatus,
    error,
    startCamera,
    stopCamera,
  } = useWebcam();

  const videoRef = useRef(null);

  // Auto-start webcam if requested (e.g. in AI Interview mode)
  useEffect(() => {
    if (autoStart && !isStreaming && permissionStatus === 'idle') {
      startCamera();
    }
  }, [autoStart, isStreaming, permissionStatus, startCamera]);

  // Attach the active media stream to the video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Video Container Box */}
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-app bg-muted-app"
        style={{ background: 'rgb(var(--bg-muted))' }}
      >
        {/* Active live stream */}
        {isStreaming && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : (
          /* Non-streaming states */
          <div className="p-4 text-center flex flex-col items-center justify-center gap-2 max-w-xs">
            {isLoading ? (
              <>
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-1" />
                <p className="text-xs font-semibold text-app-primary">Initializing Camera...</p>
                <p className="text-[11px] text-app-muted">Please accept browser permission if prompted</p>
              </>
            ) : error || permissionStatus === 'denied' || permissionStatus === 'unsupported' ? (
              <>
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-1">
                  <HiOutlineExclamationCircle size={22} />
                </div>
                <p className="text-xs font-semibold text-red-500">
                  {permissionStatus === 'unsupported' ? 'Camera Unsupported' : 'Camera Error'}
                </p>
                <p className="text-[11px] text-app-muted leading-relaxed line-clamp-3">{error}</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-1">
                  <HiOutlineVideoCamera size={22} />
                </div>
                <p className="text-xs font-semibold text-app-primary">Camera Off</p>
                <p className="text-[11px] text-app-muted">
                  Enable your camera for a more realistic mock interview experience.
                </p>
              </>
            )}
          </div>
        )}

        {/* Live Status Overlay Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isStreaming ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-green-400 font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Camera Active</span>
            </div>
          ) : isLoading ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-yellow-400 font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span>Starting Camera</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-gray-400 font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span>Camera Off</span>
            </div>
          )}
        </div>
      </div>

      {/* Camera Controls */}
      <div className="flex items-center gap-2">
        {isStreaming ? (
          <button
            type="button"
            onClick={stopCamera}
            className="w-full py-2 px-3 rounded-xl border border-red-500/30 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <HiOutlineVideoCamera size={15} />
            Turn Off Camera
          </button>
        ) : (
          <button
            type="button"
            onClick={startCamera}
            disabled={isLoading || permissionStatus === 'unsupported'}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {error ? <HiOutlineRefresh size={15} /> : <HiOutlineVideoCamera size={15} />}
            {error ? 'Retry Camera' : 'Enable Camera'}
          </button>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="flex items-start gap-2 p-2.5 rounded-xl border border-app bg-muted-app/50 text-[11px] text-app-muted leading-relaxed">
        <HiOutlineShieldCheck size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>
          Your camera is used only during this interview. Video is not recorded or uploaded.
        </span>
      </div>
    </div>
  );
}
