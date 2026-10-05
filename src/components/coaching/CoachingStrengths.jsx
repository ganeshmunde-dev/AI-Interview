// src/components/coaching/CoachingStrengths.jsx
import { HiOutlineStar } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function CoachingStrengths({ strengths = [], className = '' }) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineStar className="text-yellow-500" /> Top Strengths & Mastery
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Key competitive advantages identified in your evaluations
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {strengths.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-bold text-app-primary">{item.skill}</h4>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                {item.score}%
              </span>
            </div>
            <p className="text-xs text-app-secondary leading-relaxed mt-1">
              {item.summary || 'Consistent conceptual accuracy and structured clarity.'}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
