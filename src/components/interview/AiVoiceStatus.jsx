// src/components/interview/AiVoiceStatus.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineExclamationCircle } from 'react-icons/hi';

/**
 * AiVoiceStatus
 *
 * Premium UI component that shows the current state of the AI Interviewer voice.
 *
 * States:
 *   disabled  — voice is OFF by user preference
 *   speaking  — AI is currently speaking
 *   error     — voice failed (interview still continues)
 *   idle      — voice is ON and ready
 *
 * Designed to match the existing InterviewAI glass-card design system.
 */
export default function AiVoiceStatus({
  isSpeaking = false,
  voiceEnabled = true,
  voiceError = null,
  isAutoplayBlocked = false,
  onToggleVoice,
  onUnlockVoice,
  className = '',
}) {
  const state = !voiceEnabled
    ? 'disabled'
    : isAutoplayBlocked
    ? 'blocked'
    : isSpeaking
    ? 'speaking'
    : voiceError
    ? 'error'
    : 'idle';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-4 border border-app rounded-2xl ${className}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {/* AI avatar with speaking pulse */}
          <div className="relative flex-shrink-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all duration-300 ${
              state === 'speaking'
                ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-indigo-400/50 shadow-sm shadow-indigo-500/20'
                : state === 'error'
                ? 'bg-red-500/10 border-red-400/30'
                : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20'
            }`}>
              🤖
            </div>
            {/* Pulse ring when speaking */}
            {state === 'speaking' && (
              <span className="absolute -inset-1 rounded-xl border border-indigo-400/40 animate-ping opacity-40" />
            )}
            {/* Green ready dot when idle */}
            {state === 'idle' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-app-card" />
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-app-primary">AI Interviewer</h3>
            <StatusLabel state={state} />
          </div>
        </div>

        {/* Voice toggle button */}
        <button
          type="button"
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Mute AI Interviewer' : 'Enable AI Voice'}
          className={`p-2 rounded-xl transition-all border text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
            voiceEnabled
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300'
              : 'border-app bg-muted-app text-app-muted hover:bg-indigo-500/10 hover:text-indigo-400'
          }`}
        >
          {voiceEnabled ? (
            <HiOutlineVolumeUp size={15} />
          ) : (
            <HiOutlineVolumeOff size={15} />
          )}
        </button>
      </div>

      {/* Speaking waveform animation */}
      <AnimatePresence mode="wait">
        {state === 'speaking' && (
          <motion.div
            key="waveform"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              {/* Animated audio bars */}
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-indigo-400"
                    animate={{
                      height: ['6px', `${10 + (i % 3) * 5}px`, '6px'],
                    }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.12,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-indigo-300">
                Speaking...
              </span>
            </div>
          </motion.div>
        )}

        {state === 'blocked' && (
          <motion.div
            key="blocked"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30"
          >
            <div className="flex items-center gap-1.5 text-xs text-indigo-300">
              <HiOutlineVolumeUp size={14} className="text-indigo-400" />
              <span>Click to start AI voice</span>
            </div>
            {onUnlockVoice && (
              <button
                type="button"
                onClick={onUnlockVoice}
                className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Enable Voice
              </button>
            )}
          </motion.div>
        )}

        {state === 'idle' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-green-500 font-medium px-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Ready
          </motion.div>
        )}

        {state === 'disabled' && (
          <motion.div
            key="disabled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-app-muted px-1"
          >
            <HiOutlineVolumeOff size={12} className="text-app-muted" />
            Voice muted — interview continues in text mode
          </motion.div>
        )}

        {state === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <HiOutlineExclamationCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300 leading-relaxed">
              AI voice temporarily unavailable. You can continue the interview using text.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Status label sub-component ────────────────────────────────────────────────
function StatusLabel({ state }) {
  const labels = {
    speaking: { text: '🔊 Speaking...', className: 'text-indigo-400' },
    blocked:  { text: '🎙 Tap to Listen', className: 'text-indigo-400 font-semibold' },
    idle:     { text: 'Voice active',  className: 'text-green-500' },
    error:    { text: '⚠ Unavailable', className: 'text-amber-400' },
    disabled: { text: 'Voice OFF',     className: 'text-app-muted' },
  };
  const { text, className } = labels[state] || labels.idle;
  return <p className={`text-[10px] font-medium mt-0.5 ${className}`}>{text}</p>;
}
