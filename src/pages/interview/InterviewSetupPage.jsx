// src/pages/interview/InterviewSetupPage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineCheck } from 'react-icons/hi';
import {
  INTERVIEW_MODES, INTERVIEW_MODE_OPTIONS,
  INTERVIEW_ROLES, DIFFICULTY_LEVELS, INTERVIEW_TYPES, QUESTION_COUNTS,
  INTERVIEWER_PERSONALITIES,
} from '@/constants/appConstants';
import { useInterview } from '@/context/InterviewContext';
import { unlockAudio } from '@/services/elevenLabsService';
import InterviewModeSelector from '@/components/interview/InterviewModeSelector';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

function SectionTitle({ step, title, desc }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {step}
      </div>
      <div>
        <h3 className="font-semibold text-app-primary">{title}</h3>
        {desc && <p className="text-xs text-app-muted">{desc}</p>}
      </div>
    </div>
  );
}

function SelectGrid({ items, selected, onSelect, getKey, renderItem }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {items.map(item => {
        const key = getKey(item);
        const active = selected === key;
        return (
          <motion.button key={key} whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(key)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all text-sm font-medium
              ${active
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                : 'border-app bg-card text-app-secondary hover:border-indigo-500/40 hover:text-app-primary'}`}>
            {active && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                <HiOutlineCheck className="text-white" size={10} />
              </span>
            )}
            {renderItem(item)}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function InterviewSetupPage() {
  const { config, setConfig, start } = useInterview();
  const navigate = useNavigate();

  const selectedMode = config.mode || INTERVIEW_MODES.AI;

  const handleStart = async () => {
    console.log('[AI-VOICE-DEBUG] Start button clicked');
    console.log('[AI-VOICE-DEBUG] Selected mode:', selectedMode);
    console.log('[AI-VOICE-DEBUG] Interview ID:', config?.id || 'new');
    console.log('[AI-VOICE-DEBUG] Questions count:', config?.count);
    console.log('[AI-VOICE-DEBUG] Calling unlockAudio()');
    await unlockAudio();
    console.log('[AI-VOICE-DEBUG] unlockAudio() completed');
    start();
    toast.success('Interview started! Good luck 🎯');
    console.log('[AI-VOICE-DEBUG] Navigating to InterviewScreen');
    navigate('/interview/screen');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-app-primary">Configure Your Interview</h1>
        <p className="text-app-secondary text-sm mt-1">Customize the interview to match your target role and goals</p>
      </motion.div>

      <div className="space-y-8">
        {/* Step 1 – Interview Mode */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
          className="glass-card p-6">
          <SectionTitle
            step="1"
            title="Choose Interview Mode"
            desc="Select how you want to conduct your mock interview"
          />
          <InterviewModeSelector
            selectedMode={selectedMode}
            onSelectMode={(mode) => setConfig({ mode })}
          />
        </motion.div>

        {/* Step 2 – Role */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="glass-card p-6">
          <SectionTitle step="2" title="Select Role" desc="Choose the role you are preparing for" />
          <SelectGrid
            items={INTERVIEW_ROLES} selected={config.role} onSelect={r => setConfig({ role: r })}
            getKey={i => i.id}
            renderItem={i => (
              <><div className="text-2xl mb-2">{i.icon}</div><div className="text-xs leading-tight">{i.label}</div></>
            )} />
        </motion.div>

        {/* Step 3 – Difficulty */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}
          className="glass-card p-6">
          <SectionTitle step="3" title="Difficulty Level" desc="Pick the difficulty that matches your experience" />
          <div className="grid grid-cols-3 gap-4">
            {DIFFICULTY_LEVELS.map(d => (
              <motion.button key={d.id} whileTap={{ scale: 0.97 }}
                onClick={() => setConfig({ difficulty: d.id })}
                className={`p-5 rounded-xl border-2 transition-all text-center
                  ${config.difficulty === d.id
                    ? `border-current ${d.color} bg-current/10`
                    : 'border-app bg-card text-app-secondary hover:border-current/40'} ${d.color}`}>
                <div className="text-2xl mb-2">{d.id === 'easy' ? '😊' : d.id === 'medium' ? '🤔' : '🔥'}</div>
                <div className="font-semibold">{d.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Step 4 – Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="glass-card p-6">
          <SectionTitle step="4" title="Interview Type" />
          <SelectGrid
            items={INTERVIEW_TYPES} selected={config.type} onSelect={t => setConfig({ type: t })}
            getKey={i => i.id}
            renderItem={i => (
              <><div className="text-xl mb-1">{i.icon}</div><div className="text-xs">{i.label}</div></>
            )} />
        </motion.div>

        {/* Step 5 – Personality */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card p-6">
          <SectionTitle step="5" title="AI Interviewer Personality" desc="Choose how your AI interviewer behaves and communicates" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {INTERVIEWER_PERSONALITIES.map(p => {
              const active = (config.personality || 'professional') === p.id;
              return (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setConfig({ personality: p.id })}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                    active
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-sm'
                      : 'border-app bg-card text-app-secondary hover:border-indigo-500/40 hover:text-app-primary'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-muted-app flex-shrink-0">
                    {p.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-semibold text-sm text-app-primary">
                        {p.label}
                      </div>
                      {active && (
                        <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                          <HiOutlineCheck className="text-white" size={10} />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-app-muted mt-1 leading-snug">
                      {p.description}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Step 6 – Question Count */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="glass-card p-6">
          <SectionTitle step="6" title="Number of Questions" />
          <div className="flex gap-4">
            {QUESTION_COUNTS.map(n => (
              <motion.button key={n} whileTap={{ scale: 0.97 }}
                onClick={() => setConfig({ count: n })}
                className={`flex-1 py-4 rounded-xl border-2 font-bold text-lg transition-all
                  ${config.count === n
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500'
                    : 'border-app bg-card text-app-secondary hover:border-indigo-500/40'}`}>
                {n}
                <div className="text-xs font-normal text-app-muted mt-1">questions</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Summary + Start */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          className="glass-card p-6">
          <h3 className="font-semibold text-app-primary mb-4">📋 Interview Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {[
              {
                label: 'Mode',
                value: INTERVIEW_MODE_OPTIONS.find(m => m.id === selectedMode)?.title || 'AI Interview',
              },
              { label: 'Role',        value: INTERVIEW_ROLES.find(r => r.id === config.role)?.label },
              { label: 'Difficulty',  value: DIFFICULTY_LEVELS.find(d => d.id === config.difficulty)?.label },
              { label: 'Type',        value: INTERVIEW_TYPES.find(t => t.id === config.type)?.label },
              { label: 'Personality', value: INTERVIEWER_PERSONALITIES.find(p => p.id === (config.personality || 'professional'))?.label },
              { label: 'Questions',   value: config.count },
            ].map(s => (
              <div key={s.label} className="bg-muted-app rounded-xl p-3">
                <p className="text-[11px] text-app-muted mb-1">{s.label}</p>
                <p className="font-semibold text-xs text-app-primary truncate">{s.value}</p>
              </div>
            ))}
          </div>
          <Button fullWidth size="lg" icon={<HiOutlinePlay />} onClick={handleStart}>
            Start Interview Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
