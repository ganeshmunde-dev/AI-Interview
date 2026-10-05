// src/pages/dashboard/DashboardPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import {
  HiOutlinePlay, HiOutlineTrendingUp, HiOutlineFire,
  HiOutlineClipboardList, HiOutlineStar, HiOutlineChartBar,
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import { interviewHistory, activityData } from '@/data/history';
import { getScoreColor, getScoreLabel, timeAgo } from '@/utils/helpers';
import { getStoredHistory, calculateOverallMetrics, calculateSkillPerformance } from '@/utils/performanceAnalytics';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="stat-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-app-primary">{value}</p>
        <p className="text-xs text-app-secondary font-medium">{label}</p>
        {sub && <p className="text-xs text-app-muted mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Activity Chart ───────────────────────────────────────────────────────────
function ActivityChart() {
  const chartData = {
    labels: activityData.labels,
    datasets: [{
      label: 'Score',
      data: activityData.scores,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
    },
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-app-primary">Weekly Score Trend</h3>
          <p className="text-xs text-app-muted">Your scores over the last 7 days</p>
        </div>
        <span className="badge badge-primary">This Week</span>
      </div>
      <div style={{ height: 200 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}

// ── Topic Distribution Chart ─────────────────────────────────────────────────
function TopicChart() {
  const chartData = {
    labels: ['JavaScript', 'React', 'REST APIs', 'SQL / Databases', 'System Design'],
    datasets: [{
      data: [90, 85, 78, 65, 50],
      backgroundColor: ['#6366f1','#8b5cf6','#22c55e','#eab308','#ef4444'],
      borderWidth: 0,
    }],
  };

  const options = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 11 }, padding: 12, usePointStyle: true } } },
    cutout: '65%',
  };

  return (
    <Card>
      <h3 className="font-semibold text-app-primary mb-6">Topic Mastery</h3>
      <div style={{ height: 180 }}>
        <Doughnut data={chartData} options={options} />
      </div>
    </Card>
  );
}

// ── Recent History ───────────────────────────────────────────────────────────
function RecentHistory() {
  const recent = interviewHistory.slice(0, 4);
  return (
    <Card className="col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-app-primary">Recent Interviews</h3>
        <Link to="/history" className="text-xs text-indigo-500 hover:text-indigo-400 font-medium">View all →</Link>
      </div>
      <div className="space-y-3">
        {recent.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted-app transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 text-lg flex-shrink-0">
              💼
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-app-primary truncate">{item.role}</p>
              <p className="text-xs text-app-muted">{item.type} · {item.difficulty} · {timeAgo(item.date)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-sm font-bold ${getScoreColor(item.score)}`}>{item.score}%</p>
              <p className="text-xs text-app-muted">{getScoreLabel(item.score)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Quick Start ──────────────────────────────────────────────────────────────
function QuickStart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="col-span-full rounded-2xl p-8 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 0%, transparent 60%)' }} />
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">Ready for Your Next Interview?</h3>
        <p className="text-white/80 text-sm mb-6">Start a new mock interview and track your improvement</p>
        <Link to="/interview/setup">
          <Button variant="ghost" size="lg"
            className="!bg-white !text-indigo-600 hover:!bg-indigo-50 !shadow-none">
            <HiOutlinePlay /> Start Interview
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const history = getStoredHistory();
  const analyticsMetrics = calculateOverallMetrics(history);
  const skillList = calculateSkillPerformance(history);
  const topSkill = skillList[0]?.skill || 'JavaScript';
  const weakSkill = skillList[skillList.length - 1]?.skill || 'System Design';

  const stats = [
    { label: 'Total Interviews',  value: analyticsMetrics.completedInterviews || user?.stats?.totalInterviews || 24, icon: <HiOutlineClipboardList size={22} className="text-indigo-500" />, color: 'bg-indigo-500/10', sub: 'All time', delay: 0.05 },
    { label: 'Average Score',     value: `${analyticsMetrics.averageScore || user?.stats?.avgScore || 72}%`,   icon: <HiOutlineTrendingUp size={22} className="text-green-500" />,   color: 'bg-green-500/10',  sub: '↑ 4% this week',  delay: 0.1 },
    { label: 'Best Score',        value: `${analyticsMetrics.bestScore || user?.stats?.bestScore || 94}%`,  icon: <HiOutlineStar size={22} className="text-yellow-500" />,        color: 'bg-yellow-500/10', sub: 'Peak performance', delay: 0.15 },
    { label: 'Current Streak',    value: `${user?.stats?.streak ?? 5} days`,  icon: <HiOutlineFire size={22} className="text-orange-500" />,         color: 'bg-orange-500/10', sub: 'Keep it up!',     delay: 0.2 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-app-primary">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-app-secondary text-sm mt-1">Here&apos;s your interview performance overview</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Feature 13: Candidate Performance Intelligence Summary Card */}
      <Card className="border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary text-xs uppercase font-semibold">
                Live Intelligence
              </span>
              <h3 className="font-bold text-app-primary text-base">Candidate Performance Overview</h3>
            </div>
            <p className="text-xs text-app-secondary">
              Average Score: <strong className="text-indigo-400">{analyticsMetrics.averageScore}%</strong> · Strongest Skill: <strong className="text-green-400">{topSkill}</strong> · Needs Work: <strong className="text-amber-400">{weakSkill}</strong>
            </p>
          </div>
          <Link to="/analytics">
            <Button variant="outline" icon={<HiOutlineChartBar size={16} />}>
              View Full Analytics
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quick start banner */}
      <div className="grid grid-cols-1">
        <QuickStart />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart />
        <TopicChart />
      </div>

      {/* Recent interviews + Weak topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentHistory />

        {/* Weak topics */}
        <Card>
          <h3 className="font-semibold text-app-primary mb-4">⚡ Focus Areas</h3>
          <div className="space-y-3">
            {[
              { topic: 'Concurrency', pct: 50, color: 'bg-red-500' },
              { topic: 'Design Patterns', pct: 65, color: 'bg-yellow-500' },
              { topic: 'Java 8 Features', pct: 72, color: 'bg-orange-500' },
            ].map(item => (
              <div key={item.topic}>
                <div className="flex justify-between text-xs text-app-secondary mb-1">
                  <span>{item.topic}</span><span>{item.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted-app overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <Link to="/interview/setup" className="text-xs text-indigo-500 hover:text-indigo-400 font-medium">
            Practice weak topics →
          </Link>
        </Card>
      </div>
    </div>
  );
}

