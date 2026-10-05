// src/components/analytics/AnswerQualityAnalysis.jsx
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend,
} from 'chart.js';
import { HiOutlineSparkles } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateAnswerQuality } from '@/utils/performanceAnalytics';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function AnswerQualityAnalysis({ history = [], className = '' }) {
  const quality = calculateAnswerQuality(history);

  if (!quality.hasData) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineSparkles className="text-indigo-400" /> Answer Quality Metrics
          </h3>
        </div>
        <div className="py-6 text-center text-xs text-app-muted">
          Complete an interview to see your answer quality breakdown.
        </div>
      </Card>
    );
  }

  const radarData = {
    labels: ['Relevance', 'Correctness', 'Depth', 'Clarity', 'Completeness'],
    datasets: [
      {
        label: 'Candidate Average',
        data: [
          quality.relevance,
          quality.correctness,
          quality.depth,
          quality.clarity,
          quality.completeness,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
      },
      {
        label: 'Industry Benchmark',
        data: [75, 75, 70, 75, 70],
        backgroundColor: 'rgba(148, 163, 184, 0.08)',
        borderColor: 'rgba(148, 163, 184, 0.4)',
        pointBackgroundColor: 'rgba(148, 163, 184, 0.6)',
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 10 }, usePointStyle: true },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(148,163,184,0.15)' },
        pointLabels: { color: '#94a3b8', font: { size: 10 } },
        ticks: { display: false },
      },
    },
  };

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineSparkles className="text-indigo-400" /> Answer Quality Analysis
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Breakdown across fundamental AI evaluation pillars
          </p>
        </div>
      </div>

      <div style={{ height: 210 }}>
        <Radar data={radarData} options={radarOptions} />
      </div>

      <div className="grid grid-cols-5 gap-1.5 mt-3 pt-3 border-t border-app text-center">
        <div className="p-1.5 rounded-lg bg-muted-app/60">
          <p className="text-[10px] text-app-muted">Relevance</p>
          <p className="text-xs font-bold text-app-primary">{quality.relevance}%</p>
        </div>
        <div className="p-1.5 rounded-lg bg-muted-app/60">
          <p className="text-[10px] text-app-muted">Correctness</p>
          <p className="text-xs font-bold text-app-primary">{quality.correctness}%</p>
        </div>
        <div className="p-1.5 rounded-lg bg-muted-app/60">
          <p className="text-[10px] text-app-muted">Depth</p>
          <p className="text-xs font-bold text-app-primary">{quality.depth}%</p>
        </div>
        <div className="p-1.5 rounded-lg bg-muted-app/60">
          <p className="text-[10px] text-app-muted">Clarity</p>
          <p className="text-xs font-bold text-app-primary">{quality.clarity}%</p>
        </div>
        <div className="p-1.5 rounded-lg bg-muted-app/60">
          <p className="text-[10px] text-app-muted">Completeness</p>
          <p className="text-xs font-bold text-app-primary">{quality.completeness}%</p>
        </div>
      </div>
    </Card>
  );
}
