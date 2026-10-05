// src/components/analytics/RolePerformanceCard.jsx
import { HiOutlineBriefcase, HiOutlineStar } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateRolePerformance } from '@/utils/performanceAnalytics';

export default function RolePerformanceCard({ history = [], className = '' }) {
  const roleMetrics = calculateRolePerformance(history);

  if (roleMetrics.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineBriefcase className="text-indigo-500" /> Role Performance
          </h3>
        </div>
        <div className="py-6 text-center text-xs text-app-muted">
          No attempted roles recorded yet. Complete an interview to see role-wise metrics.
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineBriefcase className="text-indigo-500" /> Role-wise Performance
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Average and peak scores across attempted positions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {roleMetrics.map((r) => (
          <div
            key={r.role}
            className="p-3.5 rounded-xl bg-muted-app/60 border border-app hover:border-indigo-500/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-xs font-bold text-app-primary">{r.role}</h4>
                <p className="text-[11px] text-app-muted mt-0.5">
                  {r.interviewsCount} Session{r.interviewsCount === 1 ? '' : 's'} · {r.questionsAttempted} Qs
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
                  r.averageScore >= 80
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : r.averageScore >= 65
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {r.averageScore}%
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-app-secondary pt-2 border-t border-app/60">
              <span className="flex items-center gap-1 text-app-muted">
                <HiOutlineStar size={12} className="text-yellow-500" /> Peak: {r.bestScore}%
              </span>
              <span className="text-[10px] text-app-muted">
                Avg: {r.averageScore >= 80 ? 'Proficient' : r.averageScore >= 65 ? 'Adequate' : 'Needs Practice'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
