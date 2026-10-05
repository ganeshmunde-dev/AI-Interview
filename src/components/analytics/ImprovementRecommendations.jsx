// src/components/analytics/ImprovementRecommendations.jsx
import { HiOutlineLightBulb, HiOutlineArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import { generateRecommendations } from '@/utils/performanceAnalytics';

export default function ImprovementRecommendations({ history = [], className = '' }) {
  const recommendations = generateRecommendations(history);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineLightBulb className="text-yellow-500" /> Targeted Improvement Plan
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Key focus areas based on your lowest historical skill scores
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recommendations.map((r, i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl bg-muted-app/60 border border-app flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="badge badge-primary text-[10px] font-bold uppercase">
                  {r.topic}
                </span>
                <span className="text-[11px] font-semibold text-red-400">
                  Avg: {r.score}%
                </span>
              </div>
              <p className="text-xs text-app-secondary leading-relaxed mt-1">
                {r.recommendation}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-app/60 flex justify-end">
              <Link
                to="/interview/setup"
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <span>Practice {r.topic}</span>
                <HiOutlineArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
