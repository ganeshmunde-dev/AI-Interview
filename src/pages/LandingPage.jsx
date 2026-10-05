// src/pages/LandingPage.jsx
// Hero + Features + HowItWorks + Testimonials + Stats + FAQ + CTA
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineArrowRight, HiOutlineCheck, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import { FaStar } from 'react-icons/fa';
import { testimonials, landingStats, faqs } from '@/data/testimonials';
import { getInitials } from '@/utils/helpers';

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

// ── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      {/* Background gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

      <div className="section-container relative z-10 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 badge badge-primary mb-6 text-sm py-1.5 px-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            AI-Powered Mock Interviews
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-app-primary">
            Ace Every Interview<br />
            <span className="gradient-text">with AI Feedback</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={fadeUp}
            className="text-lg md:text-xl text-app-secondary mb-10 max-w-2xl mx-auto">
            Practice Java, React, Spring Boot & HR interviews with intelligent AI scoring, 
            real-time feedback, and skill analysis — completely free.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-base py-3 px-8">
              Start Free Practice <HiOutlineArrowRight />
            </Link>
            <Link to="/about" className="btn-secondary text-base py-3 px-8">
              <HiOutlinePlay /> Watch Demo
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {landingStats.map(s => (
              <motion.div key={s.label} variants={fadeUp}
                className="glass-card p-4 text-center">
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-xs text-app-secondary">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🤖', title: 'AI Question Generation', desc: 'Role-specific questions generated and scored by AI for Java, React, Spring Boot and HR rounds.' },
  { icon: '📊', title: 'Skill-wise Analysis', desc: 'Get detailed score breakdowns per topic. Know exactly what to improve.' },
  { icon: '⏱️', title: 'Timed Interviews', desc: 'Each question has a real timer to simulate actual interview pressure.' },
  { icon: '🎯', title: '2500+ Question Bank', desc: 'Easy, Medium, Hard questions covering all major Java Full Stack topics.' },
  { icon: '📈', title: 'Progress Tracking', desc: 'Track your scores over time with beautiful charts and activity timelines.' },
  { icon: '🏆', title: 'AI Recommendations', desc: 'Get personalized study recommendations based on your weak topics.' },
];

function Features() {
  return (
    <section id="features" className="py-24" style={{ background: 'rgb(var(--bg-surface))' }}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <span className="badge badge-primary mb-3">Features</span>
          <h2 className="text-4xl font-bold text-app-primary mb-4">Everything You Need to Succeed</h2>
          <p className="text-app-secondary max-w-xl mx-auto">
            A complete mock interview platform built to get you job-ready faster.
          </p>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <motion.div key={f.title} variants={fadeUp}
              whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
              className="glass-card p-6 group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-app-primary mb-2">{f.title}</h3>
              <p className="text-sm text-app-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────────
const STEPS = [
  { num: '01', title: 'Create Account', desc: 'Sign up free in under 30 seconds. No credit card required.' },
  { num: '02', title: 'Choose Your Role', desc: 'Select your target role, difficulty level and interview type.' },
  { num: '03', title: 'Start Interview', desc: 'Answer timed questions in a real interview simulation environment.' },
  { num: '04', title: 'Get AI Feedback', desc: 'Receive detailed scores, strengths, weaknesses and study recommendations.' },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <span className="badge badge-primary mb-3">How It Works</span>
          <h2 className="text-4xl font-bold text-app-primary mb-4">Get Started in 4 Simple Steps</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on lg */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-500/20 via-indigo-500/50 to-violet-500/20" />

          {STEPS.map((s, i) => (
            <motion.div key={s.num}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                {s.num}
              </div>
              <h3 className="font-semibold text-app-primary mb-2">{s.title}</h3>
              <p className="text-sm text-app-secondary">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-24" style={{ background: 'rgb(var(--bg-surface))' }}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16">
          <span className="badge badge-primary mb-3">Testimonials</span>
          <h2 className="text-4xl font-bold text-app-primary mb-4">Loved by Developers Across India</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FaStar key={j} className="text-yellow-400" size={14} />
                ))}
              </div>
              <p className="text-app-secondary text-sm leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-app-primary">{t.name}</p>
                  <p className="text-xs text-app-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-24">
      <div className="section-container max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-16">
          <span className="badge badge-primary mb-3">FAQ</span>
          <h2 className="text-4xl font-bold text-app-primary mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map(f => (
            <motion.div key={f.id}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card overflow-hidden">
              <button className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpen(open === f.id ? null : f.id)}>
                <span className="font-medium text-app-primary">{f.question}</span>
                {open === f.id
                  ? <HiOutlineChevronUp className="text-indigo-500 flex-shrink-0" />
                  : <HiOutlineChevronDown className="text-app-muted flex-shrink-0" />}
              </button>
              {open === f.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 pb-5 text-sm text-app-secondary leading-relaxed border-t border-app pt-4">
                  {f.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24" style={{ background: 'rgb(var(--bg-surface))' }}>
      <div className="section-container text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-16"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 50%, #9333ea 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ developers already using InterviewAI. Start for free today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/register"
                className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors inline-flex items-center gap-2">
                Get Started Free <HiOutlineArrowRight />
              </Link>
              <Link to="/pricing"
                className="border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
                View Pricing
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-white/70 text-sm">
              {['No credit card required', 'Free forever plan', '5-min setup'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <HiOutlineCheck /> {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
