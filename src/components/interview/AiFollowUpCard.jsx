// src/components/interview/AiFollowUpCard.jsx
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineSparkles,
  HiOutlineChatAlt2,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import VoiceAnswerButton from './VoiceAnswerButton';

export default function AiFollowUpCard({
  followUpData, // { question, answer, generated, source, isLoading, error }
  onAnswerChange,
  onSubmitFollowUp,
  onRetry,
  // Speech recognition props for follow-up
  isListening,
  isSpeechSupported,
  speechError,
  onToggleSpeech,
  interimTranscript,
  className = '',
}) {
  if (!followUpData) return null;

  const {
    question = '',
    answer = '',
    source = 'AI',
    isLoading = false,
    error = null,
    isSubmitted = false,
  } = followUpData;

  const isAi = source === 'AI';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className={`p-5 rounded-2xl border transition-all ${
          isAi
            ? 'bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/30 shadow-md shadow-indigo-500/5'
            : 'bg-muted-app/60 border-app shadow-sm'
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                isAi
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600'
              }`}
            >
              <HiOutlineSparkles size={14} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-app-primary flex items-center gap-1.5">
                {isAi ? 'AI Interviewer Follow-Up' : 'Suggested Follow-Up'}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    isAi
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-muted-app text-app-muted border border-app'
                  }`}
                >
                  {isAi ? '✨ Gemini AI' : 'Contextual'}
                </span>
              </h4>
            </div>
          </div>

          {isSubmitted && (
            <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
              <HiOutlineCheckCircle size={15} />
              Follow-up saved
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-6 flex flex-col items-center justify-center gap-3 text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <HiOutlineSparkles className="absolute text-indigo-400 animate-pulse" size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-app-primary">
                🤖 AI Interviewer is thinking...
              </p>
              <p className="text-[11px] text-app-muted mt-0.5">
                Analyzing your answer and formulating a targeted follow-up question.
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="py-3 flex flex-col items-start gap-2">
            <div className="flex items-start gap-2 text-xs text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 w-full">
              <HiOutlineExclamationCircle className="flex-shrink-0 mt-0.5" size={16} />
              <div className="flex-1">
                <p className="font-semibold">{error}</p>
                <p className="text-[11px] text-red-400/90 mt-0.5">
                  AI follow-up is temporarily unavailable. You may try again or proceed to the next question.
                </p>
              </div>
            </div>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-400 font-medium px-3 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/10 transition-colors"
              >
                <HiOutlineRefresh size={14} />
                Try Again
              </button>
            )}
          </div>
        )}

        {/* Active Follow-Up Question & Answer Area */}
        {!isLoading && !error && question && (
          <div className="space-y-3.5">
            {/* Follow-up question text */}
            <div className="p-3.5 rounded-xl bg-app-card border border-app">
              <p className="text-xs md:text-sm font-medium text-app-primary leading-relaxed">
                &ldquo;{question}&rdquo;
              </p>
            </div>

            {/* Speaking / Listening state banner */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs">
              {isListening ? (
                <span className="text-green-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  🎤 Microphone listening for follow-up answer...
                </span>
              ) : (
                <span className="text-indigo-300 font-medium flex items-center gap-1.5">
                  <HiOutlineChatAlt2 size={13} className="text-indigo-400" />
                  🎤 Your turn to answer
                </span>
              )}
            </div>

            {/* Answer textarea & voice toggle */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <label className="block text-xs font-medium text-app-muted flex items-center gap-1.5">
                  <HiOutlineChatAlt2 size={14} className="text-indigo-500" />
                  Your Follow-Up Response
                </label>
                {onToggleSpeech && (
                  <VoiceAnswerButton
                    isListening={isListening}
                    isSupported={isSpeechSupported}
                    error={speechError}
                    onToggle={onToggleSpeech}
                    interimTranscript={interimTranscript}
                  />
                )}
              </div>

              <textarea
                value={answer}
                onChange={(e) => onAnswerChange?.(e.target.value)}
                placeholder="Answer the follow-up question here (or use Voice Answer)... Explain your reasoning clearly."
                rows={4}
                className="input-field resize-none text-xs md:text-sm leading-relaxed"
              />

              <div className="flex justify-between items-center text-xs">
                <span className="text-app-muted">
                  {(answer || '').length} characters
                </span>
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${answer ? 'text-green-500' : 'text-app-muted'}`}>
                    {answer ? '✓ Follow-up auto-saved' : 'Not answered yet'}
                  </span>
                  {onSubmitFollowUp && (
                    <button
                      type="button"
                      onClick={onSubmitFollowUp}
                      disabled={!answer.trim()}
                      className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Save Follow-Up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
