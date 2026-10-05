// src/pages/interview/InterviewScreen.jsx
import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineCheck,
  HiOutlineVideoCamera, HiOutlineClock, HiOutlineSparkles,
  HiOutlineMicrophone, HiOutlineStop, HiOutlineVolumeUp,
  HiOutlineInformationCircle, HiOutlineX, HiOutlineCheckCircle,
} from 'react-icons/hi';
import { useInterview } from '@/context/InterviewContext';
import { INTERVIEW_MODES } from '@/constants/appConstants';
import { formatTimer } from '@/utils/helpers';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

import WebcamPreview from '@/components/interview/WebcamPreview';
import VoiceAnswerButton from '@/components/interview/VoiceAnswerButton';
import AiFollowUpCard from '@/components/interview/AiFollowUpCard';
import AIInterviewerPanel from '@/components/interview/AIInterviewerPanel';
import InterviewTimeline from '@/components/interview/InterviewTimeline';
import AiThinkingState from '@/components/interview/AiThinkingState';
import InterviewSessionSummaryModal from '@/components/interview/InterviewSessionSummaryModal';

import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useCountdown } from '@/hooks/useCountdown';
import { useAiVoice } from '@/hooks/useAiVoice';
import { generateFollowUpQuestion, evaluateAnswerWithAI } from '@/services/aiEvaluationService';
import {
  generateIntroText,
  generateClosingText,
  shouldAutoFollowUp,
  getFollowUpIntroduction,
} from '@/hooks/useInterviewFlow';
import {
  evaluateAnswer,
  computeNextDifficulty,
  getAdaptiveFeedbackMessage,
  DIFFICULTY_LABELS,
} from '@/utils/adaptiveEngine';
import sessionLogger, { SESSION_EVENT_TYPES } from '@/utils/interviewSessionLogger';

// ── Timer bar ─────────────────────────────────────────────────────────────────
function TimerBar({ percentageRemaining, isCritical, isWarning }) {
  const color = isCritical
    ? 'bg-red-500 shadow-sm shadow-red-500/50'
    : isWarning
    ? 'bg-yellow-500'
    : 'bg-green-500';

  return (
    <div className="w-full h-2 rounded-full bg-muted-app overflow-hidden">
      <motion.div
        animate={{ width: `${Math.max(0, Math.min(100, percentageRemaining))}%` }}
        transition={{ duration: 0.25 }}
        className={`h-full rounded-full transition-colors ${color}`}
      />
    </div>
  );
}

