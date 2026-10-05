// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineUpload, HiOutlinePlus, HiOutlineCheck } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import { formatDate, getInitials } from '@/utils/helpers';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    role: user?.role || '',
    experience: user?.experience || '',
  });

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-app-primary">My Profile</h1>
        <p className="text-sm text-app-muted">Manage your personal information and achievements</p>
      </motion.div>

      {/* Profile header */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white border-2 border-app">
              <HiOutlinePencil size={14} />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field text-sm" placeholder="Full name" />
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="input-field text-sm" placeholder="Current role" />
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  className="input-field text-sm" placeholder="Location" />
                <input value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                  className="input-field text-sm" placeholder="Experience" />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-app-primary">{user?.name}</h2>
                <p className="text-app-secondary text-sm mb-1">{user?.role}</p>
                <div className="flex flex-wrap gap-3 text-xs text-app-muted">
                  <span>📍 {user?.location}</span>
                  <span>📞 {user?.phone}</span>
                  <span>🗓️ Joined {formatDate(user?.joined)}</span>
                  <span>💼 {user?.experience}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex-shrink-0">
            {editing ? (
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                <Button size="sm" icon={<HiOutlineCheck size={14} />} onClick={handleSave}>Save</Button>
              </div>
            ) : (
              <Button variant="secondary" size="sm" icon={<HiOutlinePencil size={14} />} onClick={() => setEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="mt-4">
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              className="input-field resize-none text-sm" rows={3} placeholder="Bio" />
          </div>
        ) : (
          <p className="mt-4 text-sm text-app-secondary leading-relaxed">{user?.bio}</p>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Interviews',  value: user?.stats?.totalInterviews },
          { label: 'Avg Score',   value: `${user?.stats?.avgScore}%` },
          { label: 'Best Score',  value: `${user?.stats?.bestScore}%` },
          { label: 'Day Streak',  value: user?.stats?.streak },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-app-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {user?.skills?.map(skill => (
            <span key={skill} className="badge badge-primary">{skill}</span>
          ))}
          <button className="flex items-center gap-1 px-3 py-1 rounded-full text-xs border border-dashed border-app text-app-muted hover:border-indigo-500 hover:text-indigo-500 transition-colors">
            <HiOutlinePlus size={12} /> Add Skill
          </button>
        </div>
      </Card>

      {/* Education */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-4">Education</h3>
        {user?.education?.map(edu => (
          <div key={edu.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted-app">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg flex-shrink-0">🎓</div>
            <div>
              <h4 className="font-semibold text-app-primary text-sm">{edu.degree}</h4>
              <p className="text-xs text-app-secondary">{edu.institute}</p>
              <p className="text-xs text-app-muted">{edu.year} · {edu.grade}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-app-primary mb-4">Certifications</h3>
          <div className="space-y-3">
            {user?.certifications?.map(cert => (
              <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted-app">
                <div className="text-2xl">🏅</div>
                <div>
                  <p className="text-sm font-medium text-app-primary">{cert.name}</p>
                  <p className="text-xs text-app-muted">{cert.issuer} · {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-app-primary mb-4">Achievements</h3>
          <div className="space-y-3">
            {user?.achievements?.map(ach => (
              <div key={ach.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted-app">
                <div className="text-xl">{ach.title.split(' ')[0]}</div>
                <div>
                  <p className="text-sm font-medium text-app-primary">{ach.title.slice(2)}</p>
                  <p className="text-xs text-app-muted">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Resume upload */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-4">Resume</h3>
        <div className="border-2 border-dashed border-app rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors cursor-pointer group">
          <HiOutlineUpload size={32} className="mx-auto text-app-muted group-hover:text-indigo-500 transition-colors mb-3" />
          <p className="text-sm text-app-secondary">Drag & drop your resume here</p>
          <p className="text-xs text-app-muted mb-4">PDF, DOCX up to 5MB</p>
          <Button variant="secondary" size="sm">Browse Files</Button>
        </div>
        <p className="text-xs text-app-muted mt-3 text-center">Resume analysis with AI will be available in Phase 4</p>
      </Card>
    </div>
  );
}
