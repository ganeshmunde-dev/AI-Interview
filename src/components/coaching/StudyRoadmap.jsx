// src/components/coaching/StudyRoadmap.jsx
import { HiOutlineCalendar } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function StudyRoadmap({ roadmap = [], className = '' }) {
  if (!roadmap || roadmap.length === 0) return null;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineCalendar className="text-indigo-400" /> Personalized 3-Week Study Roadmap
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Structured week-by-week curriculum targeting your exact skill deficits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roadmap.map((stage, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-muted-app/60 border border-app hover:border-indigo-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="badge badge-primary text-[10px] font-bold uppercase">
                  {stage.week}
                </span>
                <span className="text-[10px] text-app-muted font-medium">Phase {idx + 1}</span>
              </div>
              <h4 className="text-xs font-bold text-app-primary mb-2">
                {stage.phase}
              </h4>

              <div className="space-y-1.5 mb-3">
                {stage.topics && stage.topics.map((t, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-1.5 text-xs text-app-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span className="truncate">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-app/60 text-[11px] text-indigo-300">
              <strong className="text-app-primary block mb-0.5">Goal:</strong>
              {stage.goal}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