// ── Adaptive Difficulty Pill ───────────────────────────────────────────────────
function AdaptiveDifficultyPill({ difficulty, pendingFeedback, onDismiss }) {
  const info = DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS.medium;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Current difficulty pill */}
      <motion.div
        key={difficulty}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${info.bg} ${info.border} ${info.color}`}
      >
        <span>{info.emoji}</span>
        <span>Adaptive: {info.label}</span>
      </motion.div>

      {/* Transition feedback banner */}
      <AnimatePresence>
        {pendingFeedback && (
          <motion.div
            key={`feedback-${pendingFeedback.trend}`}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="glass-card p-3 border border-app rounded-xl max-w-[280px]"
          >
            <p className={`text-xs font-semibold ${info.color} mb-0.5`}>
              {pendingFeedback.heading}
            </p>
            <p className="text-[11px] text-app-muted leading-relaxed">
              {pendingFeedback.detail}
            </p>
            <button
              onClick={onDismiss}
              className="mt-1.5 text-[10px] text-app-muted hover:text-app-secondary underline underline-offset-2 cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function InterviewScreen() {
  const {
    questions, currentIndex, currentQuestion, progress,
    answers, isLastQuestion, isSubmitted, config,
    setAnswer, setEvaluation, setFollowUpAnswer, next, prev, goToQuestion, submit,
    adaptive, updateAdaptive, clearAdaptiveFeedback, replaceNextQuestion,
    evaluations,
  } = useInterview();

  const navigate           = useNavigate();
  const answersRef         = useRef(answers);
  const isTransitioningRef = useRef(false);
  const isLastQuestionRef  = useRef(isLastQuestion);
  const nextRef            = useRef(next);
  const submitRef          = useRef(submit);

  const isAiMode = (config?.mode || INTERVIEW_MODES.AI) === INTERVIEW_MODES.AI;
  const isHR     = config?.role === 'hr' || config?.type === 'hr';

  // ── Phase State Machine ──────────────────────────────────────────────────────
  // Phases (AI mode):     'intro' → 'introSpeaking' → 'asking' → 'listening'
  //                       → 'evaluating' → 'followup' → 'transitioning'
  //                       → 'closing' → 'done'
  // Phases (Typing mode): 'listening' → 'evaluating' → ... → 'done'
  const [interviewPhase, setInterviewPhase] = useState(
    (config?.mode || INTERVIEW_MODES.AI) === INTERVIEW_MODES.AI ? 'intro' : 'listening'
  );
  const [introDismissed, setIntroDismissed] = useState(false);

  // When voice fails/unavailable during intro, show a text fallback with a
  // "Continue to Question 1" button instead of jumping to Q1 immediately.
  const [introFallbackVisible, setIntroFallbackVisible] = useState(false);

  // ── Session identity guard ────────────────────────────────────────────────────
  // Incremented every time the interview is (re)started. Any async callback that
  // closes over an older sessionId will see a mismatch and be ignored.
  // This prevents stale intro/question callbacks from a previous session from
  // affecting a newly started interview.
  const sessionIdRef = useRef(0);

  // Refs to guard single-fire intro and closing speeches
  const introSpokenRef   = useRef(false);
  const closingSpokenRef = useRef(false);

  // Whether the per-question timer is allowed to run
  // (false during intro / closing phases so time is not wasted)
  const timerActiveRef = useRef(false);

  const introText   = useMemo(() => generateIntroText(config),   [config]);
  const closingText = useMemo(() => generateClosingText(config), [config]);

  // Follow-up questions state
  const [followUps, setFollowUps]               = useState({});
  const [activeSpeechTarget, setActiveSpeechTarget] = useState('primary');

  // Session Summary Modal State
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Track which questions have already been adaptively evaluated
  const evaluatedQuestionsRef = useRef(new Set());

  // ── ElevenLabs AI Voice ──────────────────────────────────────────────────────
  const {
    voiceEnabled,
    isSpeaking: isAiSpeaking,
    voiceError,
    isAutoplayBlocked,
    speakAndAwait,
    unlockAudioContext,
    stopVoice,
    toggleVoice,
  } = useAiVoice();

  // Initialize session logger
  useEffect(() => {
    sessionLogger.reset();
    sessionLogger.log(SESSION_EVENT_TYPES.INTERVIEW_STARTED, null, {
      role:        config.role,
      type:        config.type,
      mode:        config.mode,
      difficulty:  config.difficulty,
      personality: config.personality,
    });
  }, [config]);

  // Synchronize dynamic refs
  useEffect(() => {
    answersRef.current       = answers;
    isLastQuestionRef.current = isLastQuestion;
    nextRef.current          = next;
    submitRef.current        = submit;
  }, [answers, isLastQuestion, next, submit]);

  // Handle unique finalized speech segments
  const handleFinalSegment = useCallback((segment) => {
    if (!currentQuestion?.id || !segment) return;
    const trimmed = segment.trim();
    if (!trimmed) return;

    if (activeSpeechTarget === 'followUp') {
      setFollowUps((prev) => {
        const currentData = prev[currentQuestion.id] || {};
        const currentAns  = currentData.answer || '';
        const needsSpace  = !currentAns.endsWith(' ') && !currentAns.endsWith('\n');
        const updated     = currentAns ? `${currentAns}${needsSpace ? ' ' : ''}${trimmed}` : trimmed;
        return {
          ...prev,
          [currentQuestion.id]: {
            ...currentData,
            answer: updated,
          },
        };
      });
      sessionLogger.log(SESSION_EVENT_TYPES.FOLLOWUP_ANSWERED, currentQuestion.id);
    } else {
      const currentText = answersRef.current[currentQuestion.id] || '';
      let updatedText   = '';
      if (!currentText.trim()) {
        updatedText = trimmed;
      } else {
        const needsSpace = !currentText.endsWith(' ') && !currentText.endsWith('\n');
        updatedText = `${currentText}${needsSpace ? ' ' : ''}${trimmed}`;
      }
      setAnswer(currentQuestion.id, updatedText);
      sessionLogger.log(SESSION_EVENT_TYPES.ANSWER_STARTED, currentQuestion.id);
    }
  }, [activeSpeechTarget, currentQuestion, setAnswer]);

  const {
    isListening,
    interimTranscript,
    isSupported: isSpeechSupported,
    error: speechError,
    stopListening,
    toggleListening,
    resetTranscript,
  } = useSpeechRecognition({ onFinalSegment: handleFinalSegment });

  const togglePrimarySpeech = useCallback(() => {
    setActiveSpeechTarget('primary');
    toggleListening();
  }, [toggleListening]);

  const toggleFollowUpSpeech = useCallback(() => {
    setActiveSpeechTarget('followUp');
    toggleListening();
  }, [toggleListening]);

  // ── Adaptive evaluation ──────────────────────────────────────────────────────
  const runAdaptiveEvaluation = useCallback((questionId, timedOut = false) => {
    if (!questionId || evaluatedQuestionsRef.current.has(questionId)) return;
    evaluatedQuestionsRef.current.add(questionId);

    const currentAnswers = answersRef.current;
    const primaryAnswer  = currentAnswers[questionId] || '';
    const fuData         = followUps[questionId];
    const followUpAnswer = (fuData?.isSubmitted && fuData?.answer) ? fuData.answer : '';

    const { score, tier, reasons } = evaluateAnswer({
      primaryAnswer,
      followUpAnswer,
      timedOut,
      interviewType: config.type,
      role:          config.role,
    });

    const { nextDifficulty, trend, newConsecutiveStrong, newConsecutiveWeak } = computeNextDifficulty({
      currentDifficulty: adaptive.currentDifficulty,
      consecutiveStrong: adaptive.consecutiveStrong,
      consecutiveWeak:   adaptive.consecutiveWeak,
      tier,
      primaryAnswer,
    });

    const historyEntry = {
      questionId,
      previousDifficulty: adaptive.currentDifficulty,
      score,
      nextDifficulty,
      trend,
      reason: reasons[0] || '',
    };

    const feedbackMessage = getAdaptiveFeedbackMessage(
      trend,
      nextDifficulty,
      config.personality || 'professional',
      reasons,
    );

    updateAdaptive({
      newConsecutiveStrong,
      newConsecutiveWeak,
      nextDifficulty,
      trend,
      historyEntry,
      feedbackMessage: trend !== 'maintained' ? feedbackMessage : null,
    });

    if (trend !== 'maintained') {
      sessionLogger.log(SESSION_EVENT_TYPES.DIFFICULTY_CHANGED, questionId, {
        trend,
        nextDifficulty,
      });
    }

    return { nextDifficulty, trend };
  }, [adaptive, config, followUps, updateAdaptive]);

  // Handle per-question timer expiration & auto-save
  const handleTimeExpire = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    stopListening();
    stopVoice();

    toast("Time's up! Answer automatically saved.", {
      icon: '\u23f0',
      duration: 3500,
    });

    const qId = questions[currentIndex]?.id;
    if (qId) {
      runAdaptiveEvaluation(qId, true);
      sessionLogger.log(SESSION_EVENT_TYPES.ANSWER_SUBMITTED, qId, { timedOut: true });
    }

    setInterviewPhase('transitioning');

    if (!isLastQuestionRef.current) {
      nextRef.current();
    } else {
      setShowSummaryModal(true);
    }

    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopListening, stopVoice, questions, currentIndex]);

  // Deadline-based per-question countdown hook
  const {
    timeLeft,
    percentageRemaining,
    isCritical,
    isWarning,
    start: startTimer,
    stop:  stopTimer,
  } = useCountdown(currentQuestion?.timeLimit || 120, handleTimeExpire);

  // ── Per-question timer management ─────────────────────────────────────────────
  // Timer starts only when the question becomes active (after AI finishes speaking).
  // It is intentionally NOT started during 'intro', 'evaluating', 'closing', or 'done'.
  useEffect(() => {
    stopListening();
    resetTranscript();
    timerActiveRef.current = false;
    stopTimer();

    if (!isAiMode) {
      // Typing mode: start timer immediately for every question
      const limit = currentQuestion?.timeLimit || 120;
      timerActiveRef.current = true;
      startTimer(limit);
    } else if (currentIndex > 0 && introSpokenRef.current) {
      // AI mode Q2+: intro already played, set phase to 'asking'
      // The question speech effect below will then speak the question and start the timer.
      setInterviewPhase('asking');
    }
    // AI mode Q0: handled by the intro effect below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, currentQuestion?.id]);

  // ── Hard guard: blocks any question start while intro is active ──────────────
  // This is the single source of truth for whether intro has completed.
  const introCompletedRef = useRef(!((config?.mode || INTERVIEW_MODES.AI) === INTERVIEW_MODES.AI));
  const introFallbackContinueRef = useRef(null);

  /** Called only when the intro has truly finished (TTS ended or user clicked Continue). */
  const handleIntroCompleted = useCallback(() => {
    introCompletedRef.current = true;
    sessionLogger.log(SESSION_EVENT_TYPES.INTRO_COMPLETED);
    setIntroFallbackVisible(false);
    setInterviewPhase('asking');
  }, []);

  /** Called when user clicks "Continue to Question 1" in the text fallback UI. */
  const handleIntroContinue = useCallback(() => {
    if (introFallbackContinueRef.current) {
      introFallbackContinueRef.current();
      introFallbackContinueRef.current = null;
    } else {
      handleIntroCompleted();
    }
    setIntroFallbackVisible(false);
  }, [handleIntroCompleted]);

  // Handler to unlock audio and replay speech (used by "Enable AI Voice" buttons)
  const handleUnlockAndPlaySpeech = useCallback(async () => {
    await unlockAudioContext();
    const isIntro = interviewPhase === 'intro' || interviewPhase === 'introSpeaking';
    if (isIntro) {
      setInterviewPhase('intro');
      setIntroFallbackVisible(false);
      speakAndAwait(introText, 'session-intro').then((result) => {
        if (result?.success) {
          handleIntroCompleted();
        } else if (!result?.isAutoplayBlocked && !result?.cancelled) {
          setIntroFallbackVisible(true);
        }
      });
    } else if (currentQuestion?.question) {
      speakAndAwait(currentQuestion.question, `q-${currentQuestion.id}`).then((result) => {
        if (result?.success || (!result?.isAutoplayBlocked && !result?.cancelled)) {
          const limit = currentQuestion?.timeLimit || 120;
          timerActiveRef.current = true;
          startTimer(limit);
          setInterviewPhase('listening');
        }
      });
    }
  }, [interviewPhase, introText, currentQuestion, unlockAudioContext, speakAndAwait, startTimer, handleIntroCompleted]);

  // ── AI Mode: Introduction (BLOCKING PHASE) ────────────────────────────────────
  //
  // Flow:
  //   1. Enter 'intro' phase (timer stopped, Q1 hidden, mic disabled)
  //   2. AI speaks introduction immediately via speakAndAwait
  //   3. When intro audio ends -> transition to 'asking'
  //   4. If autoplay blocked -> show "Enable AI Voice" button
  //   5. If voice unavailable/error -> show text fallback + Continue button
  //   6. Hard 30s safety: if Promise never settles, show text fallback anyway
  useEffect(() => {
    console.log('[AI-VOICE-DEBUG] InterviewScreen mounted');
    if (isAiMode) {
      console.log('[AI-VOICE-DEBUG] Interview mode detected: AI Voice');
    }
  }, [isAiMode]);

  const introHardTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isAiMode || !questions.length || !currentQuestion?.id) return;
    if (introSpokenRef.current) return; // Fires exactly once per session

    introSpokenRef.current = true;
    sessionIdRef.current += 1;
    const mySessionId = sessionIdRef.current;

    console.log('[AI-VOICE-DEBUG] Intro phase started');
    console.log('[AI-VOICE-DEBUG] Intro text:', introText);
    console.log('[AI-VOICE-DEBUG] Intro text length:', introText?.length);
    console.log('[AI-VOICE-DEBUG] voiceEnabled:', voiceEnabled);

    setInterviewPhase('intro');
    setIntroFallbackVisible(false);
    stopTimer();
    timerActiveRef.current = false;
    introCompletedRef.current = false;

    sessionLogger.log(SESSION_EVENT_TYPES.QUESTION_ASKED, currentQuestion.id, { isIntro: true });

    introFallbackContinueRef.current = () => {
      if (sessionIdRef.current !== mySessionId) return;
      console.log('[AI-VOICE-DEBUG] Intro completed (fallback continue)');
      console.log('[AI-VOICE-DEBUG] Changing interview state to ASKING');
      handleIntroCompleted();
    };

    if (!voiceEnabled) {
      // Voice disabled by user — show intro text briefly, then auto-continue
      setInterviewPhase('intro');
      setIntroFallbackVisible(true);
      const t = setTimeout(() => {
        if (sessionIdRef.current === mySessionId) {
          console.log('[AI-VOICE-DEBUG] Intro completed (voice disabled)');
          console.log('[AI-VOICE-DEBUG] Changing interview state to ASKING');
          handleIntroCompleted();
        }
      }, 1500);
      return () => clearTimeout(t);
    }

    // ── Hard 8-second auto-advance safety net ──────────────────────────────────
    // ElevenLabs fetch has a 7s internal timeout. After 8s total, if speech hasn't
    // completed or resolved, we auto-advance directly to Question 1 without requiring
    // any user interaction. This prevents the interview from ever getting stuck.
    let introResolved = false;
    if (introHardTimeoutRef.current) clearTimeout(introHardTimeoutRef.current);
    introHardTimeoutRef.current = setTimeout(() => {
      if (introResolved || sessionIdRef.current !== mySessionId) return;
      console.warn('[AI VOICE] Hard 8s intro timeout fired — auto-advancing to Question 1.');
      introResolved = true;
      handleIntroCompleted();
    }, 8000);

    // Voice enabled — immediately speak intro and await completion
    setInterviewPhase('intro');
    console.log('[AI-VOICE-DEBUG] Calling speakAndAwait()');
    speakAndAwait(introText, 'session-intro').then((result) => {
      console.log('[AI-VOICE-DEBUG] speakAndAwait() RESOLVED with result:', result);
      if (introResolved) return; // already handled by hard timeout
      introResolved = true;
      if (introHardTimeoutRef.current) {
        clearTimeout(introHardTimeoutRef.current);
        introHardTimeoutRef.current = null;
      }

      if (sessionIdRef.current !== mySessionId) return;

      if (result?.isAutoplayBlocked) {
        setInterviewPhase('intro');
        console.log('[AI VOICE] Intro autoplay blocked — waiting for user to click Enable AI Voice.');
        setIntroFallbackVisible(true);
        return;
      }

      if (result?.success) {
        console.log('[AI-VOICE-DEBUG] Intro completed successfully');
        console.log('[AI-VOICE-DEBUG] Changing interview state to ASKING');
        handleIntroCompleted();
        return;
      }

      // Voice failed or cancelled — auto-advance immediately so interview never gets stuck
      console.log('[AI VOICE] Intro voice unavailable. Auto-advancing to Question 1. Result:', result);
      handleIntroCompleted();
    });

    return () => {
      if (introHardTimeoutRef.current) {
        clearTimeout(introHardTimeoutRef.current);
        introHardTimeoutRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiMode, questions.length, currentQuestion?.id]);


  // ── AI Mode: Speak current question when phase = 'asking' ─────────────────────
  // Runs only after intro is completed. Speaks Question, then starts timer & enables mic.
  useEffect(() => {
    if (!isAiMode) return;
    if (interviewPhase !== 'asking') return;
    if (!currentQuestion?.id) return;

    // HARD GUARD — intro must be completed before speaking question 1
    if (!introCompletedRef.current) {
      console.warn('[AI VOICE] asking effect fired but intro not yet completed — suppressed.');
      return;
    }

    const mySessionId = sessionIdRef.current;
    const voiceKey = `q-${currentQuestion.id}`;

    if (currentIndex === 0) {
      console.log('[AI-VOICE-DEBUG] Question 1 selected:', currentQuestion.question);
    }

    sessionLogger.log(SESSION_EVENT_TYPES.QUESTION_ASKED, currentQuestion.id, {
      question: currentQuestion.question,
      skill:    currentQuestion.skill || currentQuestion.category,
    });

    if (voiceEnabled) {
      console.log(`[AI-VOICE-DEBUG] Speaking Question ${currentIndex + 1}`);
      speakAndAwait(currentQuestion.question, voiceKey).then((result) => {
        if (sessionIdRef.current !== mySessionId) return;
        console.log(`[AI-VOICE-DEBUG] Question ${currentIndex + 1} playback completed with result:`, result);
        if (!result?.isAutoplayBlocked) {
          const limit = currentQuestion?.timeLimit || 120;
          console.log('[AI-VOICE-DEBUG] Changing state to LISTENING');
          console.log('[AI-VOICE-DEBUG] Starting timer');
          timerActiveRef.current = true;
          startTimer(limit);
          setInterviewPhase('listening');
        }
      });
    } else {
      const limit = currentQuestion?.timeLimit || 120;
      console.log('[AI-VOICE-DEBUG] Changing state to LISTENING');
      console.log('[AI-VOICE-DEBUG] Starting timer');
      timerActiveRef.current = true;
      startTimer(limit);
      setInterviewPhase('listening');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiMode, interviewPhase, currentQuestion?.id]);

  // After adaptive state updates with a new nextDifficulty, replace the upcoming question
  const prevAdaptiveDiffRef = useRef(adaptive.currentDifficulty);
  useEffect(() => {
    if (adaptive.currentDifficulty !== prevAdaptiveDiffRef.current) {
      prevAdaptiveDiffRef.current = adaptive.currentDifficulty;
      const nextIdx = currentIndex + 1;
      if (nextIdx < questions.length) {
        replaceNextQuestion({
          targetDifficulty: adaptive.currentDifficulty,
          actualDifficulty: adaptive.currentDifficulty,
          targetIndex:      nextIdx,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adaptive.currentDifficulty]);

  // ── Loading guard: wait briefly for questions to populate ─────────────────────
  // `dispatch({ type: 'START_INTERVIEW' })` followed by an immediate `navigate()` can
  // cause the first render of InterviewScreen to see questions:[] before the context
  // re-render has committed. We therefore wait up to 600ms before redirecting.
  const [questionsReady, setQuestionsReady] = useState(questions.length > 0);
  const questionsReadyTimerRef = useRef(null);

  useEffect(() => {
    if (questions.length > 0) {
      if (questionsReadyTimerRef.current) {
        clearTimeout(questionsReadyTimerRef.current);
        questionsReadyTimerRef.current = null;
      }
      setQuestionsReady(true);
      return;
    }
    // Not yet ready — give the context 600ms to populate
    setQuestionsReady(false);
    questionsReadyTimerRef.current = setTimeout(() => {
      // If still empty after the grace period, session was never started → redirect
      if (!questions.length) {
        navigate('/interview/setup');
      }
    }, 600);
    return () => {
      if (questionsReadyTimerRef.current) {
        clearTimeout(questionsReadyTimerRef.current);
        questionsReadyTimerRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  // Redirect on submission if summary modal is closed
  useEffect(() => {
    if (isSubmitted && !showSummaryModal) navigate('/results');
  }, [isSubmitted, showSummaryModal, navigate]);

  // Cleanup on component unmount to prevent audio/media/timer leaks
  useEffect(() => {
    return () => {
      stopVoice();
      stopListening();
      stopTimer();
    };
  }, [stopVoice, stopListening, stopTimer]);

  const handleRequestFollowUp = useCallback(async () => {
    if (!currentQuestion?.id) return;
    const primaryAns = answersRef.current[currentQuestion.id] || '';
    if (!primaryAns.trim()) {
      toast.error('Please answer the question before requesting a follow-up.', {
        icon: '\u26a0\ufe0f',
      });
      return;
    }

    if (followUps[currentQuestion.id]?.generated || followUps[currentQuestion.id]?.isLoading) {
      return;
    }

    setFollowUps((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        question:    '',
        answer:      '',
        generated:   false,
        source:      'AI',
        isLoading:   true,
        error:       null,
        isSubmitted: false,
      },
    }));

    try {
      const result = await generateFollowUpQuestion({
        question:      currentQuestion.question,
        answer:        primaryAns,
        role:          config.role || 'frontend',
        skill:         currentQuestion.skill || currentQuestion.category || 'General',
        difficulty:    config.difficulty || 'medium',
        interviewType: config.type || 'technical',
        personality:   config.personality || 'professional',
      });

      setFollowUps((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          question:    result.followUpQuestion,
          answer:      '',
          generated:   true,
          source:      result.source,
          isLoading:   false,
          error:       null,
          isSubmitted: false,
        },
      }));

      sessionLogger.log(SESSION_EVENT_TYPES.FOLLOWUP_GENERATED, currentQuestion.id, {
        followUpQuestion: result.followUpQuestion,
      });

      // Speak the follow-up question after it is generated
      if (result.followUpQuestion) {
        const introPhrase = getFollowUpIntroduction(config.personality, isHR);
        const fullSpeech  = `${introPhrase} ${result.followUpQuestion}`;
        const fuVoiceKey  = `q-${currentQuestion.id}-followup`;
        speakAndAwait(fullSpeech, fuVoiceKey).then((res) => {
          if (!res?.isAutoplayBlocked) {
            setInterviewPhase('followup');
          }
        });
      }
    } catch (err) {
      setFollowUps((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          question:    '',
          answer:      '',
          generated:   false,
          source:      'AI',
          isLoading:   false,
          error:       err.message || 'AI follow-up is temporarily unavailable.',
          isSubmitted: false,
        },
      }));
    }
  }, [currentQuestion, config, isHR, followUps, speakAndAwait]);

  const handleFollowUpAnswerChange = useCallback((text) => {
    if (!currentQuestion?.id) return;
    setFollowUps((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        answer: text,
      },
    }));
  }, [currentQuestion]);

  const handleSubmitFollowUp = useCallback(() => {
    if (!currentQuestion?.id) return;
    const fuData = followUps[currentQuestion.id];
    if (fuData) {
      setFollowUps((prev) => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          isSubmitted: true,
        },
      }));
      setFollowUpAnswer(currentQuestion.id, {
        question:    fuData.question,
        answer:      fuData.answer,
        isSubmitted: true,
      });
      sessionLogger.log(SESSION_EVENT_TYPES.FOLLOWUP_ANSWERED, currentQuestion.id);
    }
    toast.success('Follow-up response recorded!', { icon: '\u2713' });
  }, [currentQuestion, followUps, setFollowUpAnswer]);

  // ── Unified Advance Flow (AI Evaluation + Auto Follow-Up Decision + Next) ─────
  const handleNext = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    stopListening();
    stopTimer();
    stopVoice();
    timerActiveRef.current = false;

    const qId           = currentQuestion?.id;
    const primaryAns    = answersRef.current[qId] || '';
    const currentFollowUp = followUps[qId];

    sessionLogger.log(SESSION_EVENT_TYPES.ANSWER_SUBMITTED, qId);

    // If candidate has not yet received a follow-up, consider triggering one
    if (qId && primaryAns.trim() && !currentFollowUp?.generated && !isLastQuestion) {
      setInterviewPhase('evaluating');
      sessionLogger.log(SESSION_EVENT_TYPES.AI_EVALUATION_STARTED, qId);

      let aiEvaluationResult = null;
      try {
        aiEvaluationResult = await evaluateAnswerWithAI({
          question:      currentQuestion.question,
          answer:        primaryAns,
          role:          config.role || 'frontend',
          skill:         currentQuestion.skill || currentQuestion.category || 'General',
          difficulty:    currentQuestion.adaptiveDifficulty || config.difficulty || 'medium',
          interviewType: config.type || 'technical',
          personality:   config.personality || 'professional',
        });
        if (aiEvaluationResult) {
          setEvaluation(qId, aiEvaluationResult);
          sessionLogger.log(SESSION_EVENT_TYPES.AI_EVALUATION_COMPLETED, qId, {
            rating: aiEvaluationResult.rating,
          });
        }
      } catch {
        // Fallback gracefully to local evaluation
      }

      const shouldFollowUp = shouldAutoFollowUp({
        answer:        primaryAns,
        aiEvaluation:  aiEvaluationResult,
        role:          config.role || 'frontend',
        interviewType: config.type || 'technical',
        hasFollowUp:   false,
        isLastQuestion: false,
      });

      if (shouldFollowUp) {
        try {
          const fuResult = await generateFollowUpQuestion({
            question:      currentQuestion.question,
            answer:        primaryAns,
            role:          config.role || 'frontend',
            skill:         currentQuestion.skill || currentQuestion.category || 'General',
            difficulty:    currentQuestion.adaptiveDifficulty || config.difficulty || 'medium',
            interviewType: config.type || 'technical',
            personality:   config.personality || 'professional',
          });

          if (fuResult?.followUpQuestion) {
            setFollowUps((prev) => ({
              ...prev,
              [qId]: {
                question:      fuResult.followUpQuestion,
                answer:        '',
                generated:     true,
                autoGenerated: true,
                source:        fuResult.source,
                isLoading:     false,
                error:         null,
                isSubmitted:   false,
              },
            }));

            sessionLogger.log(SESSION_EVENT_TYPES.FOLLOWUP_GENERATED, qId, {
              followUpQuestion: fuResult.followUpQuestion,
            });

            if (isAiMode || voiceEnabled) {
              const introPhrase = getFollowUpIntroduction(config.personality, isHR);
              const fullSpeech  = `${introPhrase} ${fuResult.followUpQuestion}`;
              const fuVoiceKey  = `q-${qId}-followup`;
              // speakAndAwait keeps mic locked while AI speaks follow-up
              speakAndAwait(fullSpeech, fuVoiceKey).then((res) => {
                if (!res?.isAutoplayBlocked) {
                  setInterviewPhase('followup');
                }
              });
            }

            setInterviewPhase('followup');
            isTransitioningRef.current = false;
            toast('\ud83e\udd16 AI Interviewer: Follow-up question generated.', { icon: '\u2728' });
            return;
          }
        } catch {
          // If follow-up generation fails, proceed seamlessly to next question
        }
      }
    }

    // Save follow-up answer if one was recorded
    if (qId && currentFollowUp?.answer) {
      setFollowUpAnswer(qId, {
        question:    currentFollowUp.question,
        answer:      currentFollowUp.answer,
        isSubmitted: currentFollowUp.isSubmitted || true,
      });
    }

    // Run adaptive evaluation before advancing
    if (qId) {
      runAdaptiveEvaluation(qId, false);
      sessionLogger.log(SESSION_EVENT_TYPES.QUESTION_COMPLETED, qId);
    }

    setInterviewPhase('transitioning');
    next();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  }, [
    currentQuestion,
    config,
    isHR,
    followUps,
    isLastQuestion,
    isAiMode,
    voiceEnabled,
    next,
    runAdaptiveEvaluation,
    setEvaluation,
    setFollowUpAnswer,
    speakAndAwait,
    stopListening,
    stopTimer,
    stopVoice,
  ]);

  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    stopListening();
    stopTimer();
    stopVoice();
    prev();
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  }, [prev, stopListening, stopTimer, stopVoice]);

  const handleGoToQuestion = useCallback((targetIndex) => {
    if (isTransitioningRef.current || targetIndex === currentIndex) return;
    isTransitioningRef.current = true;
    stopListening();
    stopTimer();
    stopVoice();
    goToQuestion(targetIndex);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  }, [currentIndex, goToQuestion, stopListening, stopTimer, stopVoice]);

  // ── Final question submit — includes AI closing speech ────────────────────────
  const handleSubmit = useCallback(async () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    stopListening();
    stopTimer();
    timerActiveRef.current = false;

    const qId           = currentQuestion?.id;
    const currentFollowUp = followUps[qId];
    if (qId && currentFollowUp?.answer) {
      setFollowUpAnswer(qId, {
        question:    currentFollowUp.question,
        answer:      currentFollowUp.answer,
        isSubmitted: true,
      });
    }

    if (qId) {
      runAdaptiveEvaluation(qId, false);
      sessionLogger.log(SESSION_EVENT_TYPES.QUESTION_COMPLETED, qId);
    }

    sessionLogger.log(SESSION_EVENT_TYPES.INTERVIEW_COMPLETED);

    // AI mode: speak closing message before showing summary
    if (isAiMode && voiceEnabled && !closingSpokenRef.current) {
      closingSpokenRef.current = true;
      setInterviewPhase('closing');
      stopVoice(); // Ensure nothing else is playing
      await speakAndAwait(closingText, 'session-closing');
      // Whether speaking succeeded or not, proceed to submit
    }

    setInterviewPhase('done');
    submit();
    setShowSummaryModal(true);
    isTransitioningRef.current = false;
  }, [
    submit,
    stopListening,
    stopTimer,
    stopVoice,
    currentQuestion,
    followUps,
    setFollowUpAnswer,
    runAdaptiveEvaluation,
    isAiMode,
    voiceEnabled,
    closingText,
    speakAndAwait,
  ]);

  const handleProceedFromSummary = useCallback(() => {
    setShowSummaryModal(false);
    navigate('/results');
  }, [navigate]);

  // Show a brief loading state while questions populate from context
  if (!questionsReady || !currentQuestion) {
    // If questionsReady is false, context is still catching up — show spinner.
    // If questionsReady is true but currentQuestion is null, session is genuinely missing.
    const isLoading = !questionsReady && questions.length === 0;
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-app text-center space-y-4">
          {isLoading ? (
            <>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl animate-pulse">
                ⚡
              </div>
              <h2 className="text-lg font-bold text-app-primary">
                Starting Interview...
              </h2>
              <p className="text-xs text-app-muted leading-relaxed">
                Loading your questions. This will only take a moment.
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl">
                🤖
              </div>
              <h2 className="text-lg font-bold text-app-primary">
                No Interview Session Active
              </h2>
              <p className="text-xs text-app-muted leading-relaxed">
                Please configure and start an interview session from the setup page.
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/interview/setup')}
                  className="w-full justify-center"
                >
                  Go to Interview Setup
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  const isIntroActive     = interviewPhase === 'intro' || interviewPhase === 'introSpeaking';
  const displayDifficulty = currentQuestion.adaptiveDifficulty || adaptive.currentDifficulty;
  const attemptedCount    = Object.values(answers).filter((t) => typeof t === 'string' && t.trim().length > 0).length;
  const followUpsCount    = Object.values(followUps).filter((f) => f.generated).length;
  const sessionDuration   = sessionLogger.getSummary().formattedDuration;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Bar: Progress, Adaptive Status & Mode */}
      <div className="flex items-center justify-between flex-wrap gap-4 glass-card p-4 rounded-2xl border border-app">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-app-primary text-base md:text-lg">
              {isAiMode ? '\ud83e\udd16 AI Voice Interview' : '\u2328\ufe0f Mock Interview'}
            </h1>
            <span className="badge badge-primary text-[10px] uppercase font-semibold">
              {isAiMode ? 'AI-Led Voice' : 'Standard'}
            </span>
          </div>
          <p className="text-xs text-app-muted capitalize mt-0.5">
            {config.role} &middot; {config.difficulty} &middot; {config.type} &middot; {config.personality || 'professional'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <AdaptiveDifficultyPill
            difficulty={displayDifficulty}
            pendingFeedback={adaptive.pendingFeedback}
            onDismiss={clearAdaptiveFeedback}
          />
          <div className="text-right">
            <span className="text-xs text-app-secondary font-bold">
              {isIntroActive ? 'Introduction' : `Question ${currentIndex + 1} of ${questions.length}`}
            </span>
            <div className="w-28 h-2 rounded-full bg-muted-app overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Question & Interactive Answer Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Typing Mode Intro Banner (Dismissible) */}
          {!isAiMode && !introDismissed && currentIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-card p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HiOutlineInformationCircle size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-app-primary">Welcome to Your Interview</h4>
                  <p className="text-xs text-app-secondary mt-1 leading-relaxed">
                    {introText}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIntroDismissed(true)}
                className="text-app-muted hover:text-app-primary p-1 rounded-lg hover:bg-app-card transition-colors cursor-pointer"
                title="Dismiss"
              >
                <HiOutlineX size={16} />
              </button>
            </motion.div>
          )}

          {/* Countdown Timer — hidden during intro and closing phases */}
          {!isIntroActive && interviewPhase !== 'closing' && interviewPhase !== 'done' && (
            <div
              className={`glass-card p-4 flex items-center gap-4 transition-all duration-300 ${
                isCritical ? 'border-red-500/50 bg-red-500/5 shadow-sm shadow-red-500/10' : ''
              }`}
            >
              <div
                className={`flex items-center gap-2 font-mono font-bold text-lg flex-shrink-0 transition-colors ${
                  isCritical
                    ? 'text-red-500 animate-pulse'
                    : isWarning
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                <HiOutlineClock size={20} className={isCritical ? 'text-red-500' : ''} />
                <span>{formatTimer(timeLeft)}</span>
                {isCritical && (
                  <span className="text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 uppercase tracking-wider">
                    Time Critical
                  </span>
                )}
              </div>
              <TimerBar
                percentageRemaining={percentageRemaining}
                isCritical={isCritical}
                isWarning={isWarning}
              />
            </div>
          )}

          {/* Live AI Thinking State */}
          <AnimatePresence>
            {interviewPhase === 'evaluating' && (
              <AiThinkingState
                role={config.role}
                isHR={isHR}
                title="AI Interviewer is analyzing your response..."
              />
            )}
          </AnimatePresence>

          {/* Question card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isIntroActive ? 'intro-card' : currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {isAiMode && isIntroActive ? '\ud83e\udd16' : `Q${currentIndex + 1}`}
                  </span>
                  {isIntroActive ? (
                    <span className="badge badge-primary text-xs">Introduction</span>
                  ) : (
                    <span className="badge badge-primary text-xs">{currentQuestion.category}</span>
                  )}
                  {!isIntroActive && (() => {
                    const diff = currentQuestion.adaptiveDifficulty || config.difficulty;
                    const info = DIFFICULTY_LABELS[diff] || DIFFICULTY_LABELS.medium;
                    return (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${info.bg} ${info.border} ${info.color}`}>
                        {info.emoji} {info.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* AI Voice Interviewer Stage */}
              {isAiMode ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent relative overflow-hidden">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/40 flex items-center justify-center text-xl shadow-inner relative">
                          {'\ud83e\udd16'}
                          {isAiSpeaking && (
                            <span className="absolute -inset-1 rounded-xl border border-indigo-400/50 animate-ping opacity-50" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-xs font-bold text-app-primary">AI Interviewer</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                              {isIntroActive ? 'Introduction' : currentQuestion.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-indigo-300/90 font-medium mt-0.5">
                            {isIntroActive
                              ? (isAiSpeaking
                                  ? '\ud83d\udd0a Speaking introduction...'
                                  : isAutoplayBlocked
                                  ? '\ud83d\udd0a Click Enable AI Voice to continue'
                                  : introFallbackVisible
                                  ? '\ud83d\udcdd Read the introduction below and continue'
                                  : '\u23f3 Preparing introduction...')
                              : interviewPhase === 'evaluating'
                              ? '\ud83e\udde0 Analyzing your answer...'
                              : interviewPhase === 'followup'
                              ? (isAiSpeaking ? '\ud83d\udd0a Asking follow-up...' : '\ud83c\udfa4 Answer the follow-up above')
                              : interviewPhase === 'closing'
                              ? '\ud83d\udd0a Concluding your interview...'
                              : isAiSpeaking
                              ? `\ud83d\udd0a Asking Question ${currentIndex + 1}...`
                              : isAutoplayBlocked
                              ? '\ud83c\udf99 Click Enable AI Voice to hear the question'
                              : interviewPhase === 'listening'
                              ? '\ud83c\udfa4 Your turn \u2014 I\'m listening'
                              : '\u23f3 Preparing question...'}
                          </p>
                        </div>
                      </div>

                      {/* Live audio visualizer or autoplay unblock button */}
                      {isAiSpeaking ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                          <div className="flex items-center gap-0.5">
                            {[...Array(4)].map((_, idx) => (
                              <motion.span
                                key={idx}
                                className="w-1 bg-indigo-400 rounded-full"
                                animate={{ height: ['4px', `${8 + (idx % 3) * 6}px`, '4px'] }}
                                transition={{ duration: 0.5 + idx * 0.1, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.1 }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-semibold text-indigo-300">
                            {isIntroActive ? 'Intro...' : interviewPhase === 'closing' ? 'Closing...' : 'Speaking...'}
                          </span>
                        </div>
                      ) : isAutoplayBlocked ? (
                        <button
                          type="button"
                          onClick={handleUnlockAndPlaySpeech}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <HiOutlineVolumeUp size={14} />
                          <span>Enable AI Voice</span>
                        </button>
                      ) : null}
                    </div>

                    {/* During intro: welcome card with text fallback & Continue button. After intro: actual question text. */}
                    {isIntroActive ? (
                      <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 text-center space-y-3">
                        <div className="text-3xl">{'\ud83c\udf99\ufe0f'}</div>
                        <p className="text-sm font-semibold text-app-primary">Welcome to Your Interview</p>
                        <p className="text-xs text-app-secondary leading-relaxed max-w-lg mx-auto bg-app-card/40 p-3 rounded-lg border border-app">
                          {introText}
                        </p>
                        {introFallbackVisible ? (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleIntroContinue}
                              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                            >
                              <span>Continue to Question 1</span>
                              <HiOutlineArrowRight size={14} />
                            </button>
                          </div>
                        ) : (
                          !isAiSpeaking && !isAutoplayBlocked && (
                            <div className="pt-2 flex flex-col items-center gap-2">
                              <p className="text-xs text-indigo-400 animate-pulse">{'⏳'} Preparing...</p>
                              <button
                                type="button"
                                onClick={handleIntroContinue}
                                className="px-4 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer border border-indigo-500/30"
                              >
                                <span>Continue to Question 1 &rarr;</span>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-app-card/80 border border-app backdrop-blur-sm">
                        <p className="text-base md:text-lg font-semibold text-app-primary leading-relaxed">
                          &ldquo;{currentQuestion.question}&rdquo;
                        </p>
                      </div>
                    )}

                    {isAiSpeaking && !isIntroActive && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-xl border border-indigo-500/20">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        <span>AI is speaking &mdash; microphone will activate automatically when finished.</span>
                      </div>
                    )}
                  </div>

                  {/* Candidate Spoken Answer Input Area — hidden during intro */}
                  {!isIntroActive && interviewPhase !== 'closing' && interviewPhase !== 'done' && (
                    <div className="p-5 rounded-2xl border border-app bg-card/60 backdrop-blur-sm space-y-3.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                            <HiOutlineMicrophone size={18} />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-app-primary">Your Spoken Answer</h3>
                            <p className="text-[11px] text-app-muted">
                              {isAiSpeaking
                                ? 'Microphone on standby while AI is speaking...'
                                : isListening && activeSpeechTarget === 'primary'
                                ? 'Microphone active \u2014 speak clearly now'
                                : 'Your turn \u2014 answer by speaking or typing below'}
                            </p>
                          </div>
                        </div>

                        {/* Main Voice Record / Stop Button */}
                        <button
                          type="button"
                          onClick={isAiSpeaking ? undefined : togglePrimarySpeech}
                          disabled={isAiSpeaking || !isSpeechSupported}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                            isListening && activeSpeechTarget === 'primary'
                              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 animate-pulse'
                              : isAiSpeaking
                              ? 'bg-muted-app border border-app text-app-muted opacity-50 cursor-not-allowed'
                              : 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-indigo-500/20'
                          }`}
                        >
                          {isListening && activeSpeechTarget === 'primary' ? (
                            <>
                              <HiOutlineStop size={16} />
                              <span>Stop Speaking &amp; Save</span>
                            </>
                          ) : (
                            <>
                              <HiOutlineMicrophone size={16} />
                              <span>{answers[currentQuestion.id] ? 'Add More Voice Answer' : 'Start Voice Answer'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Real-time live speech feedback */}
                      {isListening && activeSpeechTarget === 'primary' && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-400 animate-fadeIn">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span className="font-semibold">Transcribing:</span>
                          <span className="italic truncate flex-1">{interimTranscript || 'Listening for speech...'}</span>
                        </div>
                      )}

                      {/* Speech Transcript / Editable textarea */}
                      <div className="space-y-2">
                        <textarea
                          value={answers[currentQuestion.id] || ''}
                          onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                          placeholder="Your spoken words will appear here automatically as you speak..."
                          rows={5}
                          className="input-field resize-none text-sm leading-relaxed"
                        />
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-app-muted">
                            {(answers[currentQuestion.id] || '').length} characters captured
                          </span>
                          <div className="flex items-center gap-1.5 font-medium">
                            {answers[currentQuestion.id] ? (
                              <span className="text-green-500 flex items-center gap-1">
                                <HiOutlineCheckCircle size={14} />
                                Response recorded
                              </span>
                            ) : (
                              <span className="text-app-muted">Not answered yet</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Traditional / Typing Mode Question & Answer */
                <>
                  <h2 className="text-base md:text-lg font-medium text-app-primary leading-relaxed mb-6">
                    {currentQuestion.question}
                  </h2>

                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="block text-xs font-medium text-app-muted">Your Answer</label>
                      <VoiceAnswerButton
                        isListening={isListening && activeSpeechTarget === 'primary'}
                        isSupported={isSpeechSupported && !isAiSpeaking}
                        error={isAiSpeaking ? 'AI interviewer is speaking. Microphone will be available when AI finishes.' : (activeSpeechTarget === 'primary' ? speechError : null)}
                        onToggle={isAiSpeaking ? undefined : togglePrimarySpeech}
                        interimTranscript={activeSpeechTarget === 'primary' ? interimTranscript : ''}
                      />
                    </div>
                    <textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                      placeholder="Type your answer here or click 'Voice Answer' to speak. You can freely edit or append to your answer."
                      rows={6}
                      className="input-field resize-none text-sm leading-relaxed"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-app-muted">
                        {(answers[currentQuestion.id] || '').length} characters
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {answers[currentQuestion.id] ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <HiOutlineCheckCircle size={14} />
                            Response recorded
                          </span>
                        ) : (
                          <span className="text-app-muted">Not answered yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* AI Follow-Up Trigger — not shown during intro */}
              {!isIntroActive && (
                <div className="mt-4 pt-4 border-t border-app flex items-center justify-between">
                  {!followUps[currentQuestion.id]?.generated ? (
                    <button
                      type="button"
                      onClick={handleRequestFollowUp}
                      disabled={followUps[currentQuestion.id]?.isLoading || interviewPhase === 'evaluating'}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 text-indigo-400 hover:text-indigo-300 text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiOutlineSparkles size={16} className="text-indigo-400" />
                      <span>{followUps[currentQuestion.id]?.isLoading ? '\ud83e\udd16 AI Interviewer is thinking...' : '\ud83e\udd16 Ask AI Follow-Up'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                      <HiOutlineCheck size={14} className="text-green-400" />
                      <span>{followUps[currentQuestion.id]?.autoGenerated ? 'Auto Follow-Up Generated' : 'Follow-Up Generated'}</span>
                    </div>
                  )}
                  <span className="text-[11px] text-app-muted hidden sm:inline-block">
                    Probes deeper into your understanding
                  </span>
                </div>
              )}

              {/* Enhanced Follow-Up Card */}
              {followUps[currentQuestion.id] && (
                <AiFollowUpCard
                  followUpData={followUps[currentQuestion.id]}
                  onAnswerChange={handleFollowUpAnswerChange}
                  onSubmitFollowUp={handleSubmitFollowUp}
                  onRetry={handleRequestFollowUp}
                  isListening={isListening && activeSpeechTarget === 'followUp'}
                  isSpeechSupported={isSpeechSupported}
                  speechError={activeSpeechTarget === 'followUp' ? speechError : null}
                  onToggleSpeech={toggleFollowUpSpeech}
                  interimTranscript={activeSpeechTarget === 'followUp' ? interimTranscript : ''}
                  className="mt-4"
                />
              )}

              {/* Navigation Actions — hidden during intro and closing */}
              {!isIntroActive && interviewPhase !== 'closing' && interviewPhase !== 'done' && (
                <div className="flex items-center justify-between mt-6 pt-5 border-t border-app">
                  <Button
                    variant="secondary"
                    icon={<HiOutlineArrowLeft size={16} />}
                    disabled={currentIndex === 0 || interviewPhase === 'evaluating'}
                    onClick={handlePrev}
                  >
                    Previous
                  </Button>
                  <div className="flex gap-2">
                    {!isLastQuestion ? (
                      <Button
                        icon={<HiOutlineArrowRight size={16} />}
                        iconRight
                        disabled={interviewPhase === 'evaluating'}
                        onClick={handleNext}
                      >
                        {interviewPhase === 'evaluating' ? 'Evaluating...' : 'Next'}
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        icon={<HiOutlineCheck size={16} />}
                        disabled={interviewPhase === 'evaluating'}
                        onClick={handleSubmit}
                      >
                        {interviewPhase === 'evaluating' ? 'Submitting...' : 'Submit Interview'}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column — AI Interviewer Panel & Session Tools */}
        <div className="space-y-4">
          {/* Unified AI Interviewer Panel */}
          <AIInterviewerPanel
            personality={config.personality || 'professional'}
            role={config.role || 'frontend'}
            interviewPhase={interviewPhase}
            isSpeaking={isAiSpeaking}
            voiceEnabled={voiceEnabled}
            voiceError={isAiMode ? voiceError : null}
            isAutoplayBlocked={isAiMode ? isAutoplayBlocked : false}
            currentQuestionIndex={currentIndex}
            totalQuestions={questions.length}
            onToggleVoice={toggleVoice}
            onUnlockVoice={handleUnlockAndPlaySpeech}
          />

          {/* Live Session Timeline */}
          <InterviewTimeline
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            evaluations={evaluations || {}}
            followUps={followUps}
            interviewPhase={interviewPhase}
            onSelectQuestion={handleGoToQuestion}
          />

          {/* Camera Preview */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-app-primary">Webcam Feed</h3>
              <span className="badge badge-primary text-xs flex items-center gap-1">
                <HiOutlineVideoCamera size={12} /> Live Preview
              </span>
            </div>
            <WebcamPreview autoStart={isAiMode} />
          </div>

          {/* Adaptive History (Compact) */}
          {adaptive.difficultyHistory.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-app-primary mb-3">Difficulty History</h3>
              <div className="space-y-1.5">
                {adaptive.difficultyHistory.slice(-5).map((entry, i) => {
                  const prevInfo = DIFFICULTY_LABELS[entry.previousDifficulty] || DIFFICULTY_LABELS.medium;
                  const nextInfo = DIFFICULTY_LABELS[entry.nextDifficulty]     || DIFFICULTY_LABELS.medium;
                  const icon = entry.trend === 'promoted' ? '\ud83d\udcc8' : entry.trend === 'demoted' ? '\ud83d\udcc9' : '\u27a1\ufe0f';
                  return (
                    <div key={`${entry.questionId}-${i}`} className="flex items-center justify-between text-[11px]">
                      <span className="text-app-muted truncate max-w-[100px]">
                        Q{adaptive.difficultyHistory.length - adaptive.difficultyHistory.slice(-5).length + i + 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className={prevInfo.color}>{prevInfo.label}</span>
                        <span className="text-app-muted">{icon}</span>
                        <span className={nextInfo.color}>{nextInfo.label}</span>
                      </span>
                      <span className="text-app-muted font-mono">{entry.score}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Interview Session Summary Modal */}
      <InterviewSessionSummaryModal
        isOpen={showSummaryModal}
        role={config.role ? config.role.replace('_', ' ').toUpperCase() : 'Software Developer'}
        totalQuestions={questions.length}
        attemptedQuestions={attemptedCount}
        followUpsCount={followUpsCount}
        difficulty={displayDifficulty}
        mode={isAiMode ? 'AI Voice Interview' : 'Mock Interview'}
        duration={sessionDuration}
        status="Completed"
        onProceed={handleProceedFromSummary}
      />
    </div>
  );
}
