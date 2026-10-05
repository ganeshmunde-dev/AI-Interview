// src/hooks/useInterviewFlow.js
import { useState, useCallback, useMemo } from 'react';
import { ROLE_SKILL_MAP } from '@/data/results';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for role / type labels
// ─────────────────────────────────────────────────────────────────────────────

function getRoleLabel(role = 'frontend') {
  return ROLE_SKILL_MAP[role]?.label || role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTypeLabel(type = 'technical') {
  const map = {
    technical: 'technical',
    behavioral: 'behavioural',
    hr: 'HR',
    system_design: 'system design',
    coding: 'coding',
    mixed: 'mixed',
  };
  return map[type] || type;
}

// ─────────────────────────────────────────────────────────────────────────────
// generateIntroText
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a dynamic, personality-aware introduction text that the AI interviewer
 * will speak aloud before asking Question 1.
 *
 * Uses the actual selected role, question count, type, difficulty, and personality
 * so every session feels unique.
 */
export function generateIntroText(config = {}) {
  const {
    role       = 'frontend',
    count      = 5,
    type       = 'technical',
    personality = 'professional',
    difficulty  = 'medium',
  } = config;

  const roleLabel = getRoleLabel(role);
  const typeLabel = getTypeLabel(type);

  const difficultyNote = {
    easy:   'We will start at a comfortable pace — take your time and answer clearly.',
    medium: 'The questions are at an intermediate level — structure your answers well.',
    hard:   'Expect challenging questions — demonstrate your depth of knowledge and reasoning.',
  }[difficulty] || '';

  const greetingMap = {
    professional: [
      `Hello, and welcome to your ${roleLabel} interview.`,
      `I will be your AI interviewer today, conducting a structured ${typeLabel} assessment.`,
      `We will cover ${count} questions across your selected areas.`,
      difficultyNote,
      `Please answer clearly and explain your reasoning wherever relevant. Take your time — there is no rush.`,
      `Let us begin.`,
    ],
    friendly: [
      `Hi there, and welcome! Great to have you here for your ${roleLabel} interview.`,
      `I am your AI interviewer, and I am looking forward to learning about your experience and thinking.`,
      `We have ${count} ${typeLabel} questions lined up today. There is nothing to worry about — just be yourself!`,
      difficultyNote,
      `Take a breath, stay relaxed, and explain your thinking step by step. You've got this!`,
      `Let's get started!`,
    ],
    strict: [
      `Welcome to your ${roleLabel} interview.`,
      `I will be conducting a rigorous ${typeLabel} assessment consisting of ${count} questions.`,
      `I expect precise, technically accurate, and thoroughly reasoned answers.`,
      difficultyNote,
      `Avoid vague generalisations — support all claims with clear technical justification.`,
      `Let us begin.`,
    ],
    hr: [
      `Hello, and welcome to your ${roleLabel} interview.`,
      `I am your AI interviewer and we will be exploring your background, communication style, and experiences today.`,
      `I have prepared ${count} ${typeLabel} questions to understand how you think and collaborate.`,
      difficultyNote,
      `Please use real examples from your experience wherever possible, and feel free to take a moment to collect your thoughts before answering.`,
      `Let us get started.`,
    ],
  };

  const lines = greetingMap[(personality || 'professional').toLowerCase()] || greetingMap.professional;
  // Filter out empty difficulty note lines
  return lines.filter(Boolean).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// generateClosingText
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a short, personality-aware closing message spoken after the last question.
 */
export function generateClosingText(config = {}) {
  const {
    role       = 'frontend',
    count      = 5,
    personality = 'professional',
  } = config;

  const roleLabel = getRoleLabel(role);

  const closingMap = {
    professional: `Thank you for completing the ${roleLabel} interview. I have recorded all ${count} of your responses. Your performance report is now being prepared. Well done.`,
    friendly:     `And that brings us to the end of the interview — great job! I have captured all your answers for the ${roleLabel} role. Your results report is being put together now. Well done for giving it your all!`,
    strict:       `Interview complete. All ${count} responses for the ${roleLabel} assessment have been recorded. Your evaluation report is being generated now.`,
    hr:           `That concludes our ${roleLabel} interview. Thank you for sharing your experiences and insights today. I have noted all your responses, and your performance report is now being prepared.`,
  };

  return closingMap[(personality || 'professional').toLowerCase()] || closingMap.professional;
}

// ─────────────────────────────────────────────────────────────────────────────
// shouldAutoFollowUp
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decides whether an AI follow-up question should be generated.
 *
 * Rules:
 * - Hard stops: already has follow-up, is last question, or empty answer
 * - Considers answer relevance, conceptual completeness, depth, and whether a follow-up materially improves evaluation
 * - Uses existing AI evaluation infrastructure scores if available (e.g. score between 35 and 72 indicates substance with room to probe)
 * - Conservative fallback when AI eval is unavailable (does not penalize short answers if technical)
 */
export function shouldAutoFollowUp({
  answer,
  aiEvaluation = null,
  role = 'frontend',
  interviewType = 'technical',
  hasFollowUp = false,
  isLastQuestion = false,
}) {
  // Hard stops
  if (hasFollowUp || isLastQuestion) return false;
  if (!answer || !answer.trim()) return false;

  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Too short to extract any meaningful concept to probe
  if (wordCount < 8) return false;

  // 1. PRIMARY SIGNAL: AI Evaluation result from existing evaluation service
  if (aiEvaluation && typeof aiEvaluation.score === 'number') {
    const score = aiEvaluation.score;
    // Score between 35 and 72 suggests candidate understood the topic partially or gave high-level points,
    // so a follow-up probing edge cases/clarifications will materially improve evaluation.
    // Score < 35: candidate is struggling heavily, follow-up would overwhelm without value.
    // Score > 75: answer is comprehensive and high-scoring, no follow-up needed.
    if (score >= 35 && score <= 72) {
      return true;
    }
    // If AI evaluation specifically identified missing key concepts or strengths/improvements:
    if (aiEvaluation.improvements && aiEvaluation.improvements.length > 0 && score >= 30 && score <= 80) {
      return true;
    }
    return false;
  }

  // 2. CONSERVATIVE LOCAL FALLBACK (When AI evaluation is not yet completed / offline):
  // Never penalize short answers merely for length if technical.
  // Only probe medium-length responses where technical depth or edge cases are likely left unstated.
  if (wordCount > 150) {
    // Very comprehensive answer; no need to interrupt
    return false;
  }

  if (role === 'hr' || interviewType === 'hr') {
    // HR questions: probe concise answers (10-60 words) to get specific behavioral STAR examples
    return wordCount >= 10 && wordCount <= 60;
  }

  // Technical questions fallback:
  // Answers between 12 and 85 words often cover the definition but omit trade-offs/edge cases
  return wordCount >= 12 && wordCount <= 85;
}

// ─────────────────────────────────────────────────────────────────────────────
// getFollowUpIntroduction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns dynamic AI speech for introducing a follow-up question based on personality.
 */
export function getFollowUpIntroduction(personality = 'professional', isHR = false) {
  if (isHR || personality === 'hr') {
    return "Thank you. I'd like to understand how you approached that specific situation in practice.";
  }
  switch ((personality || 'professional').toLowerCase()) {
    case 'friendly':
      return "Great! Let's dig a little deeper into that concept.";
    case 'strict':
      return "Let's examine the edge cases and architectural trade-offs of your approach.";
    case 'professional':
    default:
      return "Let's explore your understanding of this concept further.";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getQuestionTransitionText
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns dynamic AI transition phrase when moving to the next question.
 */
export function getQuestionTransitionText(personality = 'professional', isHR = false) {
  if (isHR || personality === 'hr') {
    return 'Thank you for sharing that context. Let us proceed to the next scenario.';
  }
  switch ((personality || 'professional').toLowerCase()) {
    case 'friendly':
      return 'Nice work on that question! Let us move on to the next one.';
    case 'strict':
      return 'Response recorded. Let us proceed to the next topic.';
    case 'professional':
    default:
      return 'Thank you for your answer. Moving to the next question.';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// useInterviewFlow hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to manage real interview flow state
 */
export function useInterviewFlow(config = {}) {
  // Phases: 'intro' | 'asking' | 'listening' | 'evaluating' | 'followup' | 'transitioning' | 'closing' | 'done'
  const [phase, setPhase] = useState('intro');
  const [introDismissed, setIntroDismissed] = useState(false);

  const introText   = useMemo(() => generateIntroText(config), [config]);
  const closingText = useMemo(() => generateClosingText(config), [config]);

  const dismissIntro = useCallback(() => {
    setIntroDismissed(true);
    setPhase('asking');
  }, []);

  return {
    phase,
    setPhase,
    introText,
    closingText,
    introDismissed,
    dismissIntro,
    generateIntroText,
    generateClosingText,
    shouldAutoFollowUp,
    getFollowUpIntroduction,
    getQuestionTransitionText,
  };
}

export default useInterviewFlow;
