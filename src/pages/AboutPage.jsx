// src/pages/AboutPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';

const TEAM = [
  { name: 'Rahul Munde',    role: 'Founder & Full Stack Dev', emoji: '👨‍💻', bio: 'Java Full Stack enthusiast building AI-powered tools for developers.' },
  { name: 'AI Assistant',   role: 'Core AI Engine',           emoji: '🤖', bio: 'Powered by Google Gemini AI for intelligent question generation and evaluation.' },
];

const ROADMAP = [
  { phase: '1', title: 'React Frontend',     status: 'done',    desc: 'Complete UI with all pages, dark mode, animations' },
  { phase: '2', title: 'Spring Boot Backend',status: 'planned', desc: 'REST APIs, JWT auth, MySQL database integration' },
  { phase: '3', title: 'Gemini AI',          status: 'planned', desc: 'AI question generation, answer evaluation, scoring' },
  { phase: '4', title: 'Advanced Features',  status: 'planned', desc: 'Voice, camera, PDF reports, coding interview' },
];

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="section-container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 max-w-3xl mx-auto">
          <span className="badge badge-primary mb-4">About Us</span>
          <h1 className="text-4xl md:text-5xl font-bold text-app-primary mb-6">
            Built by Developers,<br /><span className="gradient-text">for Developers</span>
          </h1>
          <p className="text-app-secondary text-lg leading-relaxed">
            InterviewAI was born from a simple frustration — there was no affordable, 
            focused platform for Indian developers to practice Java and Full Stack interviews 
            with meaningful AI feedback. So we built one.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: '🎯', title: 'Our Mission',  desc: 'Democratize interview preparation for every developer in India, regardless of college or background.' },
            { icon: '🧠', title: 'Our Vision',   desc: 'Become the #1 AI interview platform for Java Full Stack developers across South Asia.' },
            { icon: '💡', title: 'Our Approach', desc: 'Combine AI intelligence with proven interview patterns from top product companies.' },
          ].map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card p-6 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-app-primary mb-2">{item.title}</h3>
              <p className="text-sm text-app-secondary leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-20">
          <h2 className="text-3xl font-bold text-app-primary text-center mb-10">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div key={member.name}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 text-center">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-app-primary">{member.name}</h3>
                <p className="text-xs text-indigo-500 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-app-secondary leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-app-primary text-center mb-10">Product Roadmap</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {ROADMAP.map((item, i) => (
              <motion.div key={item.phase}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 glass-card p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${item.status === 'done' ? 'bg-green-500/10 text-green-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                  {item.status === 'done' ? '✓' : item.phase}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-app-primary">Phase {item.phase}: {item.title}</h3>
                    <span className={`badge text-xs ${item.status === 'done' ? 'badge-success' : 'badge-primary'}`}>
                      {item.status === 'done' ? '✅ Current' : '🔜 Planned'}
                    </span>
                  </div>
                  <p className="text-sm text-app-secondary">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link to="/register" className="btn-primary text-base py-3 px-8">
            Join InterviewAI Free <HiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
