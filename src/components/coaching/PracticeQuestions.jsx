// src/components/coaching/PracticeQuestions.jsx
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function PracticeQuestions({ questions = [], className = '' }) {
  if (!questions || questions.length === 0) return null;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineQuestionMarkCircle className="text-purple-400" /> AI-Recommended Practice Probes
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            High-impact mock questions targeting your specific weakness areas
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="badge badge-primary text-[10px] font-bold uppercase">
                {q.topic}
              </span>
              <span className="text-[10px] text-app-muted">Practice Probe #{idx + 1}</span>
            </div>

            <p className="text-sm font-semibold text-app-primary leading-relaxed">
              “{q.question}”
            </p>

            <div className="p-2.5 rounded-lg bg-app-card/80 border border-app text-xs text-app-secondary">
              <span className="text-purple-400 font-semibold">What Interviewers Expect: </span>
              {q.focus}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
