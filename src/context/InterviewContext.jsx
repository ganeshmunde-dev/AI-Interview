// src/context/InterviewContext.jsx
import { createContext, useContext, useReducer } from 'react';
import { getQuestions, getNextAdaptiveQuestion } from '@/data/questions';
import { generateRoleResults } from '@/data/results';
import { INTERVIEW_MODES } from '@/constants/appConstants';

const InterviewContext = createContext(null);

// ── Initial adaptive state ─────────────────────────────────────────────────────
const initialAdaptiveState = {
  currentDifficulty: 'medium',  // Synced from config on START_INTERVIEW
  consecutiveStrong: 0,
  consecutiveWeak:   0,
  difficultyHistory: [],         // [{ questionId, previousDifficulty, score, nextDifficulty, trend, reason }]
  pendingFeedback:   null,       // { heading, detail, trend, nextDifficulty } — shown after question transition
};

const initialState = {
  // Setup
  config: {
    mode:        INTERVIEW_MODES.AI,
    role:        'frontend',
    difficulty:  'medium',
    type:        'technical',
    count:       5,
    personality: 'professional',
  },
  // Session
  questions:        [],
  currentIndex:     0,
  answers:          {},   // { questionId: answerText }
  evaluations:      {},   // { questionId: evaluationObject }
  followUpAnswers:  {},   // { questionId: { question, answer, isSubmitted } }
  timeLeft:         0,
  isRunning:        false,
  isSubmitted:      false,
  result:           null,
  // Adaptive difficulty state
  adaptive:         initialAdaptiveState,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };

    case 'START_INTERVIEW': {
      const questions = getQuestions(
        state.config.role,
        state.config.difficulty,
        state.config.count,
        state.config.type,
      );
      return {
        ...state,
        questions,
        currentIndex: 0,
        answers: {},
        evaluations: {},
        followUpAnswers: {},
        isRunning: true,
        isSubmitted: false,
        result: null,
        timeLeft: questions[0]?.timeLimit || 120,
        // Initialise adaptive state from config
        adaptive: {
          ...initialAdaptiveState,
          currentDifficulty: state.config.difficulty,
        },
      };
    }

    case 'SET_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.payload.id]: action.payload.answer },
      };

    case 'SET_EVALUATION':
      return {
        ...state,
        evaluations: { ...state.evaluations, [action.payload.id]: action.payload.evaluation },
      };

    case 'SET_FOLLOW_UP_ANSWER':
      return {
        ...state,
        followUpAnswers: {
          ...state.followUpAnswers,
          [action.payload.id]: action.payload.data,
        },
      };

    case 'NEXT_QUESTION': {
      const next = Math.min(state.currentIndex + 1, state.questions.length - 1);
      return {
        ...state,
        currentIndex: next,
        timeLeft: state.questions[next]?.timeLimit || 120,
      };
    }

    case 'PREV_QUESTION': {
      const prev = Math.max(state.currentIndex - 1, 0);
      return {
        ...state,
        currentIndex: prev,
        timeLeft: state.questions[prev]?.timeLimit || 120,
      };
    }

    case 'GO_TO_QUESTION': {
      const idx = Math.max(0, Math.min(action.payload, state.questions.length - 1));
      return {
        ...state,
        currentIndex: idx,
        timeLeft: state.questions[idx]?.timeLimit || 120,
      };
    }

    case 'TICK':
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };

    // ── Adaptive: update state after evaluating an answer ──────────────────────
    // payload: { newConsecutiveStrong, newConsecutiveWeak, nextDifficulty, trend,
    //            historyEntry, feedbackMessage }
    case 'UPDATE_ADAPTIVE': {
      const {
        newConsecutiveStrong,
        newConsecutiveWeak,
        nextDifficulty,
        trend,
        historyEntry,
        feedbackMessage,
      } = action.payload;

      return {
        ...state,
        adaptive: {
          ...state.adaptive,
          currentDifficulty: nextDifficulty,
          consecutiveStrong:  newConsecutiveStrong,
          consecutiveWeak:    newConsecutiveWeak,
          difficultyHistory:  [...state.adaptive.difficultyHistory, historyEntry],
          pendingFeedback:    feedbackMessage ? { ...feedbackMessage, trend, nextDifficulty } : null,
        },
      };
    }

    // ── Adaptive: replace an upcoming question with an adaptive one ────────────
    // payload: { questionIndex, newQuestion, actualDifficulty }
    case 'REPLACE_UPCOMING_QUESTION': {
      const { questionIndex, newQuestion, actualDifficulty } = action.payload;
      if (
        questionIndex < 0 ||
        questionIndex >= state.questions.length ||
        !newQuestion
      ) {
        return state;
      }
      const updatedQuestions = [...state.questions];
      updatedQuestions[questionIndex] = {
        ...newQuestion,
        number: questionIndex + 1,
        // Tag with actual difficulty so UI can display it
        adaptiveDifficulty: actualDifficulty,
      };
      return { ...state, questions: updatedQuestions };
    }

    // ── Adaptive: clear pending feedback after it has been displayed ───────────
    case 'CLEAR_ADAPTIVE_FEEDBACK':
      return {
        ...state,
        adaptive: { ...state.adaptive, pendingFeedback: null },
      };

    case 'SUBMIT_INTERVIEW': {
      const generatedResult = generateRoleResults(
        state.config,
        state.questions,
        state.answers,
        null,
        state.evaluations,
        state.followUpAnswers
      );

      // Persist to interview history in localStorage
      try {
        const historyRaw = localStorage.getItem('interviewai_history');
        const currentHist = historyRaw ? JSON.parse(historyRaw) : [];
        const newEntry = {
          id: generatedResult.interviewId || `int-${Date.now()}`,
          role: generatedResult.role,
          roleKey: generatedResult.roleKey,
          type: generatedResult.type,
          difficulty: generatedResult.difficulty,
          score: generatedResult.overallScore,
          totalQuestions: generatedResult.totalQuestions,
          attempted: generatedResult.attempted,
          duration: generatedResult.duration,
          date: generatedResult.date,
          status: generatedResult.evaluationStatus === 'Not Evaluated' ? 'not_evaluated' : 'completed',
          evaluationStatus: generatedResult.evaluationStatus,
          strongTopics: generatedResult.strengths ? generatedResult.strengths.slice(0, 2) : [],
          weakTopics: generatedResult.weaknesses ? generatedResult.weaknesses.slice(0, 2) : [],
          result: generatedResult,
        };
        localStorage.setItem('interviewai_history', JSON.stringify([newEntry, ...currentHist.filter(h => h.id !== newEntry.id)]));
      } catch (err) {
        console.warn('Failed to save interview history to localStorage:', err);
      }

      return {
        ...state,
        isRunning: false,
        isSubmitted: true,
        result: generatedResult,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setConfig          = (cfg)    => dispatch({ type: 'SET_CONFIG', payload: cfg });
  const start              = ()       => dispatch({ type: 'START_INTERVIEW' });
  const setAnswer          = (id, ans) => dispatch({ type: 'SET_ANSWER', payload: { id, answer: ans } });
  const setEvaluation      = (id, evaluation) => dispatch({ type: 'SET_EVALUATION', payload: { id, evaluation } });
  const setFollowUpAnswer  = (id, data) => dispatch({ type: 'SET_FOLLOW_UP_ANSWER', payload: { id, data } });
  const next               = ()       => dispatch({ type: 'NEXT_QUESTION' });
  const prev               = ()       => dispatch({ type: 'PREV_QUESTION' });
  const goToQuestion       = (idx)    => dispatch({ type: 'GO_TO_QUESTION', payload: idx });
  const tick               = ()       => dispatch({ type: 'TICK' });
  const submit             = ()       => dispatch({ type: 'SUBMIT_INTERVIEW' });
  const reset              = ()       => dispatch({ type: 'RESET' });

  // ── Adaptive actions ─────────────────────────────────────────────────────────
  const updateAdaptive  = (payload) => dispatch({ type: 'UPDATE_ADAPTIVE', payload });
  const clearAdaptiveFeedback = ()  => dispatch({ type: 'CLEAR_ADAPTIVE_FEEDBACK' });

  /**
   * After evaluating the current question, optionally replace the *next* question
   * (if one exists and a transition happened) with an adaptively-selected question.
   */
  const replaceNextQuestion = ({ targetDifficulty, actualDifficulty: _actualDifficulty, targetIndex }) => {
    const answeredIds = state.questions.slice(0, targetIndex).map(q => q.id);
    const { question: newQ, actualDifficulty: gotDiff } = getNextAdaptiveQuestion({
      role:              state.config.role,
      currentDifficulty: state.adaptive.currentDifficulty,
      targetDifficulty,
      answeredIds,
      type:              state.config.type,
    });
    if (newQ) {
      dispatch({
        type: 'REPLACE_UPCOMING_QUESTION',
        payload: { questionIndex: targetIndex, newQuestion: newQ, actualDifficulty: gotDiff },
      });
    }
  };

  const currentQuestion = state.questions[state.currentIndex] || null;
  const isLastQuestion  = state.currentIndex === state.questions.length - 1;
  const progress        = state.questions.length > 0
    ? ((state.currentIndex + 1) / state.questions.length) * 100
    : 0;

  return (
    <InterviewContext.Provider value={{
      ...state, currentQuestion, isLastQuestion, progress,
      setConfig, start, setAnswer, setEvaluation, setFollowUpAnswer, next, prev, goToQuestion, tick, submit, reset,
      updateAdaptive, clearAdaptiveFeedback, replaceNextQuestion,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error('useInterview must be used inside InterviewProvider');
  return ctx;
};
