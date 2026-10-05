// src/components/coaching/NextInterviewRecommendation.jsx
import { Link } from 'react-router-dom';
import { HiOutlinePlay } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function NextInterviewRecommendation({
  recommendation = null,
  className = '',
}) {
  if (!recommendation) return null;

  return (
    <Card className={`border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-primary text-[10px] font-bold uppercase">
              Recommended Next Practice
            </span>
            <span className="text-xs text-app-muted font-medium">Adaptive Coach Match</span>
          </div>

          <div>
            <h3 className="text-base font-bold text-app-primary">
              {recommendation.role || 'Software Developer'} · {recommendation.difficulty || 'Medium'} Difficulty
            </h3>
            <p className="text-xs text-app-secondary mt-1 max-w-xl leading-relaxed">
              {recommendation.rationale || 'Targeting your highest-impact growth areas will accelerate readiness for real technical interviews.'}
            </p>
          </div>

          {recommendation.focusTopics && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-app-muted font-medium">Focus Topics:</span>
              {recommendation.focusTopics.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <Link
            to="/interview/setup"
            className="btn-primary inline-flex items-center gap-2 shadow-md shadow-indigo-500/20"
          >
            <HiOutlinePlay size={16} />
            <span>Launch Mock Interview</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
