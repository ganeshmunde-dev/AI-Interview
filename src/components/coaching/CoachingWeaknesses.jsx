// src/components/coaching/CoachingWeaknesses.jsx
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function CoachingWeaknesses({ weaknesses = [], className = '' }) {
  if (!weaknesses || weaknesses.length === 0) return null;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineExclamationCircle className="text-amber-500" /> Priority Improvement Areas
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Targeted skill gaps holding back higher interview ratings
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {weaknesses.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    item.priority === 'HIGH'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.priority || 'HIGH'} PRIORITY
                </span>
                <h4 className="text-xs font-bold text-app-primary">{item.skill}</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {item.score}%
              </span>
            </div>

            <div className="text-xs text-app-secondary space-y-1.5 mt-1">
              <p className="leading-relaxed">
                <strong className="text-app-primary font-semibold">Why: </strong>
                {item.why}
              </p>
              <p className="leading-relaxed text-indigo-300">
                <strong className="text-indigo-400 font-semibold">Action: </strong>
                {item.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
