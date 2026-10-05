// src/components/analytics/DifficultyPerformance.jsx
import { HiOutlineLightningBolt } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateDifficultyPerformance } from '@/utils/performanceAnalytics';

export default function DifficultyPerformance({ history = [], className = '' }) {
  const diffData = calculateDifficultyPerformance(history);

  const tierColors = {
    Easy: {
      border: 'border-green-500/20',
      bg: 'bg-green-500/5',
      text: 'text-green-400',
      badge: 'bg-green-500/10 text-green-400',
      emoji: '🟢',
    },
    Medium: {
      border: 'border-yellow-500/20',
      bg: 'bg-yellow-500/5',
      text: 'text-yellow-400',
      badge: 'bg-yellow-500/10 text-yellow-400',
      emoji: '🟡',
    },
    Hard: {
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
      text: 'text-red-400',
      badge: 'bg-red-500/10 text-red-400',
      emoji: '🔴',
    },
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineLightningBolt className="text-yellow-500" /> Difficulty Performance
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Average scoring across interview complexity tiers
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {diffData.map((d) => {
          const style = tierColors[d.tier] || tierColors.Medium;
          return (
            <div
              key={d.tier}
              className={`p-4 rounded-xl border ${style.border} ${style.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-app-primary flex items-center gap-1.5">
                  <span>{style.emoji}</span>
                  <span>{d.tier}</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${style.badge}`}>
                  {d.count} Session{d.count === 1 ? '' : 's'}
                </span>
              </div>

              {d.hasData ? (
                <div>
                  <p className={`text-2xl font-bold ${style.text} my-1`}>
                    {d.averageScore}%
                  </p>
                  <p className="text-[11px] text-app-muted">
                    {d.questionsAttempted} Questions Attempted
                  </p>
                </div>
              ) : (
                <div className="py-2 text-[11px] text-app-muted italic">
                  No completed interviews at this difficulty.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
