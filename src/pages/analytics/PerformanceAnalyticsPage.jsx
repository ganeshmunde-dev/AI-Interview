// src/pages/analytics/PerformanceAnalyticsPage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiOutlineChartBar,
  HiOutlinePlay,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineRefresh,
} from 'react-icons/hi';
import {
  getStoredHistory,
  calculateOverallMetrics,
} from '@/utils/performanceAnalytics';
import { getScoreColor } from '@/utils/helpers';
import Button from '@/components/common/Button';

import SkillPerformanceChart from '@/components/analytics/SkillPerformanceChart';
import PerformanceTrendChart from '@/components/analytics/PerformanceTrendChart';
import RolePerformanceCard from '@/components/analytics/RolePerformanceCard';
import DifficultyPerformance from '@/components/analytics/DifficultyPerformance';
import AnswerQualityAnalysis from '@/components/analytics/AnswerQualityAnalysis';
import FollowUpAnalytics from '@/components/analytics/FollowUpAnalytics';
import AdaptiveAnalytics from '@/components/analytics/AdaptiveAnalytics';
import AIPerformanceInsights from '@/components/analytics/AIPerformanceInsights';
import ImprovementRecommendations from '@/components/analytics/ImprovementRecommendations';

export default function PerformanceAnalyticsPage() {
  const [history, setHistory] = useState(() => getStoredHistory());

  const metrics = useMemo(() => calculateOverallMetrics(history), [history]);

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
              Candidate Performance Analytics
            </h1>
            <span className="badge badge-primary text-xs uppercase font-semibold">
              Live Intelligence
            </span>
          </div>
          <p className="text-sm text-app-muted mt-1">
            Comprehensive skill breakdowns, historical trends, and targeted AI recommendations
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
            <span>Start Mock Interview</span>
          </Link>
        </div>
      </motion.div>

      {/* Feature 12: Empty State Protection */}
      {!metrics.hasData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center rounded-3xl border border-app max-w-lg mx-auto my-8 space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-3xl mx-auto">
            <HiOutlineChartBar />
          </div>
          <div>
            <h3 className="text-lg font-bold text-app-primary">No Interview Data Yet</h3>
            <p className="text-xs text-app-muted mt-1 max-w-sm mx-auto leading-relaxed">
              Your performance analytics, skill radar, and adaptive growth trends will appear here after you complete your first interview.
            </p>
          </div>
          <Link to="/interview/setup" className="btn-primary inline-flex items-center gap-2 mt-2">
            <HiOutlinePlay size={16} />
            <span>Start Your First Interview</span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Top Overall KPIs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Average Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(metrics.averageScore)}`}>
                {metrics.averageScore}%
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Across sessions</p>
            </div>

            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Best Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(metrics.bestScore)}`}>
                {metrics.bestScore}%
              </p>
              <p className="text-[10px] text-app-muted mt-0.5 flex items-center justify-center gap-1">
                <HiOutlineStar size={12} className="text-yellow-500" /> Peak performance
              </p>
            </div>

            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Interviews</p>
              <p className="text-2xl font-bold text-app-primary">
                {metrics.completedInterviews}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Completed</p>
            </div>

            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Questions</p>
              <p className="text-2xl font-bold text-app-primary">
                {metrics.totalQuestionsAttempted}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">
                of {metrics.totalQuestions} attempted
              </p>
            </div>

            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Avg Duration</p>
              <p className="text-2xl font-bold text-app-primary flex items-center justify-center gap-1">
                <HiOutlineClock size={16} className="text-app-muted" />
                {metrics.averageDuration}
              </p>
              <p className="text-[10px] text-app-muted mt-0.5">Per interview</p>
            </div>

            <div className="glass-card p-4 text-center rounded-2xl border border-app">
              <p className="text-[11px] text-app-muted font-medium mb-1">Completion</p>
              <p className="text-2xl font-bold text-green-400">
                {metrics.completionRate}%
              </p>
              <p className="text-[10px] text-app-muted mt-0.5 flex items-center justify-center gap-1">
                <HiOutlineCheckCircle size={12} className="text-green-500" /> Rate
              </p>
            </div>
          </div>

          {/* Feature 10: AI Performance Insights */}
          <AIPerformanceInsights history={history} />

          {/* Charts Row: Skill Breakdown & Performance Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkillPerformanceChart history={history} />
            <PerformanceTrendChart history={history} />
          </div>

          {/* Row 2: Role Performance & Difficulty Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RolePerformanceCard history={history} />
            <DifficultyPerformance history={history} />
          </div>

          {/* Row 3: Answer Quality & Follow-Up / Adaptive Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnswerQualityAnalysis history={history} />
            <div className="space-y-6">
              <FollowUpAnalytics history={history} />
              <AdaptiveAnalytics history={history} />
            </div>
          </div>

          {/* Feature 11: Targeted Improvement Plan */}
          <ImprovementRecommendations history={history} />
        </>
      )}
    </div>
  );
}
