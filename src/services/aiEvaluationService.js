// src/services/aiEvaluationService.js
// ──────────────────────────────────────────────────────────────────────────────
// AI Evaluation Service
//
// Architecture: React → Spring Boot → Gemini AI API
//
// The Gemini API key is NEVER stored in or exposed to the React frontend.
// React only talks to the Spring Boot backend (/api/evaluate).
// Spring Boot holds and uses the API key server-side.
// ──────────────────────────────────────────────────────────────────────────────

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Evaluate a single answer via the Spring Boot backend → Gemini AI.
 *
 * @param {Object} params
 * @param {string} params.question          - The interview question text
 * @param {string} params.answer            - The candidate's answer text
 * @param {string} params.role              - Role key (e.g. 'frontend', 'java_dev', 'hr')
 * @param {string} params.skill             - Skill being tested (e.g. 'JavaScript', 'OOP')
 * @param {string} params.difficulty        - 'easy' | 'medium' | 'hard'
 * @param {string} params.interviewType     - 'technical' | 'hr' | 'coding' | 'mixed'
 * @param {string} [params.personality]     - 'professional' | 'friendly' | 'strict' | 'hr'
 * @param {string} [params.followUpQuestion] - AI Follow-up question if asked
 * @param {string} [params.followUpAnswer]  - Candidate's follow-up answer if provided
 *
 * @returns {Promise<AiEvaluationResult>}
 *   { score, rating, skill, correctness, relevance, depth, completeness, clarity, feedback, strengths, improvements, idealAnswer, followUpRecommended, evaluatedByAi }
 */
export const evaluateAnswerWithAI = async ({
  question,
  answer,
  role,
  skill,
  difficulty,
  interviewType,
  personality = 'professional',
  followUpQuestion = null,
  followUpAnswer = null,
}) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question || '',
        answer: answer || '',
        role: role || 'frontend',
        skill: skill || 'General',
        difficulty: difficulty || 'medium',
        interviewType: interviewType || 'technical',
        personality: personality || 'professional',
        followUpQuestion: followUpQuestion || null,
        followUpAnswer: followUpAnswer || null,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[AiEvaluationService] Backend returned error:', response.status, errorBody);
      return buildFallbackResult(answer, skill, 'Backend evaluation service error.', role, interviewType, followUpAnswer);
    }

    const json = await response.json();
    const data = json.data;

    if (!data) {
      return buildFallbackResult(answer, skill, 'Empty response from backend.', role, interviewType, followUpAnswer);
    }

    const score = clamp(data.score ?? 0);

    return {
      score,
      rating: data.rating || (score >= 80 ? 'Strong' : score >= 65 ? 'Good' : score >= 45 ? 'Adequate' : 'Needs Improvement'),
      skill: data.skill || skill || 'General',
      correctness: clamp(data.correctness ?? score),
      relevance: clamp(data.relevance ?? score),
      depth: clamp(data.depth ?? Math.max(20, score - 5)),
      completeness: clamp(data.completeness ?? score),
      clarity: clamp(data.clarity ?? score),
      feedback: data.feedback || 'Evaluation complete.',
      strengths: Array.isArray(data.strengths) ? data.strengths : [],
      improvements: Array.isArray(data.improvements) ? data.improvements : [],
      idealAnswer: data.idealAnswer || null,
      followUpRecommended: data.followUpRecommended === true,
      evaluatedByAi: data.evaluatedByAi === true,
      fallbackReason: data.fallbackReason || null,
    };
  } catch (err) {
    console.error('[AiEvaluationService] Network or parse error:', err);
    return buildFallbackResult(answer, skill, 'Network error — could not reach evaluation backend.', role, interviewType, followUpAnswer);
  }
};

/**
 * Evaluate all answers in a session batch.
 * Returns a Map of { questionId → AiEvaluationResult }
 *
 * @param {Array} questions - Array of question objects with { id, question, skill, category }
 * @param {Object} answers  - Object of { questionId: answerText }
 * @param {Object} config   - { role, difficulty, type, personality }
 * @param {Object} [followUps] - Object of { questionId: { question, answer } }
 */
