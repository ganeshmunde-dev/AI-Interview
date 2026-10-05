// src/pages/HistoryPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineEye, HiOutlineTrash, HiOutlineChartBar } from 'react-icons/hi';
import { interviewHistory } from '@/data/history';
import { formatDate, getScoreColor, getScoreLabel } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

export default function HistoryPage() {
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('all');
  const [deleteId, setDeleteId]   = useState(null);
  const [viewItem, setViewItem]   = useState(null);
  const [history, setHistory]     = useState(() => {
    try {
      const saved = localStorage.getItem('interviewai_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return interviewHistory;
  });

  const filtered = history.filter(h => {
    const matchSearch = (h.role || '').toLowerCase().includes(search.toLowerCase())
      || (h.type || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all'
      || (filter === 'high' && (h.score || 0) >= 75)
      || (filter === 'low' && (h.score || 0) < 60);
    return matchSearch && matchFilter;
  });

  const handleDelete = () => {
    setHistory(prev => {
      const updated = prev.filter(i => i.id !== deleteId);
      try {
        localStorage.setItem('interviewai_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    setDeleteId(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-app-primary">Interview History</h1>
          <p className="text-sm text-app-muted">All your past mock interviews in one place</p>
        </div>
        <Link to="/analytics">
          <Button variant="outline" icon={<HiOutlineChartBar size={16} />}>
            Analyze Performance
          </Button>
        </Link>
      </motion.div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by role or type..."
            className="input-field pl-10" />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'high', label: 'Good (75%+)' },
            { id: 'low', label: 'Needs Work' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${filter === f.id
                  ? 'bg-indigo-500 text-white'
                  : 'border border-app text-app-secondary hover:border-indigo-500/40'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',       value: history.length },
          { label: 'Avg Score',   value: `${Math.round(history.reduce((a,h) => a+h.score, 0) / history.length)}%` },
          { label: 'Best Score',  value: `${Math.max(...history.map(h => h.score))}%` },
          { label: 'This Month',  value: history.filter(h => new Date(h.date) > new Date(Date.now() - 30*86400000)).length },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-app-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Interview cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-app-muted">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-medium">No interviews found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Score badge */}
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-bold
                ${item.score >= 85 ? 'bg-green-500/10' : item.score >= 65 ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                <span className={`text-lg ${getScoreColor(item.score)}`}>{item.score}</span>
                <span className="text-xs text-app-muted">%</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-app-primary">{item.role}</h3>
                  <span className="badge badge-primary text-xs">{item.type}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${item.difficulty === 'Easy' ? 'bg-green-500/10 text-green-500'
                    : item.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500'
                    : 'bg-red-500/10 text-red-500'}`}>
                    {item.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-app-muted">
                  <span>📅 {formatDate(item.date)}</span>
                  <span>⏱️ {item.duration}</span>
                  <span>❓ {item.attempted}/{item.totalQuestions} questions</span>
                  <span className={getScoreColor(item.score)}>{getScoreLabel(item.score)}</span>
                </div>
                {item.strongTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.strongTopics.map(t => (
                      <span key={t} className="badge badge-success text-xs">{t}</span>
                    ))}
                    {item.weakTopics.map(t => (
                      <span key={t} className="badge badge-danger text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setViewItem(item)}
                  title="View Details"
                  className="p-2 rounded-lg border border-app text-app-secondary hover:text-indigo-500 hover:border-indigo-500/40 transition-colors cursor-pointer"
                >
                  <HiOutlineEye size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  title="Delete Record"
                  className="p-2 rounded-lg border border-app text-app-secondary hover:text-red-500 hover:border-red-500/40 transition-colors cursor-pointer"
                >
                  <HiOutlineTrash size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Interview" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>}>
        <p className="text-app-secondary text-sm">
          Are you sure you want to delete this interview record? This action cannot be undone.
        </p>
      </Modal>

      {/* View item details modal */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem ? `${viewItem.role} (${viewItem.type})` : 'Interview Summary'}
        size="md"
        footer={<Button variant="primary" onClick={() => setViewItem(null)}>Close</Button>}
      >
        {viewItem && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-app-card border border-app">
              <div>
                <p className="text-xs text-app-muted">Overall Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(viewItem.score || 0)}`}>
                  {viewItem.attempted === 0 ? '0% (Not Evaluated)' : `${viewItem.score}%`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-app-muted">Questions Attempted</p>
                <p className="font-semibold text-app-primary">{viewItem.attempted || 0} / {viewItem.totalQuestions || 5}</p>
              </div>
            </div>

            {viewItem.result?.aiSummary && (
              <div>
                <h4 className="font-semibold text-app-primary text-xs uppercase tracking-wider mb-1">AI Performance Summary</h4>
                <p className="text-app-secondary text-xs leading-relaxed p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                  {viewItem.result.aiSummary}
                </p>
              </div>
            )}

            {viewItem.result?.skillScores && viewItem.result.skillScores.length > 0 && (
              <div>
                <h4 className="font-semibold text-app-primary text-xs uppercase tracking-wider mb-2">Skill Performance</h4>
                <div className="grid grid-cols-2 gap-2">
                  {viewItem.result.skillScores.map((s) => (
                    <div key={s.skill} className="p-2 rounded-lg bg-muted-app flex justify-between text-xs">
                      <span className="text-app-secondary truncate">{s.skill}</span>
                      <span className="font-bold text-app-primary">{s.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
