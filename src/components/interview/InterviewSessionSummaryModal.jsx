// src/components/interview/InterviewSessionSummaryModal.jsx
import { motion } from 'framer-motion';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineArrowRight,
} from 'react-icons/hi';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

export default function InterviewSessionSummaryModal({
  isOpen = false,
  role = 'Frontend Developer',
  totalQuestions = 5,
  attemptedQuestions = 5,
  followUpsCount = 0,
  difficulty = 'Medium',
  mode = 'AI Interview',
  duration = '12:30',
  _status = 'Completed',
  onProceed,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Non-dismissible without explicit proceed button
      title="Interview Session Completed"
      size="md"
      footer={
        <Button
          variant="primary"
          icon={<HiOutlineArrowRight size={16} />}
          onClick={onProceed}
          className="w-full justify-center"
        >
          Proceed to Detailed Evaluation & Results
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Celebration Header */}
        <div className="text-center py-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center text-green-400 text-3xl mb-3 shadow-sm"
          >
            <HiOutlineCheckCircle />
          </motion.div>
          <h3 className="text-lg font-bold text-app-primary">
            Great Job! Session Completed
          </h3>
          <p className="text-xs text-app-muted mt-1 max-w-sm mx-auto">
            Your responses have been recorded and sent for AI comprehensive evaluation.
          </p>
        </div>

        {/* Real Session Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Role Evaluated</p>
            <p className="font-bold text-app-primary truncate">{role}</p>
          </div>

          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Questions Attempted</p>
            <p className="font-bold text-app-primary">
              {attemptedQuestions} / {totalQuestions}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Follow-Ups Explored</p>
            <p className="font-bold text-indigo-400 flex items-center gap-1">
              <HiOutlineSparkles size={13} />
              {followUpsCount} Question{followUpsCount === 1 ? '' : 's'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Session Duration</p>
            <p className="font-bold text-app-primary flex items-center gap-1">
              <HiOutlineClock size={13} className="text-app-muted" />
              {duration}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Interview Mode</p>
            <p className="font-bold text-app-primary capitalize">{mode}</p>
          </div>

          <div className="p-3 rounded-xl bg-app-card border border-app">
            <p className="text-app-muted text-[11px] mb-0.5">Difficulty Level</p>
            <p className="font-bold text-app-primary capitalize">{difficulty}</p>
          </div>
        </div>

        {/* Informative Note */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2.5">
          <HiOutlineSparkles size={18} className="flex-shrink-0 text-indigo-400" />
          <span>
            Click below to review your role-specific scores, AI feedback, model ideal answers, and study action plan.
          </span>
        </div>
      </div>
    </Modal>
  );
}
