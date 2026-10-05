// src/components/coaching/AnswerImprovementCoach.jsx
import { HiOutlineAcademicCap, HiOutlineCheck, HiOutlineX, HiOutlineLightBulb } from 'react-icons/hi';
import Card from '@/components/common/Card';

export default function AnswerImprovementCoach({ history = [], className = '' }) {
  // Extract a question from history that had an evaluation
  const evaluatedSession = (history || []).find(
    (item) => item.result?.questionAnalysis && item.result.questionAnalysis.length > 0 && item.attempted > 0
  );

  const sampleQ = evaluatedSession?.result?.questionAnalysis?.[0];

  if (!sampleQ) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineAcademicCap className="text-indigo-400" /> Answer Architecture Coach
          </h3>
        </div>
        <div className="py-6 text-center text-xs text-app-muted">
          Complete an AI evaluation session to unlock line-by-line answer improvement coaching.
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineAcademicCap className="text-indigo-400" /> Answer Architecture Coach
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Real sample evaluation deconstructed for senior-level structure
          </p>
        </div>
        <span className="badge badge-primary text-xs">
          {sampleQ.skill || 'Sample Question'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Question & Candidate's Original Answer */}
        <div className="p-3.5 rounded-xl bg-muted-app/60 border border-app space-y-2">
          <p className="text-xs font-bold text-app-primary">
            Question: “{sampleQ.question}”
          </p>
          <div className="text-xs text-app-secondary bg-app-card/80 p-3 rounded-lg border border-app">
            <span className="text-[10px] uppercase font-bold text-app-muted block mb-1">Your Submitted Answer:</span>
            {sampleQ.candidateAnswer || 'Answer provided in session.'}
          </div>
        </div>

        {/* Evaluation Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-green-500/5 border border-green-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-green-400 mb-2">
              <HiOutlineCheck size={16} />
              <span>What You Did Well</span>
            </div>
            <ul className="space-y-1 text-app-secondary">
              {(sampleQ.strengths && sampleQ.strengths.length > 0) ? (
                sampleQ.strengths.map((s, i) => <li key={i}>• {s}</li>)
              ) : (
                <li>• Clear direct answer to the core question.</li>
              )}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-2">
              <HiOutlineX size={16} />
              <span>What Was Missing</span>
            </div>
            <ul className="space-y-1 text-app-secondary">
              {(sampleQ.weaknesses && sampleQ.weaknesses.length > 0) ? (
                sampleQ.weaknesses.map((w, i) => <li key={i}>• {w}</li>)
              ) : (
                <li>• Explaining implementation trade-offs and edge cases.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Better Answer Structure Framework */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
          <div className="flex items-center gap-2 font-bold text-indigo-400 text-xs mb-3">
            <HiOutlineLightBulb size={18} />
            <span>Recommended 5-Step Senior Answer Structure</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] text-center">
            <div className="p-2 rounded-lg bg-app-card border border-app">
              <strong className="text-indigo-400 block mb-0.5">1. Direct Definition</strong>
              <span className="text-app-muted text-[10px]">Concise 1-sentence answer</span>
            </div>
            <div className="p-2 rounded-lg bg-app-card border border-app">
              <strong className="text-indigo-400 block mb-0.5">2. Internal Mechanics</strong>
              <span className="text-app-muted text-[10px]">How it works under the hood</span>
            </div>
            <div className="p-2 rounded-lg bg-app-card border border-app">
              <strong className="text-indigo-400 block mb-0.5">3. Production Example</strong>
              <span className="text-app-muted text-[10px]">Real-world use case</span>
            </div>
            <div className="p-2 rounded-lg bg-app-card border border-app">
              <strong className="text-indigo-400 block mb-0.5">4. Trade-Offs & Edges</strong>
              <span className="text-app-muted text-[10px]">Failure modes & complexity</span>
            </div>
            <div className="p-2 rounded-lg bg-app-card border border-app">
              <strong className="text-indigo-400 block mb-0.5">5. Concise Wrap-Up</strong>
              <span className="text-app-muted text-[10px]">Closing impact</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
