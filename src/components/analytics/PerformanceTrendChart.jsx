// src/components/analytics/PerformanceTrendChart.jsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { HiOutlineTrendingUp, HiOutlineInformationCircle } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculatePerformanceTrend } from '@/utils/performanceAnalytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function PerformanceTrendChart({ history = [], className = '' }) {
  const trendData = calculatePerformanceTrend(history);

  if (trendData.length < 2) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineTrendingUp className="text-indigo-500" /> Performance Trend
          </h3>
        </div>
        <div className="py-10 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <HiOutlineInformationCircle size={20} />
          </div>
          <p className="text-xs text-app-muted">
            Complete another interview to see your performance trend.
          </p>
        </div>
      </Card>
    );
  }

  const labels = trendData.map((item, idx) => {
    const d = item.date;
    return d instanceof Date && !isNaN(d)
      ? `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} (Q${idx + 1})`
      : `Int #${idx + 1}`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Overall Score',
        data: trendData.map((item) => item.score),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const item = trendData[context.dataIndex];
            return item ? `Role: ${item.role}\nDifficulty: ${item.difficulty}` : '';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(148,163,184,0.1)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
    },
  };

  // Calculate score delta
  const firstScore = trendData[0].score;
  const latestScore = trendData[trendData.length - 1].score;
  const delta = latestScore - firstScore;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineTrendingUp className="text-indigo-500" /> Performance Trend
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Historical score progression across mock sessions
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
            delta > 0
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : delta < 0
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}
        >
          {delta > 0 ? `+${delta}% Growth` : delta < 0 ? `${delta}%` : 'Consistent'}
        </span>
      </div>

      <div style={{ height: 220 }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
}
