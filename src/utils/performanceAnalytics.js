// src/utils/performanceAnalytics.js
/**
 * Performance Analytics Engine
 *
 * Pure calculation functions operating on stored interview history.
 * Robustly handles missing fields, legacy records, zero-answer sessions, and role separation.
 */

import { ROLE_SKILL_MAP } from '@/data/results';
import { interviewHistory as defaultMockHistory } from '@/data/history';

/**
 * Safely loads the candidate's interview history from localStorage or fallback mock.
 */
export function getStoredHistory() {
  try {
    const raw = localStorage.getItem('interviewai_history');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not parse localStorage interview history:', err);
  }
  return defaultMockHistory || [];
}

/**
 * Calculates overall high-level summary KPIs.
 */
export function calculateOverallMetrics(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return {
      totalInterviews: 0,
      completedInterviews: 0,
      zeroAnswerInterviews: 0,
      totalQuestionsAttempted: 0,
      totalQuestions: 0,
      averageScore: 0,
      bestScore: 0,
      averageDuration: '0 min',
      completionRate: 0,
      hasData: false,
    };
  }

  const validSessions = history.filter(
    (item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated' && item.evaluationStatus !== 'Not Evaluated'
  );

  const totalInterviews = history.length;
  const completedInterviews = validSessions.length;
  const zeroAnswerInterviews = totalInterviews - completedInterviews;

  const totalQuestionsAttempted = history.reduce((sum, i) => sum + (Number(i.attempted) || 0), 0);
  const totalQuestions = history.reduce((sum, i) => sum + (Number(i.totalQuestions) || 5), 0);

  const scoreSum = validSessions.reduce((sum, i) => sum + (Number(i.score) || 0), 0);
  const averageScore = completedInterviews > 0 ? Math.round(scoreSum / completedInterviews) : 0;
  const bestScore = validSessions.length > 0 ? Math.max(...validSessions.map((i) => Number(i.score) || 0)) : 0;

  // Compute average duration
  let totalDurationMinutes = 0;
  validSessions.forEach((i) => {
    if (typeof i.duration === 'string') {
      const match = i.duration.match(/(\d+)/);
      if (match) totalDurationMinutes += parseInt(match[1], 10);
    }
  });
  const avgMinutes = completedInterviews > 0 ? Math.round(totalDurationMinutes / completedInterviews) : 0;

  const completionRate = totalQuestions > 0 ? Math.round((totalQuestionsAttempted / totalQuestions) * 100) : 0;

  return {
    totalInterviews,
    completedInterviews,
    zeroAnswerInterviews,
    totalQuestionsAttempted,
    totalQuestions,
    averageScore,
    bestScore,
    averageDuration: `${avgMinutes || 12} min`,
    completionRate,
    hasData: completedInterviews > 0,
  };
}

/**
 * Calculates skill-wise averages strictly respecting canonical role skills.
 */
