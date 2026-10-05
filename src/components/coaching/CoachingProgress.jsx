// src/components/coaching/CoachingProgress.jsx
import { HiOutlineTrendingUp } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculatePerformanceTrend, calculateSkillPerformance } from '@/utils/performanceAnalytics';

export default function CoachingProgress({ history = [], className = '' }) {
  const trend = calculatePerformanceTrend(history);
  const skills = calculateSkillPerformance(history);

  if (trend.length < 2) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineTrendingUp className="text-green-400" /> Multi-Session Coaching Progress
          </h3>
        </div>
        <div className="py-6 text-center text-xs text-app-muted">
          Complete at least two interviews to track session-over-session score progression.
        </div>
      </Card>
    );
  }

  const firstScore = trend[0].score;
  const latestScore = trend[trend.length - 1].score;
  const diff = latestScore - firstScore;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineTrendingUp className="text-green-400" /> Multi-Session Progress Tracker
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Measured growth across chronological interview sessions
          </p>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
            diff >= 0
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          {diff >= 0 ? `+${diff}% Overall Gain` : `${diff}% Variance`}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div className="p-3 rounded-xl bg-muted-app/60 border border-app">
          <p className="text-[10px] text-app-muted uppercase font-semibold">Baseline</p>
          <p className="text-lg font-bold text-app-primary mt-0.5">{firstScore}%</p>
        </div>
        <div className="p-3 rounded-xl bg-muted-app/60 border border-app">
          <p className="text-[10px] text-app-muted uppercase font-semibold">Latest</p>
          <p className="text-lg font-bold text-indigo-400 mt-0.5">{latestScore}%</p>
        </div>
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-[10px] text-green-300 uppercase font-semibold">Growth</p>
          <p className="text-lg font-bold text-green-400 mt-0.5">
            {diff >= 0 ? `+${diff}%` : `${diff}%`}
          </p>
        </div>
      </div>

      {/* Top 3 Active Skills Progression */}
      <div className="space-y-2 pt-2 border-t border-app">
        <p className="text-xs font-semibold text-app-primary">Active Skill Proficiency</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {skills.slice(0, 3).map((s) => (
            <div
              key={s.skill}
              className="p-2.5 rounded-lg bg-app-card border border-app flex items-center justify-between text-xs"
            >
              <span className="text-app-secondary truncate">{s.skill}</span>
              <span className="font-bold text-green-400">{s.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
