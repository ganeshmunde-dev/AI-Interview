// src/components/analytics/AdaptiveAnalytics.jsx
import { HiOutlineTrendingUp } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateAdaptiveStats } from '@/utils/performanceAnalytics';

export default function AdaptiveAnalytics({ history = [], className = '' }) {
  const stats = calculateAdaptiveStats(history);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineTrendingUp className="text-indigo-400" /> Adaptive Progression
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Difficulty adjustments triggered by answer performance
          </p>
        </div>
        <span className="badge badge-primary text-xs">
          Current: {stats.currentDifficulty}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-[10px] text-green-300 font-semibold uppercase">📈 Promoted</p>
          <p className="text-xl font-bold text-green-400 mt-0.5">{stats.promotions}</p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-[10px] text-indigo-300 font-semibold uppercase">→ Maintained</p>
          <p className="text-xl font-bold text-indigo-400 mt-0.5">{stats.maintained}</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-[10px] text-amber-300 font-semibold uppercase">📉 Adjusted</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{stats.demotions}</p>
        </div>
      </div>

      <p className="text-xs text-app-muted text-center">
        The adaptive engine dynamically adjusts question difficulty based on accuracy and technical depth.
      </p>
    </Card>
  );
}
