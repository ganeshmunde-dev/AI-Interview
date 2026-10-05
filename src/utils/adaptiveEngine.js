// src/utils/adaptiveEngine.js
// Rule-based Adaptive Difficulty Engine — deterministic, fast, free of additional API calls.
// Evaluates candidate performance after each question to decide if difficulty should be
// promoted, maintained, or demoted for the next question.

// ── Difficulty ordering ────────────────────────────────────────────────────────
export const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

export const DIFFICULTY_LABELS = {
  easy:   { label: 'Easy',   emoji: '🟢', color: 'text-green-500',  bg: 'bg-green-500/15',  border: 'border-green-500/30' },
  medium: { label: 'Medium', emoji: '🔵', color: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/30'  },
  hard:   { label: 'Hard',   emoji: '🔴', color: 'text-red-400',    bg: 'bg-red-500/15',    border: 'border-red-500/30'   },
};

// ── HR-specific stop words (low-value filler) ─────────────────────────────────
const HR_FILLER = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'the', 'a', 'an', 'is', 'are', 'was',
  'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'it', 'its', 'this', 'that',
  'and', 'or', 'but', 'if', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'as', 'by', 'from', 'up', 'so', 'than', 'then', 'there', 'here',
]);

// ── Technical depth keywords (non-exhaustive; purpose: signal genuine depth) ──
const TECHNICAL_DEPTH_MARKERS = [
  // Reasoning words
  'because', 'therefore', 'however', 'although', 'whereas', 'specifically',
  'essentially', 'fundamentally', 'internally', 'underlying', 'mechanism',
  'implementation', 'architecture', 'design', 'pattern', 'approach', 'trade-off',
  'trade off', 'tradeoff', 'complexity', 'performance', 'optimize', 'efficiency',
  'memory', 'thread', 'concurrent', 'async', 'synchronous', 'lifecycle',
  // Structural signals
  'firstly', 'secondly', 'additionally', 'furthermore', 'for example', 'for instance',
  'such as', 'compared to', 'in contrast', 'on the other hand',
  // Accuracy signals
  'algorithm', 'interface', 'abstract', 'inheritance', 'polymorphism',
  'encapsulation', 'dependency', 'injection', 'scope', 'immutable',
  'serializable', 'exception', 'callback', 'promise', 'closure', 'prototype',
];

// ── HR / Behavioral depth markers ─────────────────────────────────────────────
const HR_DEPTH_MARKERS = [
  'situation', 'task', 'action', 'result',   // STAR method
  'team', 'colleague', 'manager', 'project', 'stakeholder', 'deadline',
  'conflict', 'resolved', 'communicated', 'collaborated', 'led', 'initiative',
  'challenge', 'overcame', 'learned', 'improved', 'feedback', 'reflect',
  'impact', 'delivered', 'outcome', 'goal', 'priority', 'adapt', 'flexible',
];

// ── Performance tiers ──────────────────────────────────────────────────────────
export const PERFORMANCE_TIER = {
  STRONG:  'strong',   // 75–100
  AVERAGE: 'average',  // 50–74
  WEAK:    'weak',     // 0–49
};

/**
 * Normalise a text to a clean lowercase token list (removes punctuation).
 */
