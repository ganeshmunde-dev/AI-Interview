// src/components/analytics/FollowUpAnalytics.jsx
import { HiOutlineChatAlt2, HiOutlineSparkles } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateFollowUpStats } from '@/utils/performanceAnalytics';

export default function FollowUpAnalytics({ history = [], className = '' }) {
  const stats = calculateFollowUpStats(history);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineChatAlt2 className="text-purple-400" /> Follow-Up Probing Analytics
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Engagement with deeper adaptive AI questions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-center mb-4">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-[10px] text-purple-300 font-semibold uppercase">Follow-Ups</p>
          <p className="text-xl font-bold text-purple-300 mt-0.5">{stats.followUpsGenerated}</p>
        </div>

        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-[10px] text-indigo-300 font-semibold uppercase">Answered</p>
          <p className="text-xl font-bold text-indigo-300 mt-0.5">{stats.followUpsAnswered}</p>
        </div>

        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-[10px] text-green-300 font-semibold uppercase">Response Rate</p>
          <p className="text-xl font-bold text-green-400 mt-0.5">{stats.responseRate}%</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="p-3 rounded-xl bg-muted-app/60 border border-app text-xs flex items-start gap-2.5">
        <HiOutlineSparkles size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
        <p className="text-app-secondary leading-relaxed">
          {stats.interpretation}
        </p>
      </div>
    </Card>
  );
}
