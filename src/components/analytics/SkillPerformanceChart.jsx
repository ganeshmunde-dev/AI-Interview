// src/components/analytics/SkillPerformanceChart.jsx
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from 'chart.js';
import { HiOutlineChartBar, HiOutlineFilter } from 'react-icons/hi';
import Card from '@/components/common/Card';
import { calculateSkillPerformance } from '@/utils/performanceAnalytics';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SkillPerformanceChart({ history = [], className = '' }) {
  const [selectedRole, setSelectedRole] = useState('all');

  const skillsData = calculateSkillPerformance(history, selectedRole);

  if (skillsData.length === 0) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineChartBar className="text-indigo-500" /> Skill-wise Performance
          </h3>
        </div>
        <div className="py-8 text-center text-xs text-app-muted">
          Complete an interview to see your skill proficiency breakdown.
        </div>
      </Card>
    );
  }

  const chartData = {
    labels: skillsData.map((s) => s.skill),
    datasets: [
      {
        label: 'Skill Proficiency (%)',
        data: skillsData.map((s) => s.score),
        backgroundColor: skillsData.map((s) =>
          s.score >= 80
            ? 'rgba(34, 197, 94, 0.75)'
            : s.score >= 65
            ? 'rgba(234, 179, 8, 0.75)'
            : 'rgba(239, 68, 68, 0.75)'
        ),
        borderRadius: 8,
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
          label: (context) => `Score: ${context.raw}%`,
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

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-app-primary flex items-center gap-2">
            <HiOutlineChartBar className="text-indigo-500" /> Skill-wise Performance
          </h3>
          <p className="text-xs text-app-muted mt-0.5">
            Role-specific skill ratings based on your answers
          </p>
        </div>

        {/* Role Filter Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <HiOutlineFilter size={13} className="text-app-muted" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input-field py-1 px-2.5 text-xs rounded-lg cursor-pointer bg-muted-app border-app text-app-primary"
          >
            <option value="all">All Roles</option>
            <option value="frontend">Frontend Developer</option>
            <option value="react_dev">React Developer</option>
            <option value="java_dev">Java Developer</option>
            <option value="spring_boot">Spring Boot</option>
            <option value="php">PHP Developer</option>
            <option value="fullstack">Java Full Stack</option>
            <option value="backend">Backend Developer</option>
            <option value="hr">HR Round</option>
          </select>
        </div>
      </div>

      <div style={{ height: 220 }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Quick Skill Tags */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-app">
        {skillsData.slice(0, 6).map((s) => (
          <div
            key={s.skill}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 ${
              s.score >= 80
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : s.score >= 65
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            <span className="truncate max-w-[120px]">{s.skill}</span>
            <span>{s.score}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
