// src/pages/coaching/AIInterviewCoachingPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineAcademicCap,
  HiOutlinePlay,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { getStoredHistory, calculateOverallMetrics, calculateSkillPerformance } from '@/utils/performanceAnalytics';
import { fetchCoachingAnalysis } from '@/services/coachingService';
import { getScoreColor } from '@/utils/helpers';
import Button from '@/components/common/Button';

import AICoachingSummary from '@/components/coaching/AICoachingSummary';
import CoachingStrengths from '@/components/coaching/CoachingStrengths';
import CoachingWeaknesses from '@/components/coaching/CoachingWeaknesses';
import StudyRoadmap from '@/components/coaching/StudyRoadmap';
import PracticeQuestions from '@/components/coaching/PracticeQuestions';
import AnswerImprovementCoach from '@/components/coaching/AnswerImprovementCoach';
import CoachingProgress from '@/components/coaching/CoachingProgress';
import NextInterviewRecommendation from '@/components/coaching/NextInterviewRecommendation';
import AICoachChat from '@/components/coaching/AICoachChat';

export default function AIInterviewCoachingPage() {
  const [history, setHistory] = useState(() => getStoredHistory());
  const [coachingData, setCoachingData] = useState(null);
  const [_isLoading, setIsLoading] = useState(true);

  const metrics = useMemo(() => calculateOverallMetrics(history), [history]);
  const skillList = useMemo(() => calculateSkillPerformance(history), [history]);

  const topSkills = skillList.slice(0, 3).map((s) => s.skill);
  const weakSkills = skillList.slice(-3).reverse().map((s) => s.skill);
  const targetRole = history[0]?.role || 'Software Developer';

  useEffect(() => {
    let isMounted = true;
    if (!metrics.hasData) {
      setIsLoading(false);
      return;
    }

    async function loadCoaching() {
      setIsLoading(true);
      try {
        const data = await fetchCoachingAnalysis({
          role: targetRole,
          interviewType: history[0]?.type || 'technical',
          overallScore: metrics.averageScore,
          totalInterviews: metrics.completedInterviews,
          weakSkills,
          strongSkills: topSkills,
        });
        if (isMounted) {
          setCoachingData(data);
        }
      } catch (err) {
        console.warn('Error fetching coaching analysis:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCoaching();
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const handleRefresh = () => {
    setHistory(getStoredHistory());
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-app-primary">
              AI Interview Coach
            </h1>
            <span className="badge badge-primary text-xs uppercase font-semibold">
              Personalized Plan
            </span>
          </div>
          <p className="text-sm text-app-muted mt-1">
            Your personalized roadmap to becoming a stronger, senior-ready interview candidate.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={<HiOutlineRefresh size={15} />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Link to="/interview/setup" className="btn-primary flex items-center gap-1.5">
            <HiOutlinePlay size={16} />
            <span>Start Practice Interview</span>
          </Link>
        </div>
      </motion.div>

      {/* Feature 2: Empty State Check */}
      {!metrics.hasData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center rounded-3xl border border-app max-w-lg mx-auto my-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-3xl mx-auto">
            <HiOutlineAcademicCap />
          </div>
          <div>
            <h3 className="text-lg font-bold text-app-primary">No Coaching Data Yet</h3>
            <p className="text-xs text-app-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Complete at least one interview to unlock your personalized AI coaching roadmap, weaknesses analysis, and tailored practice probes.
            </p>
          </div>
          <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2 mt-2">
            <HiOutlinePlay size={16} />
            <span>Complete Your First Interview</span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Performance Overview Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card p-4 rounded-2xl border border-app text-center">
              <p className="text-[11px] text-app-muted font-medium mb-1">Overall Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(metrics.averageScore)}`}>
                {metrics.averageScore}%
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Average rating</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-app text-center">
              <p className="text-[11px] text-app-muted font-medium mb-1">Interviews</p>
              <p className="text-2xl font-bold text-app-primary">
                {metrics.completedInterviews}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Evaluated</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-app text-center">
              <p className="text-[11px] text-app-muted font-medium mb-1">Top Strength</p>
              <p className="text-sm font-bold text-green-400 truncate mt-1">
                {topSkills[0] || 'Core Concepts'}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Demonstrated mastery</p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-app text-center">
              <p className="text-[11px] text-app-muted font-medium mb-1">Primary Growth Area</p>
              <p className="text-sm font-bold text-amber-400 truncate mt-1">
                {weakSkills[0] || 'Technical Depth'}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">High-priority focus</p>
            </div>
          </div>

          {/* Feature 2: AI Coaching Summary */}
          {coachingData && (
            <AICoachingSummary
              summary={coachingData.executiveSummary}
              source={coachingData.source}
            />
          )}

          {/* Feature 3 & 4: Strengths & Weaknesses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CoachingStrengths strengths={coachingData?.strengths || []} />
            <CoachingWeaknesses weaknesses={coachingData?.weaknesses || []} />
          </div>

          {/* Feature 5: Personalized Study Roadmap */}
          <StudyRoadmap roadmap={coachingData?.studyRoadmap || []} />

          {/* Feature 6: Practice Questions */}
          <PracticeQuestions questions={coachingData?.practiceQuestions || []} />

          {/* Feature 7: Answer Architecture Coach */}
          <AnswerImprovementCoach history={history} />

          {/* Feature 9: Multi-Session Coaching Progress */}
          <CoachingProgress history={history} />

          {/* Feature 10: Next Interview Recommendation */}
          <NextInterviewRecommendation
            recommendation={coachingData?.nextInterviewRecommendation}
          />

          {/* Feature 8: Interactive AI Coach Chat */}
          <AICoachChat
            role={targetRole}
            overallScore={metrics.averageScore}
            weakSkills={weakSkills}
            strongSkills={topSkills}
          />
        </>
      )}
    </div>
  );
}