export const evaluateAllAnswers = async (questions, answers, config, followUps = {}) => {
  const results = {};

  for (const q of questions) {
    const answerText = answers[q.id] || '';
    const fuData = followUps[q.id];
    const result = await evaluateAnswerWithAI({
      question: q.question,
      answer: answerText,
      role: config.role || 'frontend',
      skill: q.skill || q.category || 'General',
      difficulty: q.adaptiveDifficulty || config.difficulty || 'medium',
      interviewType: config.type || 'technical',
      personality: config.personality || 'professional',
      followUpQuestion: fuData?.question || null,
      followUpAnswer: fuData?.answer || null,
    });
    results[q.id] = result;
  }

  return results;
};

/**
 * Generate a contextual follow-up question via the Spring Boot backend → Gemini AI.
 *
 * @param {Object} params
 * @param {string} params.question      - The primary interview question text
 * @param {string} params.answer        - The candidate's primary answer text
 * @param {string} params.role          - Role key (e.g. 'frontend', 'react_dev', 'java_dev', 'hr')
 * @param {string} params.skill         - Skill area (e.g. 'State', 'Collections')
 * @param {string} params.difficulty    - 'easy' | 'medium' | 'hard'
 * @param {string} params.interviewType - 'technical' | 'hr' | 'coding' | 'mixed'
 *
 * @returns {Promise<{ followUpQuestion: string, source: 'AI' | 'FALLBACK' }>}
 */
/**
 * Generate a contextual follow-up question via the Spring Boot backend → Gemini AI.
 *
 * @param {Object} params
 * @param {string} params.question      - The primary interview question text
 * @param {string} params.answer        - The candidate's primary answer text
 * @param {string} params.role          - Role key (e.g. 'frontend', 'react_dev', 'java_dev', 'hr')
 * @param {string} params.skill         - Skill area (e.g. 'State', 'Collections')
 * @param {string} params.difficulty    - 'easy' | 'medium' | 'hard'
 * @param {string} params.interviewType - 'technical' | 'hr' | 'coding' | 'mixed'
 * @param {string} params.personality   - 'professional' | 'friendly' | 'strict' | 'hr'
 *
 * @returns {Promise<{ followUpQuestion: string, source: 'AI' | 'FALLBACK' }>}
 */
