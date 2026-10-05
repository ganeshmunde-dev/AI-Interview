// src/components/interview/AiThinkingState.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineCheck } from 'react-icons/hi';

const THINKING_STEPS = [
  { id: 'relevance', label: 'Checking answer relevance & scope' },
  { id: 'depth', label: 'Analyzing technical depth & accuracy' },
  { id: 'reasoning', label: 'Evaluating reasoning & structure' },
  { id: 'followup', label: 'Determining optimal next question' },
];

export default function AiThinkingState({
  title = 'AI Interviewer is analyzing your response...',
  _role = 'frontend',
  isHR = false,
  className = '',
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = isHR
    ? [
        { id: 'communication', label: 'Evaluating communication clarity & tone' },
        { id: 'star', label: 'Checking situation handling (STAR framework)' },
        { id: 'teamwork', label: 'Assessing teamwork & leadership mindset' },
        { id: 'followup', label: 'Formulating adaptive interviewer feedback' },
      ]
    : THINKING_STEPS;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % steps.length);
    }, 900);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className={`glass-card p-5 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-2xl shadow-lg shadow-indigo-500/5 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        {/* Animated AI Brain Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <HiOutlineSparkles size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <span className="absolute -inset-1 rounded-xl border border-indigo-400/40 animate-ping opacity-30" />
        </div>

        <div>
          <h4 className="text-sm font-bold text-app-primary flex items-center gap-2">
            <span>🧠 AI Interviewer</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Evaluating
            </span>
          </h4>
          <p className="text-xs text-indigo-300 font-medium mt-0.5 flex items-center gap-1">
            <span>{title}</span>
            <span className="inline-flex gap-0.5 ml-1">
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </p>
        </div>
      </div>

      {/* Step checklist with active pulsing */}
      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-2.5 text-xs px-3 py-2 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-500/15 border border-indigo-500/30 text-app-primary font-medium'
                  : isDone
                  ? 'bg-muted-app/60 text-app-muted'
                  : 'text-app-muted/60 opacity-60'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                    <HiOutlineCheck size={11} />
                  </span>
                ) : isCurrent ? (
                  <span className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin inline-block" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-app-muted/30 inline-block" />
                )}
              </div>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
