// src/components/interview/AIInterviewerPanel.jsx
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineVolumeUp,
  HiOutlineVolumeOff,
  HiOutlineChatAlt,
} from 'react-icons/hi';
import { INTERVIEWER_PERSONALITIES } from '@/constants/appConstants';

function getContextualGuidance(personalityId = 'professional', role = 'frontend', phase = 'listening') {
  const p = (personalityId || 'professional').toLowerCase();
  const r = (role || 'frontend').toLowerCase();

  const isHR    = r.includes('hr');
  const isReact = r.includes('react') || r.includes('frontend');
  const isJava  = r.includes('java') || r.includes('spring') || r.includes('backend');

  if (phase === 'intro' || phase === 'introSpeaking') {
    return 'Welcome to your interview. The AI Interviewer is delivering the opening — please listen carefully.';
  }
  if (phase === 'evaluating') {
    return 'Analyzing your answer structure and technical depth...';
  }
  if (phase === 'followup') {
    return 'I have generated a targeted follow-up question based on your initial response.';
  }
  if (phase === 'transitioning') {
    return 'Good response. Preparing your next question...';
  }
  if (phase === 'closing') {
    return 'The interview is complete. Thank you for your time and effort.';
  }
  if (phase === 'done') {
    return 'All responses have been recorded. Proceed to view your results.';
  }

  switch (p) {
    case 'friendly':
      if (isHR)    return 'Stay relaxed and share the real experiences and teamwork moments that shaped your career.';
      if (isReact) return 'Take a breath and walk me through your React thinking step by step. You\'ve got this!';
      if (isJava)  return 'Focus on explaining your core design ideas—don\'t stress over minor syntax details.';
      return 'Stay relaxed and explain your thinking step by step.';

    case 'strict':
      if (isHR)    return 'Provide direct, unembellished answers backed by tangible metrics and concrete situational evidence.';
      if (isReact) return 'Be precise. Expect scrutiny on rendering cycles, state mutation risks, and edge cases.';
      if (isJava)  return 'Precision is key. Detail memory models, concurrency locks, and failure recovery mechanisms.';
      return 'Be precise and support your answers with clear reasoning.';

    case 'hr':
      if (isHR) return 'Answer naturally and use specific real-world examples using the STAR method where possible.';
      return 'Use the STAR method (Situation, Task, Action, Result) to highlight your collaboration and leadership.';

    case 'professional':
    default:
      if (isHR)    return 'Structure your thoughts methodically and highlight measurable organizational impacts.';
      if (isReact) return 'Focus on explaining your component architecture, state management, and performance trade-offs.';
      if (isJava)  return 'Be thorough with data structures, thread safety, and modular system design.';
      return 'Take your time and explain your reasoning clearly.';
  }
}

