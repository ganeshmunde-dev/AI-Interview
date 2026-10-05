// src/components/interview/VoiceAnswerButton.jsx
import {
  HiOutlineMicrophone,
  HiOutlineStop,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

export default function VoiceAnswerButton({
  isListening,
  isSupported = true,
  error = null,
  onToggle,
  interimTranscript = '',
  className = '',
}) {
  if (!isSupported) {
    return (
      <div className={`p-2 rounded-xl bg-muted-app border border-app text-xs text-app-muted flex items-center gap-2 ${className}`}>
        <HiOutlineExclamationCircle className="text-yellow-500 flex-shrink-0" size={16} />
        <span>Voice input isn't supported in this browser. You can type your answer instead.</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggle}
          className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
              : 'border border-app hover:bg-muted-app text-app-secondary hover:text-app-primary'
          }`}
        >
          {isListening ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <HiOutlineStop size={14} />
              <span>Stop Listening</span>
            </>
          ) : (
            <>
              <HiOutlineMicrophone size={14} className="text-indigo-500" />
              <span>Voice Answer</span>
            </>
          )}
        </button>

        {/* Status Text & Audio Waves */}
        {isListening && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500">
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-medium text-[11px]">Listening... Speak clearly</span>
          </div>
        )}
      </div>

      {/* Live Interim Transcript Feedback */}
      {isListening && interimTranscript && (
        <div className="text-xs text-app-muted italic bg-muted-app/60 px-3 py-2 rounded-xl border border-app/60 animate-fadeIn">
          <span className="text-indigo-400 font-normal mr-1">Transcribing:</span>
          &ldquo;{interimTranscript}&rdquo;
        </div>
      )}

      {/* Error Message */}
      {error && !isListening && (
        <div className="flex items-start gap-1.5 text-xs text-red-500 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 leading-relaxed">
          <HiOutlineExclamationCircle className="flex-shrink-0 mt-0.5" size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
