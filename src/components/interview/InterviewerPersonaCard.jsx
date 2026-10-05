// src/components/interview/InterviewerPersonaCard.jsx
import { motion } from 'framer-motion';
import { INTERVIEWER_PERSONALITIES } from '@/constants/appConstants';
import { HiOutlineChatAlt, HiOutlineSparkles } from 'react-icons/hi';

function getContextualGuidance(personalityId = 'professional', role = 'frontend') {
  const p = (personalityId || 'professional').toLowerCase();
  const r = (role || 'frontend').toLowerCase();

  const isHR = r.includes('hr');
  const isReact = r.includes('react') || r.includes('frontend');
  const isJava = r.includes('java') || r.includes('spring') || r.includes('backend');

  switch (p) {
    case 'friendly':
      if (isHR) return 'Welcome! Stay relaxed and share the real experiences and teamwork moments that shaped your career.';
      if (isReact) return 'Welcome! Take a breath and walk me through your React thinking step by step. You’ve got this!';
      if (isJava) return 'Welcome! Focus on explaining your core design ideas—don’t stress over minor syntax details.';
      return 'Welcome! Stay relaxed and explain your thinking step by step.';

    case 'strict':
      if (isHR) return 'Provide direct, unembellished answers backed by tangible metrics and concrete situational evidence.';
      if (isReact) return 'Be precise. Expect scrutiny on rendering cycles, state mutation risks, and edge cases.';
      if (isJava) return 'Precision is key. Detail memory models, concurrency locks, and failure recovery mechanisms.';
      return 'Be precise and support your answers with clear reasoning.';

    case 'hr':
      if (isHR) return 'Answer naturally and use specific real-world examples using the STAR method where possible.';
      return 'Use the STAR method (Situation, Task, Action, Result) to highlight your collaboration and leadership.';

    case 'professional':
    default:
      if (isHR) return 'Welcome. Structure your thoughts methodically and highlight measurable organizational impacts.';
      if (isReact) return 'Welcome. Focus on explaining your component architecture, state management, and performance trade-offs.';
      if (isJava) return 'Welcome. Be thorough with data structures, thread safety, and modular system design.';
      return 'Welcome. Take your time and explain your reasoning clearly.';
  }
}

export default function InterviewerPersonaCard({
  personality = 'professional',
  role = 'frontend',
  className = '',
}) {
  const currentPersona = INTERVIEWER_PERSONALITIES.find(p => p.id === personality) || INTERVIEWER_PERSONALITIES[0];
  const guidance = getContextualGuidance(personality, role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`glass-card p-4 border border-app rounded-2xl ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar / Icon with active pulse */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner">
            {currentPersona.icon}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-app-card" />
        </div>

        {/* Persona Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="text-xs font-bold text-app-primary truncate flex items-center gap-1">
                <span>🤖 AI Interviewer</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 truncate">
                {currentPersona.label}
              </span>
            </div>
            <HiOutlineSparkles size={13} className="text-indigo-400 flex-shrink-0" />
          </div>

          <p className="text-[11px] text-app-muted mt-0.5 line-clamp-1">
            {currentPersona.description}
          </p>

          {/* Contextual Guidance Callout */}
          <div className="mt-2.5 p-2.5 rounded-xl bg-muted-app/80 border border-app flex items-start gap-2">
            <HiOutlineChatAlt size={14} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-app-secondary italic leading-snug">
              &ldquo;{guidance}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
