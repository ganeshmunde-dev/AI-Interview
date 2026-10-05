// src/components/interview/InterviewTimeline.jsx
import {
  HiOutlineCheck,
  HiOutlineSparkles,
  HiOutlineClock,
} from 'react-icons/hi';

export default function InterviewTimeline({
  questions = [],
  currentIndex = 0,
  answers = {},
  _evaluations = {},
  followUps = {},
  interviewPhase = 'listening',
  onSelectQuestion,
  className = '',
}) {
  const isIntroPhase = interviewPhase === 'intro' || interviewPhase === 'introSpeaking';

  return (
    <div className={`glass-card p-4 border border-app rounded-2xl ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h4 className="text-xs font-bold text-app-primary flex items-center gap-1.5">
          <HiOutlineClock size={14} className="text-indigo-400" />
          <span>Session Timeline</span>
        </h4>
        <span className="text-[10px] text-app-muted font-medium">
          {currentIndex + 1} / {questions.length || 5} Questions
        </span>
      </div>

      {/* Horizontal or compact vertical stepper */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {/* Intro Step */}
        <div
          className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-colors ${
            isIntroPhase
              ? 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold'
              : 'text-app-muted bg-muted-app/40'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              isIntroPhase
                ? 'bg-indigo-500 text-white animate-pulse'
                : 'bg-green-500/20 text-green-400'
            }`}
          >
            {isIntroPhase ? '●' : <HiOutlineCheck size={11} />}
          </div>
          <span className="truncate">Introduction & Overview</span>
        </div>

        {/* Questions Steps */}
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex && !isIntroPhase;
          const isPast = idx < currentIndex;
          const hasAnswer = Boolean(answers[q.id]?.trim());
          const hasFollowUp = Boolean(followUps[q.id]?.generated);

          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => onSelectQuestion?.(idx)}
              className={`w-full text-left flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-indigo-500/15 border border-indigo-500/30 shadow-sm text-app-primary font-semibold'
                  : isPast
                  ? 'bg-muted-app/60 text-app-secondary hover:bg-muted-app'
                  : 'text-app-muted opacity-70 hover:opacity-100 hover:bg-muted-app/40'
              }`}
            >
              {/* Status Circle */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                  isCurrent
                    ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/50 ring-2 ring-indigo-400/30'
                    : hasAnswer
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : isPast
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-muted-app text-app-muted border border-app'
                }`}
              >
                {hasAnswer ? <HiOutlineCheck size={11} /> : idx + 1}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate font-medium">
                    Q{idx + 1}: {q.skill || q.category || 'Question'}
                  </span>
                  {hasFollowUp && (
                    <span
                      title="Follow-Up Answered"
                      className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-0.5 flex-shrink-0"
                    >
                      <HiOutlineSparkles size={9} />
                      FU
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-app-muted">
                  {isCurrent ? (
                    <span className="text-indigo-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                      {interviewPhase === 'evaluating'
                        ? 'Evaluating response...'
                        : interviewPhase === 'followup'
                        ? 'Follow-up active'
                        : interviewPhase === 'asking'
                        ? 'AI asking...'
                        : 'In progress'}
                    </span>
                  ) : hasAnswer ? (
                    <span className="text-green-500 font-medium">Answer recorded</span>
                  ) : isPast ? (
                    <span className="text-yellow-500 font-medium">Skipped</span>
                  ) : (
                    <span>Upcoming</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
