// src/components/coaching/AICoachingSummary.jsx
import { HiOutlineSparkles } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function AICoachingSummary({
  summary = '',
  source = 'AI',
  className = '',
}) {
  if (!summary) return null;

  return (
    <Card className={`border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0 mt-0.5">
          <HiOutlineSparkles size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-sm font-bold text-app-primary">
              AI Coach Executive Assessment
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {source === 'AI' ? 'Gemini AI' : 'Deterministic Coach'}
            </span>
          </div>
          <p className="text-xs text-app-secondary leading-relaxed bg-app-card/70 p-4 rounded-xl border border-app backdrop-blur-sm">
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}
