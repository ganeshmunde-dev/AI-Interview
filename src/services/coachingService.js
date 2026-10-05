// src/services/coachingService.js
/**
 * Coaching Data Service
 *
 * Communicates with Spring Boot backend endpoints:
 *   POST /api/coaching/analyze
 *   POST /api/coaching/chat
 *
 * Provides safe deterministic fallback if the backend is unreachable.
 * NEVER exposes any API keys in frontend code.
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Fetch personalized AI coaching analysis.
 */
export async function fetchCoachingAnalysis({
  role = 'Frontend Developer',
  interviewType = 'technical',
  overallScore = 70,
  totalInterviews = 1,
  weakSkills = [],
  strongSkills = [],
  recentPerformance = [],
  difficultyHistory = [],
  followUpPerformance = {},
  answerQuality = {},
}) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/coaching/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        role,
        interviewType,
        overallScore,
        totalInterviews,
        weakSkills,
        strongSkills,
        recentPerformance,
        difficultyHistory,
        followUpPerformance,
        answerQuality,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('[CoachingService] Backend unreachable, using deterministic fallback:', err.message);
  }

  // Deterministic local fallback
  return generateLocalCoachingFallback({
    role,
    interviewType,
    overallScore,
    weakSkills,
    strongSkills,
  });
}

/**
 * Send an interactive coaching question to the AI Coach.
 */
export async function sendCoachChatMessage({
  message,
  role = 'Frontend Developer',
  overallScore = 70,
  weakSkills = [],
  strongSkills = [],
  conversationHistory = [],
}) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/coaching/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        role,
        overallScore,
        weakSkills,
        strongSkills,
        conversationHistory,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    console.warn('[CoachingService] Backend unreachable, using fallback chat reply:', err.message);
  }

  return generateLocalChatFallback(message, role, overallScore, weakSkills);
}

/**
 * Local deterministic fallback generator.
 */
function generateLocalCoachingFallback({
  role,
  interviewType,
  overallScore,
  weakSkills = [],
  strongSkills = [],
}) {
  const isHR = interviewType === 'hr' || (role || '').toLowerCase().includes('hr');
  const weak = weakSkills.length > 0
    ? weakSkills
    : isHR ? ['Situational Judgment', 'Leadership Examples'] : ['System Trade-offs', 'Concurrency & Performance'];
  const strong = strongSkills.length > 0
    ? strongSkills
    : isHR ? ['Communication', 'Teamwork'] : ['Core Fundamentals', 'Syntax & Structure'];

  return {
    source: 'LOCAL_FALLBACK',
    executiveSummary: `Your interview performance demonstrates solid mastery of ${strong.join(' and ')}. To reach top-tier candidate benchmarks, focus on structuring answers with clear trade-offs, edge cases, and real-world examples in ${weak.join(' and ')}.`,
    strengths: strong.map((s, idx) => ({
      skill: s,
      score: Math.min(95, overallScore + (idx === 0 ? 8 : 4)),
      summary: 'Consistent conceptual accuracy and structured clarity throughout evaluations.',
    })),
    weaknesses: weak.map((w, idx) => ({
      skill: w,
      score: Math.max(40, overallScore - (idx === 0 ? 12 : 8)),
      why: isHR
        ? 'Responses can be elevated by applying the STAR framework with measurable results.'
        : 'Answers show foundational awareness but lack depth regarding edge cases and internal mechanisms.',
      action: isHR
        ? 'Practice framing past challenges using clear Situation, Task, Action, and Result structures.'
        : 'Practice explaining architecture trade-offs and complexity considerations before finalizing your answers.',
      priority: idx === 0 ? 'HIGH' : 'MEDIUM',
    })),
    studyRoadmap: [
      {
        week: 'Week 1',
        phase: 'Core Foundations',
        topics: [weak[0] || 'Key Principles', 'Precise Terminology'],
        goal: 'Master direct definitions without hesitation and explain core principles concisely.',
      },
      {
        week: 'Week 2',
        phase: 'Practical Scenarios',
        topics: ['Implementation Trade-offs', weak[1] || 'Design Patterns'],
        goal: 'Incorporate real-world production constraints, memory management, and edge cases.',
      },
      {
        week: 'Week 3',
        phase: 'Mock Mastery',
        topics: ['Timed AI Voice Interviews', 'Hard Difficulty Probes'],
        goal: 'Simulate full sessions at Hard difficulty with 100% follow-up probe accuracy.',
      },
    ],
    practiceQuestions: [
      {
        topic: weak[0] || 'Technical Depth',
        question: isHR
          ? 'Describe a high-stakes project where you aligned conflicting viewpoints across teams.'
          : `How would you architect and optimize a high-throughput module handling ${weak[0]} in production?`,
        focus: isHR ? 'STAR framework and constructive leadership.' : 'Systematic problem decomposition and trade-offs.',
      },
      {
        topic: weak[1] || 'Edge Cases',
        question: isHR
          ? 'Tell me about a time an initiative failed. What did you learn and how did you pivot?'
          : 'What are the subtle failure modes and concurrency hazards associated with this pattern?',
        focus: isHR ? 'Accountability, resilience, and growth mindset.' : 'Defensive programming and error recovery.',
      },
    ],
    nextInterviewRecommendation: {
      role: role || 'Software Developer',
      difficulty: overallScore >= 75 ? 'Hard' : 'Medium',
      mode: 'AI Interview',
      focusTopics: weak,
      rationale: `Targeting ${weak.join(', ')} in an AI Voice session will directly accelerate your highest-impact score improvements.`,
    },
  };
}

function generateLocalChatFallback(message, role, overallScore, weakSkills) {
  const msg = (message || '').toLowerCase();
  const weak = weakSkills.length > 0 ? weakSkills[0] : 'system trade-offs';

  let reply = '';
  if (msg.contains('improve') || msg.contains('better')) {
    reply = `To improve your score, structure your answers in 3 clear parts: 1) Direct answer, 2) Concrete production example, and 3) Trade-offs / edge cases. Focusing on ${weak} will yield your biggest score leap!`;
  } else if (msg.contains('score') || msg.contains('low')) {
    reply = `Your current score is ${overallScore}%. Interviewers award top scores when you explain 'why' you choose a solution, not just 'how' it works. Review the weakness section in your coaching dashboard to target key areas.`;
  } else if (msg.contains('question') || msg.contains('practice')) {
    reply = `Here is a great question to practice: "How would you handle race conditions and lock contention in a distributed environment for ${role}?" Focus on consistency and failure recovery!`;
  } else {
    reply = `Great question! For ${role} interviews, senior evaluators look for depth, structured communication, and edge-case awareness. Check your 3-week Study Roadmap on this page for a step-by-step guide.`;
  }

  return { reply, source: 'LOCAL_FALLBACK' };
}
