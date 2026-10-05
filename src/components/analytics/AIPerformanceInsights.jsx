// src/components/analytics/AIPerformanceInsights.jsx
import { HiOutlineSparkles } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { generatePerformanceInsights } from '@/utils/performanceAnalytics';

export default function AIPerformanceInsights({ history = [], className = '' }) {
  const insight = generatePerformanceInsights(history);

  return (
    <Card className={`border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0 mt-0.5">
          <HiOutlineSparkles size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-sm font-bold text-app-primary">
              AI Interview Intelligence Summary
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Personalized
            </span>
          </div>
          <p className="text-xs text-app-secondary leading-relaxed bg-app-card/70 p-3.5 rounded-xl border border-app backdrop-blur-sm">
            {insight}
          </p>
        </div>
      </div>
    </Card>
  );
}