export default function AIInterviewerPanel({
  personality      = 'professional',
  role             = 'frontend',
  interviewPhase   = 'listening', // 'intro' | 'asking' | 'listening' | 'evaluating' | 'followup' | 'transitioning' | 'closing' | 'done'
  isSpeaking       = false,
  voiceEnabled     = true,
  voiceError       = null,
  isAutoplayBlocked = false,
  currentQuestionIndex = 0,  // 0-based index
  _totalQuestions  = 5,
  onToggleVoice,
  onUnlockVoice,
  className        = '',
}) {
  const currentPersona =
    INTERVIEWER_PERSONALITIES.find((p) => p.id === personality) || INTERVIEWER_PERSONALITIES[0];
  const guidance = getContextualGuidance(personality, role, interviewPhase);

  const qNum = currentQuestionIndex + 1;

  // Status mapping including 'closing' phase and question number
  const phaseConfig = {
    intro: {
      label: '🔊 Speaking introduction...',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      badge: 'Introduction',
    },
    introSpeaking: {
      label: '🔊 Speaking introduction...',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      badge: 'Introduction',
    },
    asking: {
      label: `🔊 Asking Question ${qNum}...`,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      badge: 'Speaking',
    },
    listening: {
      label: "🎤 Your turn — I'm listening",
      color: 'text-green-400 bg-green-500/10 border-green-500/30',
      badge: 'Listening',
    },
    evaluating: {
      label: '🧠 Analyzing your response...',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      badge: 'Analyzing',
    },
    followup: {
      label: '🔊 Asking follow-up...',
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      badge: 'Follow-Up',
    },
    transitioning: {
      label: '⏩ Preparing next question...',
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
      badge: 'Transition',
    },
    closing: {
      label: '🔊 Concluding interview...',
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      badge: 'Closing',
    },
    done: {
      label: '✓ Interview Complete',
      color: 'text-green-400 bg-green-500/10 border-green-500/30',
      badge: 'Completed',
    },
  }[interviewPhase] || {
    label: 'Ready',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    badge: 'Active',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-4 md:p-5 border border-app rounded-2xl ${className}`}
    >
      {/* Top row: Avatar + Persona + Status + Voice control */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar with speaking ring */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl border transition-all duration-300 ${
                isSpeaking
                  ? 'bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border-indigo-400/60 shadow-md shadow-indigo-500/20'
                  : 'bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border-indigo-500/25'
              }`}
            >
              {currentPersona.icon || '🤖'}
            </div>

            {/* Speaking pulse animation */}
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-2xl border border-indigo-400/50 animate-ping opacity-40" />
            )}

            {/* Active phase status dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-app-card ${
                isSpeaking
                  ? 'bg-indigo-400 animate-pulse'
                  : interviewPhase === 'listening'
                  ? 'bg-green-500'
                  : interviewPhase === 'evaluating'
                  ? 'bg-purple-500'
                  : interviewPhase === 'closing'
                  ? 'bg-violet-500 animate-pulse'
                  : 'bg-indigo-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold text-app-primary flex items-center gap-1">
                AI Interviewer
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {currentPersona.label}
              </span>
            </div>
            <p className="text-[11px] text-app-muted mt-0.5">
              {currentPersona.description}
            </p>
          </div>
        </div>

        {/* Voice mute/unmute action */}
        <button
          type="button"
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
          className={`p-2 rounded-xl transition-all border text-xs font-medium flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
            voiceEnabled
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300'
              : 'border-app bg-muted-app text-app-muted hover:bg-indigo-500/10 hover:text-indigo-400'
          }`}
        >
          {voiceEnabled ? <HiOutlineVolumeUp size={16} /> : <HiOutlineVolumeOff size={16} />}
        </button>
      </div>

      {/* Real-time Status Badge */}
      <div className="mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs font-medium bg-muted-app/80 border-app">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isSpeaking
                ? 'bg-indigo-400 animate-ping'
                : interviewPhase === 'listening'
                ? 'bg-green-400 animate-pulse'
                : interviewPhase === 'evaluating'
                ? 'bg-purple-400 animate-spin'
                : interviewPhase === 'closing'
                ? 'bg-violet-400 animate-pulse'
                : 'bg-indigo-400'
            }`}
          />
          <span className="truncate text-app-primary font-semibold">
            {phaseConfig.label}
          </span>
        </div>

        {isSpeaking && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full bg-indigo-400"
                animate={{ height: ['4px', `${8 + (i % 3) * 5}px`, '4px'] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Voice error display */}
      <AnimatePresence>
        {voiceError && !isAutoplayBlocked && (
          <motion.div
            key="voice-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300"
          >
            ⚠ {voiceError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autoplay unlock helper */}
      <AnimatePresence>
        {isAutoplayBlocked && (
          <motion.div
            key="autoplay-blocked"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2.5 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs"
          >
            <span className="text-indigo-300 font-medium text-[11px]">
              🔊 Click to enable AI interviewer voice
            </span>
            {onUnlockVoice && (
              <button
                type="button"
                onClick={onUnlockVoice}
                className="px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold transition-colors cursor-pointer"
              >
                Enable AI Voice
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contextual guidance prompt */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-muted-app/60 border border-app/60 flex items-start gap-2">
        <HiOutlineChatAlt size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-app-secondary italic leading-relaxed">
          &ldquo;{guidance}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}