export const generateFollowUpQuestion = async ({
  question,
  answer,
  role,
  skill,
  difficulty,
  interviewType,
  personality = 'professional',
}) => {
  if (!answer || !answer.trim()) {
    throw new Error('Please answer the question before requesting a follow-up.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/evaluate/follow-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question || '',
        answer: answer || '',
        role: role || 'frontend',
        skill: skill || 'General',
        difficulty: difficulty || 'medium',
        interviewType: interviewType || 'technical',
        personality: personality || 'professional',
      }),
    });

    if (!response.ok) {
      console.warn('[AiEvaluationService] Backend follow-up endpoint returned error, using fallback');
      return buildFallbackFollowUp({ question, answer, role, skill, difficulty, personality });
    }

    const json = await response.json();
    const data = json.data;

    if (!data || !data.followUpQuestion) {
      return buildFallbackFollowUp({ question, answer, role, skill, difficulty, personality });
    }

    return {
      followUpQuestion: data.followUpQuestion,
      source: data.source === 'AI' ? 'AI' : 'FALLBACK',
    };
  } catch (err) {
    console.warn('[AiEvaluationService] Network error during follow-up call, using client fallback:', err);
    return buildFallbackFollowUp({ question, answer, role, skill, difficulty, personality });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function clamp(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

/**
 * Rule-based fallback scoring (when backend is unavailable).
 * Used only as last-resort — the backend itself already has a fallback.
 */
function buildFallbackResult(answer, skill, reason, role = 'frontend', interviewType = 'technical', followUpAnswer = null) {
  const text = (answer || '').trim();
  let wordCount = text.split(/\s+/).filter(Boolean).length;
  if (followUpAnswer && followUpAnswer.trim()) {
    wordCount += followUpAnswer.trim().split(/\s+/).filter(Boolean).length;
  }

  if (wordCount === 0) {
    return {
      score: 0,
      rating: 'Not Evaluated',
      skill: skill || 'General',
      correctness: 0,
      relevance: 0,
      depth: 0,
      completeness: 0,
      clarity: 0,
      feedback: 'No answer was submitted, so this question could not be evaluated.',
      strengths: [],
      improvements: ['Submit an answer to receive evaluation feedback'],
      idealAnswer: null,
      followUpRecommended: false,
      evaluatedByAi: false,
      fallbackReason: reason,
    };
  }

  let score = 40;
  if (wordCount > 50) score = 85;
  else if (wordCount > 30) score = 75;
  else if (wordCount > 15) score = 65;
  else if (wordCount > 5) score = 52;

  const isHR = role === 'hr' || interviewType === 'hr';

  return {
    score,
    rating: score >= 80 ? 'Strong' : score >= 65 ? 'Good' : score >= 45 ? 'Adequate' : 'Needs Improvement',
    skill: skill || 'General',
    correctness: score,
    relevance: Math.min(100, score + 5),
    depth: Math.max(20, score - 8),
    completeness: Math.max(0, score - 10),
    clarity: wordCount > 10 ? 75 : 50,
    feedback: isHR
      ? 'Answer evaluated using behavioral evaluation standards. Structure examples with Situation, Task, Action, and Result for higher impact.'
      : 'Answer evaluated with core technical criteria. Practice explaining edge cases and real-world system trade-offs.',
    strengths: [
      isHR
        ? `Communicated relevant context for ${skill}`
        : `Demonstrated core knowledge in ${skill}`
    ],
    improvements: [
      isHR
        ? `Provide more specific measurable examples for ${skill}`
        : `Deepen technical explanation with edge cases in ${skill}`
    ],
    idealAnswer: null,
    followUpRecommended: score >= 35 && score <= 72,
    evaluatedByAi: false,
    fallbackReason: reason,
  };
}

/**
 * Contextual fallback generator for follow-up questions when backend/AI is unreachable.
 */
function buildFallbackFollowUp({
  question = '',
  answer = '',
  role = 'frontend',
  skill = '',
  personality = 'professional',
}) {
  const r = role.toLowerCase();
  const q = question.toLowerCase();
  const a = answer.toLowerCase();
  const s = skill.toLowerCase();
  const p = (personality || 'professional').toLowerCase();

  let followUp = '';

  if (r.includes('hr') || s.includes('hr')) {
    if (a.includes('team') || a.includes('collaborat')) {
      followUp = 'Can you describe a situation where a team member disagreed with your approach, and how you reached a resolution?';
    } else if (a.includes('conflict') || a.includes('disagree')) {
      followUp = 'What specific steps did you take to maintain a constructive working relationship afterwards?';
    } else if (a.includes('lead') || a.includes('project')) {
      followUp = 'How did you measure the ultimate success and impact of that initiative on your team or organization?';
    } else {
      followUp = 'Can you provide a specific real-world example from your past experience that illustrates how you handled that situation?';
    }
  } else if (r.includes('react') || q.includes('react') || s.includes('react')) {
    if (q.includes('state') || a.includes('state')) {
      if (p === 'friendly') {
        followUp = "That's a good start! Could you explain how state updates trigger rendering and why state shouldn't be mutated directly?";
      } else if (p === 'strict') {
        followUp = 'Explain precisely how state updates trigger React rendering and what issues occur if state is mutated directly.';
      } else {
        followUp = "Can you explain how state updates trigger rendering and why state shouldn't be mutated directly?";
      }
    } else if (q.includes('prop') || a.includes('prop')) {
      if (p === 'friendly') {
        followUp = 'Good point. How do you usually handle prop drilling in deeply nested component trees?';
      } else if (p === 'strict') {
        followUp = 'What specific architectural patterns prevent prop drilling in deep trees, and what are their performance trade-offs?';
      } else {
        followUp = 'How do you handle prop drilling in deeply nested component trees without passing props through intermediate components?';
      }
    } else if (q.includes('hook') || q.includes('useeffect') || a.includes('hook')) {
      if (p === 'friendly') {
        followUp = 'Nice! Could you explain what can happen if dependency arrays in useEffect are configured incorrectly?';
      } else if (p === 'strict') {
        followUp = 'Detail the exact rules of React hooks and the precise runtime consequences of stale closures in useEffect dependencies.';
      } else {
        followUp = 'What are the key rules of React hooks, and what issues can occur if dependency arrays in useEffect are specified incorrectly?';
      }
    } else if (q.includes('virtual dom') || a.includes('virtual dom')) {
      if (p === 'strict') {
        followUp = 'Detail the exact algorithmic complexity and heuristics React uses in its reconciliation diffing algorithm.';
      } else {
        followUp = "How does React's diffing algorithm optimize updates when comparing two Virtual DOM trees?";
      }
    } else {
      followUp = 'How would you optimize the performance of this component if it re-renders frequently with large datasets?';
    }
  } else if (r.includes('java') || s.includes('java') || r.includes('spring')) {
    if (q.includes('hashmap') || q.includes('collection') || a.includes('map')) {
      if (p === 'friendly') {
        followUp = 'That makes sense. Could you explain how HashMap handles bucket collisions in Java 8+ when trees are used?';
      } else if (p === 'strict') {
        followUp = 'Specify the exact threshold for HashMap treeification in Java 8+ and how hashCode/equals contracts affect collision resolution.';
      } else {
        followUp = 'How does HashMap handle bucket collisions in Java 8+ when the threshold is exceeded, and why is treeification used?';
      }
    } else if (q.includes('thread') || q.includes('concurren') || a.includes('thread')) {
      if (p === 'strict') {
        followUp = 'Compare synchronized vs ReentrantLock at bytecode and JVM level regarding fairness, condition queues, and thread starvation.';
      } else {
        followUp = 'What is the difference between synchronized blocks and ReentrantLock in terms of fairness and lock interruption?';
      }
    } else if (q.includes('oop') || q.includes('class') || q.includes('interface')) {
      followUp = 'In what practical design scenario would you prefer an abstract class over a default method in an interface?';
    } else if (q.includes('spring') || r.includes('spring')) {
      followUp = 'How does the Spring IoC container manage bean lifecycles and resolve circular dependencies?';
    } else {
      followUp = 'What potential exceptions or edge cases should be accounted for when implementing this in production?';
    }
  } else if (r.includes('php')) {
    if (q.includes('pdo') || q.includes('mysql') || a.includes('query')) {
      followUp = 'How do prepared statements in PDO protect against SQL injection compared to string concatenation?';
    } else if (q.includes('session') || a.includes('cookie')) {
      followUp = 'What security measures (such as HttpOnly and SameSite flags) should be applied to session management?';
    } else {
      followUp = 'How would you structure this pattern using modern object-oriented PHP principles and namespaces?';
    }
  } else {
    // General Frontend
    if (q.includes('javascript') || q.includes('closure') || a.includes('scope')) {
      if (p === 'friendly') {
        followUp = 'Great! Could you give an example of how closures can retain memory if references are left uncleared?';
      } else if (p === 'strict') {
        followUp = 'Demonstrate the precise memory leak mechanism with JavaScript closures and how the garbage collector handles them.';
      } else {
        followUp = 'Can you give an example of how closures can lead to memory retention issues if references are not cleared?';
      }
    } else if (q.includes('css') || q.includes('flex') || q.includes('grid')) {
      followUp = 'How would you ensure this layout remains fully accessible and performant across mobile and desktop devices?';
    } else {
      followUp = 'Can you explain a practical edge case with this approach and how you would handle it?';
    }
  }

  return {
    followUpQuestion: followUp,
    source: 'FALLBACK',
  };
}

