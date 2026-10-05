// src/pages/interview/ResultsPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement,
  Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import {
  HiOutlineDownload, HiOutlineRefresh, HiOutlineTrendingUp,
  HiOutlineExclamation, HiOutlineLightBulb, HiOutlineCheck,
  HiOutlineSparkles, HiOutlineChevronDown, HiOutlineChevronUp,
  HiOutlineChatAlt2, HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { useInterview } from '@/context/InterviewContext';
import { generateRoleResults } from '@/data/results';
import { getScoreColor, getScoreLabel } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function ScoreCircle({ score, attempted }) {
  const isZero = attempted === 0;
  const color = isZero ? '#94a3b8' : score >= 85 ? '#22c55e' : score >= 65 ? '#eab308' : '#ef4444';
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
        <motion.circle
          cx="60" cy="60" r="50" fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 50}`}
          initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
          animate={{ strokeDashoffset: isZero ? 2 * Math.PI * 50 : 2 * Math.PI * 50 * (1 - score / 100) }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color }}>{isZero ? '0%' : `${score}%`}</span>
        <span className="text-xs text-app-muted">{isZero ? 'Not Evaluated' : 'Overall'}</span>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { result, config, questions, answers, evaluations, followUpAnswers, reset } = useInterview();
  const navigate = useNavigate();
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Use result from context if available, otherwise generate role-specific results
  const data = (result && result.skillScores)
    ? result
    : generateRoleResults(config, questions, answers, null, evaluations || {}, followUpAnswers || {});

  const toggleQuestionExpand = (qId) => {
    setExpandedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleDownloadPDF = () => {
    const isZero = data.attempted === 0;

    let questionAnalysisText = '';
    if (data.questionAnalysis && data.questionAnalysis.length > 0) {
      questionAnalysisText = `
----------------------------------------------------
DETAILED QUESTION-BY-QUESTION ANALYSIS
----------------------------------------------------
${data.questionAnalysis
  .map(
    (q, idx) => `
[Question ${idx + 1}] (${q.skill}) - Score: ${q.score}% [${q.rating || 'Evaluated'}]
Question: "${q.question}"
Candidate Answer: "${q.primaryAnswer || 'N/A'}"
${q.followUpQuestion ? `AI Follow-Up: "${q.followUpQuestion}"\nFollow-Up Answer: "${q.followUpAnswer || 'N/A'}"\n` : ''}Metrics: Relevance ${q.relevance}% | Correctness ${q.correctness}% | Depth ${q.depth}% | Clarity ${q.clarity}%
Feedback: ${q.feedback || 'N/A'}
${q.idealAnswer ? `Ideal Answer: "${q.idealAnswer}"\n` : ''}`
  )
  .join('\n')}`;
    }

    const reportText = `
====================================================
           INTERVIEWAI - OFFICIAL REPORT           
====================================================
Role:             ${data.role}
Difficulty:       ${data.difficulty}
Type:             ${data.type}
Status:           ${data.evaluationStatus || (isZero ? 'Not Evaluated' : 'Completed')}
Overall Score:    ${isZero ? '0% (Not Evaluated)' : `${data.overallScore}% (${getScoreLabel(data.overallScore)})`}
Questions:        ${data.attempted} / ${data.totalQuestions} Attempted
Date:             ${new Date(data.date).toLocaleDateString()}

----------------------------------------------------
AI PERFORMANCE SUMMARY
----------------------------------------------------
${data.aiSummary || data.feedbackSummary || 'N/A'}

----------------------------------------------------
SKILL SCORE BREAKDOWN (${data.role})
----------------------------------------------------
${data.skillScores.map((s) => `${s.skill.padEnd(25)} : ${s.score}%`).join('\n')}

${
  !isZero && data.strengths && data.strengths.length > 0
    ? `----------------------------------------------------
KEY STRENGTHS
----------------------------------------------------
${data.strengths.map((s) => `• ${s}`).join('\n')}
`
    : ''
}
${
  !isZero && data.weaknesses && data.weaknesses.length > 0
    ? `----------------------------------------------------
AREAS TO IMPROVE
----------------------------------------------------
${data.weaknesses.map((w) => `• ${w}`).join('\n')}
`
    : ''
}
${
  !isZero && data.recommendations && data.recommendations.length > 0
    ? `----------------------------------------------------
RECOMMENDED ACTION PLAN
----------------------------------------------------
${data.recommendations.map((r) => `• [${r.topic}] ${r.resource}`).join('\n')}
`
    : ''
}
${questionAnalysisText}
====================================================
           Generated by InterviewAI Platform        
====================================================
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `InterviewAI_${data.role.replace(/\s+/g, '_')}_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Interview Report Downloaded!');
  };

  const isZero = data.attempted === 0;

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } } },
    scales: {
      r: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(148,163,184,0.15)' },
        pointLabels: { color: '#94a3b8', font: { size: 11 } },
        ticks: { display: false },
      },
    },
  };

  const barData = {
    labels: data.skillScores.map((s) => s.skill),
    datasets: [
      {
        label: 'Score',
        data: data.skillScores.map((s) => s.score),
        backgroundColor: data.skillScores.map((s) =>
          isZero
            ? 'rgba(148,163,184,0.3)'
            : s.score >= 85
            ? 'rgba(34,197,94,0.7)'
            : s.score >= 65
            ? 'rgba(234,179,8,0.7)'
            : 'rgba(239,68,68,0.7)'
        ),
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    },
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-app-primary">Interview Results</h1>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                data.evaluationStatus === 'Not Evaluated'
                  ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                  : data.evaluationStatus === 'Partially Evaluated'
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  : 'bg-green-500/10 text-green-500 border border-green-500/30'
              }`}
            >
              {data.evaluationStatus || (isZero ? 'Not Evaluated' : 'Completed')}
            </span>
          </div>
          <p className="text-sm text-app-muted mt-1">
            {data.role} · {data.difficulty} · {data.type}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<HiOutlineDownload size={16} />} onClick={handleDownloadPDF}>
            Download Report
          </Button>
          <Button
            variant="outline"
            icon={<HiOutlineRefresh size={16} />}
            onClick={() => {
              reset();
              navigate('/interview/setup');
            }}
          >
            Start Interview Again
          </Button>
        </div>
      </motion.div>

      {/* FEATURE 3: Zero Answer Protection Banner */}
      {isZero && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-sm flex items-start gap-3 shadow-sm"
        >
          <HiOutlineExclamation size={22} className="flex-shrink-0 mt-0.5 text-yellow-400" />
          <div>
            <h3 className="font-semibold text-sm text-yellow-300">No Questions Answered</h3>
            <p className="text-xs text-yellow-400/90 mt-1 leading-relaxed">
              No questions were answered, so the interview could not be evaluated. All skill scores are set to 0%. Please complete an interview session by providing answers to receive personalized AI evaluation and study recommendations.
            </p>
          </div>
        </motion.div>
      )}

      {/* Score overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 text-center"
        >
          <ScoreCircle score={data.overallScore} attempted={data.attempted} />
          <p
            className={`font-bold text-lg mt-4 ${
              isZero ? 'text-yellow-500' : getScoreColor(data.overallScore)
            }`}
          >
            {isZero ? 'Not Evaluated' : getScoreLabel(data.overallScore)}
          </p>
          <p className="text-xs text-app-muted mt-1">
            {data.attempted} / {data.totalQuestions} Questions Attempted
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 col-span-1 md:col-span-2"
        >
          <h3 className="font-semibold text-app-primary mb-4">
            {data.role} Skill Breakdown
          </h3>
          <div style={{ height: 180 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </motion.div>
      </div>

      {/* FEATURE 14: AI Performance Summary */}
      {!isZero && data.aiSummary && (
        <Card>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
              <HiOutlineSparkles size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-app-primary text-sm">AI Interviewer Performance Summary</h3>
              <p className="text-xs text-app-secondary mt-1.5 leading-relaxed bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                {data.aiSummary}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Radar + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-app-primary mb-4">Performance Radar</h3>
          <div style={{ height: 220 }}>
            <Radar data={data.radarData} options={radarOptions} />
          </div>
        </Card>

        <div className="space-y-4">
          {/* Strengths */}
          <Card>
            <h3 className="font-semibold text-green-500 flex items-center gap-2 mb-3">
              <HiOutlineTrendingUp /> Key Strengths
            </h3>
            {isZero || !data.strengths || data.strengths.length === 0 ? (
              <p className="text-xs text-app-muted italic">No strengths evaluated (zero answers submitted).</p>
            ) : (
              <ul className="space-y-2">
                {data.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-app-secondary">
                    <HiOutlineCheck className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Weaknesses */}
          <Card>
            <h3 className="font-semibold text-red-500 flex items-center gap-2 mb-3">
              <HiOutlineExclamation /> Areas to Improve
            </h3>
            {isZero || !data.weaknesses || data.weaknesses.length === 0 ? (
              <p className="text-xs text-app-muted italic">No weaknesses evaluated (zero answers submitted).</p>
            ) : (
              <ul className="space-y-2">
                {data.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-app-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {!isZero && data.recommendations && data.recommendations.length > 0 && (
        <Card>
          <h3 className="font-semibold text-app-primary flex items-center gap-2 mb-4">
            <HiOutlineLightBulb className="text-yellow-500" /> AI Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recommendations.map((r, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgb(var(--bg-muted))' }}>
                <span className="badge badge-primary mb-2">{r.topic}</span>
                <p className="text-sm text-app-secondary leading-relaxed">{r.resource}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* FEATURE 11 & 12: Question-by-Question Analysis & Ideal Answers */}
      {!isZero && data.questionAnalysis && data.questionAnalysis.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HiOutlineChatAlt2 size={20} className="text-indigo-400" />
            <h3 className="font-bold text-app-primary text-base">Question-by-Question Analysis</h3>
          </div>

          <div className="space-y-3">
            {data.questionAnalysis.map((item, idx) => {
              const isExpanded = expandedQuestions[item.questionId];
              return (
                <Card key={item.questionId || idx} className="border border-app">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        Q{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="badge badge-primary text-[10px] uppercase font-semibold">
                            {item.skill || item.category}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              item.score >= 80
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : item.score >= 60
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            Score: {item.score}% · {item.rating || (item.score >= 80 ? 'Strong' : 'Adequate')}
                          </span>
                        </div>
                        <h4 className="font-medium text-app-primary text-sm leading-relaxed">
                          {item.question}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleQuestionExpand(item.questionId)}
                      className="p-1.5 rounded-lg hover:bg-muted-app text-app-muted hover:text-app-primary transition-colors cursor-pointer flex-shrink-0"
                      title={isExpanded ? 'Collapse Analysis' : 'Expand Analysis'}
                    >
                      {isExpanded ? <HiOutlineChevronUp size={18} /> : <HiOutlineChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Collapsible Answer & AI Feedback Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-app space-y-3.5 text-xs overflow-hidden"
                      >
                        {/* Primary Answer */}
                        <div>
                          <p className="text-app-muted font-semibold mb-1">Your Answer:</p>
                          <p className="p-3 rounded-xl bg-app-card border border-app text-app-secondary leading-relaxed">
                            {item.primaryAnswer || 'No response recorded.'}
                          </p>
                        </div>

                        {/* Follow-Up details if recorded */}
                        {item.followUpQuestion && (
                          <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-2">
                            <p className="text-indigo-300 font-semibold flex items-center gap-1">
                              <HiOutlineQuestionMarkCircle size={14} /> AI Follow-Up Question:
                            </p>
                            <p className="text-app-primary italic font-medium">"{item.followUpQuestion}"</p>
                            <p className="text-app-muted font-semibold mt-2">Your Follow-Up Answer:</p>
                            <p className="text-app-secondary">{item.followUpAnswer || 'No follow-up response.'}</p>
                          </div>
                        )}

                        {/* AI Feedback */}
                        <div>
                          <p className="text-app-muted font-semibold mb-1">AI Evaluator Feedback:</p>
                          <p className="text-app-primary leading-relaxed">{item.feedback}</p>
                        </div>

                        {/* Metrics Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                          <div className="p-2 rounded-lg bg-muted-app text-center">
                            <p className="text-[10px] text-app-muted">Relevance</p>
                            <p className="font-bold text-app-primary text-xs">{item.relevance ?? item.score}%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted-app text-center">
                            <p className="text-[10px] text-app-muted">Correctness</p>
                            <p className="font-bold text-app-primary text-xs">{item.correctness ?? item.score}%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted-app text-center">
                            <p className="text-[10px] text-app-muted">Depth</p>
                            <p className="font-bold text-app-primary text-xs">{item.depth ?? Math.max(20, item.score - 5)}%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-muted-app text-center">
                            <p className="text-[10px] text-app-muted">Clarity</p>
                            <p className="font-bold text-app-primary text-xs">{item.clarity ?? item.score}%</p>
                          </div>
                        </div>

                        {/* Ideal Answer Section */}
                        {item.idealAnswer && (
                          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 space-y-1">
                            <p className="font-semibold text-xs flex items-center gap-1 text-green-300">
                              <HiOutlineCheck size={14} /> Ideal Model Answer:
                            </p>
                            <p className="text-xs text-green-200/90 leading-relaxed font-sans">
                              {item.idealAnswer}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Link to="/history" className="btn-secondary">View All History</Link>
        <Link to="/interview/setup" className="btn-primary" onClick={reset}>Start New Interview</Link>
      </div>
    </div>
  );
}