function tokenise(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Count how many distinct depth markers are present in the answer (case-insensitive).
 * Uses a substring match so multi-word markers work.
 */
function countDepthMarkers(text = '', markers) {
  const lower = text.toLowerCase();
  let count = 0;
  for (const marker of markers) {
    if (lower.includes(marker)) count += 1;
  }
  return count;
}

/**
 * Computes meaningful word count, excluding filler stop words.
 */
function meaningfulWordCount(text = '', isHR = false) {
  const tokens = tokenise(text);
  if (isHR) {
    return tokens.filter(t => t.length > 2 && !HR_FILLER.has(t)).length;
  }
  return tokens.length;
}

// ── HR scoring ─────────────────────────────────────────────────────────────────
function scoreHRAnswer({ primaryAnswer = '', followUpAnswer = '', timedOut = false }) {
  let score = 0;

  // Empty primary answer
  if (!primaryAnswer.trim()) {
    return {
      score: timedOut ? 5 : 0,
      tier: PERFORMANCE_TIER.WEAK,
      reasons: [timedOut ? 'Question timed out with no answer.' : 'No answer provided.'],
    };
  }

  const combined  = `${primaryAnswer} ${followUpAnswer || ''}`.trim();
  const wordCount = meaningfulWordCount(combined, true);
  const depthScore = countDepthMarkers(combined, HR_DEPTH_MARKERS);

  // 1. Word count scoring (HR requires narrative responses) ── max 30 pts
  if (wordCount >= 80)       score += 30;
  else if (wordCount >= 50)  score += 22;
  else if (wordCount >= 30)  score += 14;
  else if (wordCount >= 15)  score += 6;
  else                       score += 0;

  // 2. STAR structure depth ── max 40 pts
  const starKeywords = ['situation', 'task', 'action', 'result'];
  const starHits = starKeywords.filter(k => combined.toLowerCase().includes(k)).length;
  score += starHits * 10;   // 0–40 pts

  // 3. Behavioral depth markers ── max 20 pts
  const depthContrib = Math.min(depthScore, 5) * 4;  // 0–20 pts
  score += depthContrib;

  // 4. Follow-up participation ── max 10 pts (only if answered, not just requested)
  if (followUpAnswer && followUpAnswer.trim().length > 20) {
    score += 10;
  }

  // 5. Timeout penalty
  if (timedOut && !primaryAnswer.trim()) {
    score = Math.max(0, score - 20);
  } else if (timedOut) {
    score = Math.max(0, score - 10);
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  const tier =
    score >= 75 ? PERFORMANCE_TIER.STRONG
    : score >= 50 ? PERFORMANCE_TIER.AVERAGE
    : PERFORMANCE_TIER.WEAK;

  const reasons = buildHRReasons(score, starHits, wordCount, depthContrib, followUpAnswer, timedOut);
  return { score, tier, reasons };
}

function buildHRReasons(score, starHits, wordCount, depthContrib, followUpAnswer, timedOut) {
  const reasons = [];
  if (timedOut)          reasons.push('Question timed out.');
  if (starHits >= 3)     reasons.push('Strong STAR method structure.');
  else if (starHits >= 1) reasons.push('Partial STAR method used.');
  else                   reasons.push('STAR method not clearly demonstrated.');
  if (wordCount >= 50)   reasons.push('Detailed narrative response.');
  else if (wordCount >= 20) reasons.push('Moderate narrative length.');
  else                   reasons.push('Response is brief — more detail recommended.');
  if (depthContrib >= 12) reasons.push('Good behavioral depth with concrete examples.');
  if (followUpAnswer && followUpAnswer.trim().length > 20) reasons.push('Follow-up question answered.');
  return reasons;
}

// ── Technical scoring ──────────────────────────────────────────────────────────
function scoreTechnicalAnswer({ primaryAnswer = '', followUpAnswer = '', timedOut = false }) {
  let score = 0;

  // Empty primary answer
  if (!primaryAnswer.trim()) {
    return {
      score: timedOut ? 5 : 0,
      tier: PERFORMANCE_TIER.WEAK,
      reasons: [timedOut ? 'Question timed out with no answer.' : 'No answer provided.'],
    };
  }

  const combined   = `${primaryAnswer} ${followUpAnswer || ''}`.trim();
  const wordCount  = tokenise(combined).length;
  const depthScore = countDepthMarkers(combined, TECHNICAL_DEPTH_MARKERS);

  // 1. Depth markers (quality signal — NOT just length) ── max 45 pts
  if (depthScore >= 10)     score += 45;
  else if (depthScore >= 6) score += 35;
  else if (depthScore >= 3) score += 22;
  else if (depthScore >= 1) score += 10;
  else                      score += 0;

  // 2. Length as a secondary signal (content requires elaboration) ── max 30 pts
  if (wordCount >= 80)       score += 30;
  else if (wordCount >= 50)  score += 22;
  else if (wordCount >= 25)  score += 14;
  else if (wordCount >= 10)  score += 6;
  else                       score += 2;

  // 3. Structure/multi-point signal ── max 15 pts
  const sentenceCount = (combined.match(/[.!?]+/g) || []).length;
  if (sentenceCount >= 4)      score += 15;
  else if (sentenceCount >= 2) score += 8;
  else                         score += 2;

  // 4. Follow-up quality ── max 10 pts
  //    Only credit if the follow-up answer has meaningful content.
  if (followUpAnswer && followUpAnswer.trim()) {
    const fuDepth = countDepthMarkers(followUpAnswer, TECHNICAL_DEPTH_MARKERS);
    const fuWords = tokenise(followUpAnswer).length;
    if (fuDepth >= 3 && fuWords >= 30) score += 10;
    else if (fuDepth >= 1 || fuWords >= 15) score += 5;
    // else: follow-up requested but weak → no bonus
  }

  // 5. Timeout penalty
  if (timedOut && !primaryAnswer.trim()) {
    score = Math.max(0, score - 25);
  } else if (timedOut) {
    score = Math.max(0, score - 10);
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  const tier =
    score >= 75 ? PERFORMANCE_TIER.STRONG
    : score >= 50 ? PERFORMANCE_TIER.AVERAGE
    : PERFORMANCE_TIER.WEAK;

  const reasons = buildTechnicalReasons(score, depthScore, wordCount, followUpAnswer, timedOut);
  return { score, tier, reasons };
}

function buildTechnicalReasons(score, depthScore, wordCount, followUpAnswer, timedOut) {
  const reasons = [];
  if (timedOut) reasons.push('Question timed out.');
  if (depthScore >= 8)       reasons.push('Strong technical depth and reasoning.');
  else if (depthScore >= 4)  reasons.push('Good technical explanation.');
  else if (depthScore >= 1)  reasons.push('Basic explanation provided — more depth recommended.');
  else                       reasons.push('Answer lacks technical depth or specificity.');
  if (wordCount >= 60)       reasons.push('Well-elaborated response.');
  else if (wordCount >= 25)  reasons.push('Moderate elaboration.');
  else                       reasons.push('Response is concise — consider explaining more.');
  if (followUpAnswer && followUpAnswer.trim().length > 20) {
    reasons.push('Follow-up question attempted.');
  }
  return reasons;
}

// ── Main evaluation entry point ────────────────────────────────────────────────
/**
 * Evaluates a single question response and returns a performance assessment.
 *
 * @param {Object} params
 * @param {string}  params.primaryAnswer    - Candidate's primary answer text
 * @param {string}  [params.followUpAnswer] - Candidate's follow-up answer (if any)
 * @param {boolean} [params.timedOut]       - Whether the question timer expired
 * @param {string}  [params.interviewType]  - 'hr' | 'technical' | 'coding' | 'mixed'
 * @param {string}  [params.role]           - Interview role key
 *
 * @returns {{ score: number, tier: string, reasons: string[] }}
 */
export function evaluateAnswer({
  primaryAnswer = '',
  followUpAnswer = '',
  timedOut = false,
  interviewType = 'technical',
  role = 'frontend',
}) {
  const isHR = interviewType === 'hr' || role === 'hr';
  if (isHR) {
    return scoreHRAnswer({ primaryAnswer, followUpAnswer, timedOut });
  }
  return scoreTechnicalAnswer({ primaryAnswer, followUpAnswer, timedOut });
}

// ── Difficulty transition ──────────────────────────────────────────────────────
/**
 * Determines the next difficulty based on adaptive state and this question's performance.
 *
 * Promotion rule:  2 consecutive STRONG → one step up (easy→medium, medium→hard).
 * Demotion rule:   2 consecutive WEAK   → one step down (hard→medium, medium→easy).
 *                  Immediate demotion if answer is completely empty.
 * Maintain:        Otherwise keep current difficulty.
 *
 * @param {Object} params
 * @param {string}  params.currentDifficulty  - 'easy' | 'medium' | 'hard'
 * @param {number}  params.consecutiveStrong  - Count of consecutive strong answers so far
 * @param {number}  params.consecutiveWeak    - Count of consecutive weak answers so far
 * @param {string}  params.tier               - PERFORMANCE_TIER value for this question
 * @param {string}  params.primaryAnswer      - Used to detect truly empty answer
 *
 * @returns {{ nextDifficulty: string, trend: string, newConsecutiveStrong: number, newConsecutiveWeak: number }}
 */
export function computeNextDifficulty({
  currentDifficulty,
  consecutiveStrong,
  consecutiveWeak,
  tier,
  primaryAnswer = '',
}) {
  const currentIdx = DIFFICULTY_ORDER.indexOf(currentDifficulty);

  let newConsecutiveStrong = consecutiveStrong;
  let newConsecutiveWeak   = consecutiveWeak;

  if (tier === PERFORMANCE_TIER.STRONG) {
    newConsecutiveStrong += 1;
    newConsecutiveWeak   = 0;
  } else if (tier === PERFORMANCE_TIER.WEAK) {
    newConsecutiveWeak   += 1;
    newConsecutiveStrong = 0;
  } else {
    // Average — reset both streaks
    newConsecutiveStrong = 0;
    newConsecutiveWeak   = 0;
  }

  // Immediate demotion for truly empty answers
  const isEmpty = !primaryAnswer.trim();

  // Promotion: 2 consecutive strong answers
  if (newConsecutiveStrong >= 2 && currentIdx < DIFFICULTY_ORDER.length - 1) {
    return {
      nextDifficulty: DIFFICULTY_ORDER[currentIdx + 1],
      trend: 'promoted',
      newConsecutiveStrong: 0, // reset after transition
      newConsecutiveWeak:   0,
    };
  }

  // Demotion: 2 consecutive weak answers OR immediately empty
  const shouldDemote =
    (newConsecutiveWeak >= 2 && currentIdx > 0) ||
    (isEmpty && currentIdx > 0);

  if (shouldDemote) {
    return {
      nextDifficulty: DIFFICULTY_ORDER[currentIdx - 1],
      trend: 'demoted',
      newConsecutiveStrong: 0,
      newConsecutiveWeak:   0, // reset after transition
    };
  }

  // Maintain current difficulty
  return {
    nextDifficulty: currentDifficulty,
    trend: 'maintained',
    newConsecutiveStrong,
    newConsecutiveWeak,
  };
}

// ── Personalised feedback messages ────────────────────────────────────────────
/**
 * Returns a short feedback string suited to the personality and the trend.
 *
 * @param {string} trend          - 'promoted' | 'demoted' | 'maintained'
 * @param {string} nextDifficulty - 'easy' | 'medium' | 'hard'
 * @param {string} personality    - 'professional' | 'friendly' | 'strict' | 'hr'
 * @param {string[]} reasons      - Engine-generated reason strings
 *
 * @returns { heading: string, detail: string }
 */
export function getAdaptiveFeedbackMessage(trend, nextDifficulty, personality, reasons = []) {
  const diffLabel = DIFFICULTY_LABELS[nextDifficulty]?.label || nextDifficulty;
  const primaryReason = reasons[0] || '';

  if (trend === 'promoted') {
    const headings = {
      professional: `📈 Promoted to ${diffLabel}`,
      friendly:     `📈 Great work! Moving to ${diffLabel}`,
      strict:       `📈 Advancing to ${diffLabel}`,
      hr:           `📈 Moving forward to ${diffLabel}`,
    };
    const details = {
      professional: primaryReason || 'Strong technical reasoning demonstrated.',
      friendly:     primaryReason || "You're doing great — let's challenge you a bit more!",
      strict:       primaryReason || 'Performance meets the bar. Next level activated.',
      hr:           primaryReason || 'Strong communication and depth. Raising the bar.',
    };
    return {
      heading: headings[personality] || headings.professional,
      detail:  details[personality]  || details.professional,
    };
  }

  if (trend === 'demoted') {
    const headings = {
      professional: `📉 Adjusted to ${diffLabel}`,
      friendly:     `📉 Let's build confidence with ${diffLabel} questions`,
      strict:       `📉 Dropping to ${diffLabel}`,
      hr:           `📉 Shifting to ${diffLabel} level`,
    };
    const details = {
      professional: primaryReason || 'Let\'s reinforce fundamentals before advancing.',
      friendly:     primaryReason || "No worries — let's solidify the basics first.",
      strict:       primaryReason || 'Insufficient depth. Redirecting to an appropriate level.',
      hr:           primaryReason || 'More structured responses are needed. Adjusting accordingly.',
    };
    return {
      heading: headings[personality] || headings.professional,
      detail:  details[personality]  || details.professional,
    };
  }

  // Maintained
  const headings = {
    professional: `➡️ Difficulty Maintained: ${diffLabel}`,
    friendly:     `➡️ Staying at ${diffLabel} — keep it up!`,
    strict:       `➡️ ${diffLabel} — no change`,
    hr:           `➡️ Continuing at ${diffLabel} level`,
  };
  const details = {
    professional: 'Average performance. Continuing at the current difficulty.',
    friendly:     "Solid effort! Sticking with this level for now.",
    strict:       'Performance is adequate but not exceptional.',
    hr:           'Response noted. Maintaining current difficulty.',
  };
  return {
    heading: headings[personality] || headings.professional,
    detail:  details[personality]  || details.professional,
  };
}
