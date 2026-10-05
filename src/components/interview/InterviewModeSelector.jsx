// src/components/interview/InterviewModeSelector.jsx
import { motion } from 'framer-motion';
import { HiOutlineCheck, HiOutlineSparkles, HiOutlineMicrophone, HiOutlineVideoCamera, HiOutlinePencilAlt } from 'react-icons/hi';
import { INTERVIEW_MODE_OPTIONS, INTERVIEW_MODES } from '@/constants/appConstants';

export default function InterviewModeSelector({ selectedMode, onSelectMode, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {INTERVIEW_MODE_OPTIONS.map((modeOption) => {
        const isSelected = (selectedMode || INTERVIEW_MODES.AI) === modeOption.id;
        const isAiMode = modeOption.id === INTERVIEW_MODES.AI;

        return (
          <motion.div
            key={modeOption.id}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectMode(modeOption.id)}
            className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? isAiMode
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-blue-500 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                : 'border-app bg-card/60 hover:border-indigo-500/40 hover:bg-card text-app-secondary'
            }`}
          >
            {/* Top row: Icon + Badges + Selection indicator */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border ${
                      isSelected
                        ? isAiMode
                          ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/30'
                          : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                        : 'bg-muted-app border-app'
                    }`}
                  >
                    {modeOption.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-app-primary">
                        {modeOption.title}
                      </h3>
                      {modeOption.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? isAiMode
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-muted-app text-app-muted border-app'
                          }`}
                        >
                          {modeOption.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-app-muted mt-0.5">
                      {modeOption.tagline}
                    </p>
                  </div>
                </div>

                {/* Selection Checkmark */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? isAiMode
                        ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/50 ring-2 ring-indigo-500/20'
                        : 'bg-blue-500 text-white shadow-sm shadow-blue-500/50 ring-2 ring-blue-500/20'
                      : 'border-2 border-app bg-muted-app text-transparent'
                  }`}
                >
                  <HiOutlineCheck size={14} className={isSelected ? 'text-white' : 'text-transparent'} />
                </div>
              </div>

              {/* Bullet Features */}
              <div className="my-4 pt-4 border-t border-app/60 space-y-2.5">
                {modeOption.features.map((feature, idx) => {
                  let FeatureIcon = HiOutlineCheck;
                  if (feature.toLowerCase().includes('voice') || feature.toLowerCase().includes('speech')) {
                    FeatureIcon = HiOutlineMicrophone;
                  } else if (feature.toLowerCase().includes('webcam') || feature.toLowerCase().includes('camera')) {
                    FeatureIcon = HiOutlineVideoCamera;
                  } else if (feature.toLowerCase().includes('type') || feature.toLowerCase().includes('edit')) {
                    FeatureIcon = HiOutlinePencilAlt;
                  } else if (feature.toLowerCase().includes('ai')) {
                    FeatureIcon = HiOutlineSparkles;
                  }

                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span
                        className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? isAiMode
                              ? 'text-indigo-400 bg-indigo-500/10'
                              : 'text-blue-400 bg-blue-500/10'
                            : 'text-app-muted bg-muted-app'
                        }`}
                      >
                        <FeatureIcon size={11} />
                      </span>
                      <span
                        className={`${
                          isSelected ? 'text-app-primary font-medium' : 'text-app-secondary'
                        }`}
                      >
                        {feature}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="mt-4 pt-3 border-t border-app/50 flex items-center justify-between">
              <span className="text-[11px] text-app-muted">
                {isAiMode ? '🎙️ Recommended for realism' : '📝 Recommended for quiet environments'}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                  isSelected
                    ? isAiMode
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm shadow-indigo-500/30'
                      : 'bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/30'
                    : 'bg-muted-app border-app text-app-secondary group-hover:text-app-primary'
                }`}
              >
                {isSelected ? '✓ Selected' : modeOption.cta}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