export function calculateSkillPerformance(history = [], selectedRole = null) {
  if (!Array.isArray(history) || history.length === 0) return [];

  const roleKey = (selectedRole || 'all').toLowerCase();
  const validSessions = history.filter(
    (item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated'
  );

  // If a specific role is selected, extract skills strictly for that role
  if (roleKey !== 'all') {
    const roleInfo = ROLE_SKILL_MAP[roleKey] || (roleKey.includes('hr') ? ROLE_SKILL_MAP.hr : ROLE_SKILL_MAP.frontend);
    const canonicalSkills = roleInfo.skills;

    const skillMap = new Map();
    canonicalSkills.forEach((s) => skillMap.set(s, []));

    validSessions
      .filter((s) => (s.roleKey || s.role || '').toLowerCase().includes(roleKey) || (roleKey === 'hr' && (s.type || '').toLowerCase() === 'hr'))
      .forEach((item) => {
        if (item.result?.skillScores && Array.isArray(item.result.skillScores)) {
          item.result.skillScores.forEach((ss) => {
            if (skillMap.has(ss.skill)) {
              skillMap.get(ss.skill).push(ss.score);
            }
          });
        }
      });

    return canonicalSkills.map((skill) => {
      const scores = skillMap.get(skill) || [];
      const score = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      return {
        skill,
        score,
        testedCount: scores.length,
        status: score >= 80 ? 'Strong' : score >= 65 ? 'Good' : score > 0 ? 'Needs Work' : 'Unassessed',
      };
    });
  }

  // Aggregate skills across all attempted sessions
  const aggregateMap = new Map();

  validSessions.forEach((item) => {
    if (item.result?.skillScores && Array.isArray(item.result.skillScores)) {
      item.result.skillScores.forEach((ss) => {
        if (!aggregateMap.has(ss.skill)) aggregateMap.set(ss.skill, []);
        aggregateMap.get(ss.skill).push(ss.score);
      });
    } else {
      // Fallback for legacy history mock
      (item.strongTopics || []).forEach((topic) => {
        if (!aggregateMap.has(topic)) aggregateMap.set(topic, []);
        aggregateMap.get(topic).push(item.score >= 80 ? item.score : 85);
      });
      (item.weakTopics || []).forEach((topic) => {
        if (!aggregateMap.has(topic)) aggregateMap.set(topic, []);
        aggregateMap.get(topic).push(item.score < 65 ? item.score : 55);
      });
    }
  });

  if (aggregateMap.size === 0) return [];

  const results = [];
  aggregateMap.forEach((scores, skill) => {
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    results.push({
      skill,
      score: avg,
      testedCount: scores.length,
      status: avg >= 80 ? 'Strong' : avg >= 65 ? 'Good' : 'Needs Work',
    });
  });

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Calculates performance grouped by interview role.
 */
export function calculateRolePerformance(history = []) {
  if (!Array.isArray(history) || history.length === 0) return [];

  const validSessions = history.filter(
    (item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated'
  );

  const roleGroups = new Map();

  validSessions.forEach((item) => {
    const roleName = item.role || 'Software Developer';
    if (!roleGroups.has(roleName)) {
      roleGroups.set(roleName, {
        role: roleName,
        roleKey: item.roleKey || roleName.toLowerCase().replace(/\s+/g, '_'),
        scores: [],
        totalQuestionsAttempted: 0,
        dates: [],
      });
    }
    const grp = roleGroups.get(roleName);
    grp.scores.push(Number(item.score) || 0);
    grp.totalQuestionsAttempted += Number(item.attempted) || 0;
    if (item.date) grp.dates.push(new Date(item.date));
  });

  const results = [];
  roleGroups.forEach((grp) => {
    const avgScore = Math.round(grp.scores.reduce((a, b) => a + b, 0) / grp.scores.length);
    const bestScore = Math.max(...grp.scores);
    const sortedDates = grp.dates.sort((a, b) => b - a);
    results.push({
      role: grp.role,
      roleKey: grp.roleKey,
      interviewsCount: grp.scores.length,
      averageScore: avgScore,
      bestScore,
      questionsAttempted: grp.totalQuestionsAttempted,
      latestDate: sortedDates[0] ? sortedDates[0].toISOString() : null,
    });
  });

  return results.sort((a, b) => b.interviewsCount - a.interviewsCount);
}

/**
 * Compares performance across difficulty levels (Easy, Medium, Hard).
 */
export function calculateDifficultyPerformance(history = []) {
  const tiers = ['Easy', 'Medium', 'Hard'];
  const validSessions = (history || []).filter(
    (item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated'
  );

  return tiers.map((tier) => {
    const matching = validSessions.filter(
      (item) => (item.difficulty || '').toLowerCase() === tier.toLowerCase()
    );

    const count = matching.length;
    const scores = matching.map((i) => Number(i.score) || 0);
    const averageScore = count > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / count) : 0;
    const questionsAttempted = matching.reduce((sum, i) => sum + (Number(i.attempted) || 0), 0);

    return {
      tier,
      count,
      averageScore,
      questionsAttempted,
      hasData: count > 0,
    };
  });
}

/**
 * Calculates aggregate response quality metrics (Relevance, Correctness, Depth, Clarity, Completeness).
 */
export function calculateAnswerQuality(history = []) {
  const validSessions = (history || []).filter(
    (item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated'
  );

  const metrics = {
    relevance: [],
    correctness: [],
    depth: [],
    clarity: [],
    completeness: [],
  };

  validSessions.forEach((item) => {
    if (item.result?.questionAnalysis && Array.isArray(item.result.questionAnalysis)) {
      item.result.questionAnalysis.forEach((q) => {
        if (typeof q.relevance === 'number') metrics.relevance.push(q.relevance);
        if (typeof q.correctness === 'number') metrics.correctness.push(q.correctness);
        if (typeof q.depth === 'number') metrics.depth.push(q.depth);
        if (typeof q.clarity === 'number') metrics.clarity.push(q.clarity);
        if (typeof q.completeness === 'number') metrics.completeness.push(q.completeness);
      });
    } else {
      // Fallback for legacy items using session score
      const sc = Number(item.score) || 70;
      metrics.relevance.push(Math.min(100, sc + 4));
      metrics.correctness.push(sc);
      metrics.depth.push(Math.max(20, sc - 6));
      metrics.clarity.push(Math.min(95, sc + 2));
      metrics.completeness.push(Math.max(20, sc - 4));
    }
  });

  const getAvg = (arr) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

  return {
    relevance: getAvg(metrics.relevance),
    correctness: getAvg(metrics.correctness),
    depth: getAvg(metrics.depth),
    clarity: getAvg(metrics.clarity),
    completeness: getAvg(metrics.completeness),
    hasData: metrics.correctness.length > 0,
  };
}

/**
 * Calculates follow-up question statistics and insights.
 */
export function calculateFollowUpStats(history = []) {
  let followUpsGenerated = 0;
  let followUpsAnswered = 0;

  (history || []).forEach((item) => {
    if (item.result?.questionAnalysis && Array.isArray(item.result.questionAnalysis)) {
      item.result.questionAnalysis.forEach((q) => {
        if (q.followUpQuestion) {
          followUpsGenerated++;
          if (q.followUpAnswer && q.followUpAnswer.trim()) {
            followUpsAnswered++;
          }
        }
      });
    }
  });

  const responseRate =
    followUpsGenerated > 0 ? Math.round((followUpsAnswered / followUpsGenerated) * 100) : 100;

  let interpretation = '';
  if (followUpsGenerated === 0) {
    interpretation = 'Complete AI Voice sessions with follow-up questions to explore deeper technical discussions.';
  } else if (responseRate >= 80) {
    interpretation = 'Excellent engagement: You consistently address follow-up probes with substantive explanations.';
  } else {
    interpretation = 'Several responses required follow-up clarification. Try structuring initial answers with more detail and edge cases.';
  }

  return {
    followUpsGenerated,
    followUpsAnswered,
    responseRate,
    interpretation,
    hasData: followUpsGenerated > 0,
  };
}

/**
 * Calculates adaptive difficulty statistics (Promotions, Demotions, Maintained).
 */
export function calculateAdaptiveStats(history = []) {
  let promotions = 0;
  let demotions = 0;
  let maintained = 0;

  (history || []).forEach((item) => {
    if (item.result?.adaptiveHistory && Array.isArray(item.result.adaptiveHistory)) {
      item.result.adaptiveHistory.forEach((entry) => {
        if (entry.trend === 'promoted') promotions++;
        else if (entry.trend === 'demoted') demotions++;
        else maintained++;
      });
    }
  });

  // Estimate if detailed history not stored
  if (promotions === 0 && demotions === 0 && maintained === 0 && history.length > 0) {
    history.forEach((i) => {
      if ((i.score || 0) >= 80) promotions++;
      else if ((i.score || 0) < 60) demotions++;
      else maintained++;
    });
  }

  const latestDifficulty = history[0]?.difficulty || 'Medium';

  return {
    promotions,
    demotions,
    maintained,
    currentDifficulty: latestDifficulty,
    hasData: history.length > 0,
  };
}

/**
 * Calculates chronological performance trend.
 */
export function calculatePerformanceTrend(history = []) {
  if (!Array.isArray(history) || history.length === 0) return [];

  const validSessions = history
    .filter((item) => (item.attempted || 0) > 0 && item.status !== 'not_evaluated')
    .map((item, idx) => ({
      id: item.id || `int-${idx}`,
      date: item.date ? new Date(item.date) : new Date(Date.now() - idx * 86400000),
      role: item.role || 'Software Developer',
      difficulty: item.difficulty || 'Medium',
      score: Number(item.score) || 0,
      attempted: item.attempted || 0,
      totalQuestions: item.totalQuestions || 5,
    }))
    .sort((a, b) => a.date - b.date); // Chronological: oldest to newest

  return validSessions;
}

/**
 * Generates personalized narrative performance insights.
 */
export function generatePerformanceInsights(history = []) {
  const metrics = calculateOverallMetrics(history);
  if (!metrics.hasData) {
    return 'Complete your first interview to generate personalized AI performance insights.';
  }

  const skills = calculateSkillPerformance(history);
  const trend = calculatePerformanceTrend(history);

  const topSkill = skills[0]?.skill || 'Core Concepts';
  const weakSkill = skills[skills.length - 1]?.skill || 'System Optimization';

  let deltaText = '';
  if (trend.length >= 2) {
    const firstScore = trend[0].score;
    const latestScore = trend[trend.length - 1].score;
    const delta = latestScore - firstScore;
    if (delta > 0) {
      deltaText = `Across your sessions, your performance has improved by +${delta}% (from ${firstScore}% to ${latestScore}%).`;
    } else if (delta < 0) {
      deltaText = `Your recent scores averaged ${latestScore}%, demonstrating consistent practice across multiple difficulty levels.`;
    } else {
      deltaText = `Your performance has remained rock-solid at ${latestScore}%.`;
    }
  }

  return `Your strongest skill area is ${topSkill}, where you demonstrate clear conceptual mastery. Your primary area for technical elevation is ${weakSkill}. ${deltaText} Focus your next mock session on explaining practical trade-offs and edge-case handling.`;
}

/**
 * Generates personalized improvement recommendations.
 */
export function generateRecommendations(history = []) {
  const skills = calculateSkillPerformance(history);
  if (skills.length === 0) return [];

  const lowerSkills = skills.filter((s) => s.score < 75);
  const targetSkills = lowerSkills.length > 0 ? lowerSkills : skills.slice(-3);

  return targetSkills.slice(0, 4).map((s) => ({
    topic: s.skill,
    score: s.score,
    recommendation: `Deepen practical understanding in ${s.skill} by reviewing core implementation trade-offs and common interview scenarios.`,
  }));
}
