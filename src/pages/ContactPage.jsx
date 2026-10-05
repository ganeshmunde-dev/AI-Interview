// src/pages/ContactPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLocationMarker, HiOutlineClock, HiOutlineCheck } from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

const INFO = [
  { icon: <HiOutlineMail size={20} />,           label: 'Email',    value: 'support@interviewai.dev' },
  { icon: <HiOutlineLocationMarker size={20} />, label: 'Location', value: 'Pune, Maharashtra, India' },
  { icon: <HiOutlineClock size={20} />,          label: 'Response', value: 'Within 24 hours' },
];

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error('Please fill in all required fields');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success('Message sent! We will get back to you soon.');
  };

  return (
    <div className="py-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          <span className="badge badge-primary mb-4">Contact</span>
          <h1 className="text-4xl md:text-5xl font-bold text-app-primary mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-app-secondary max-w-xl mx-auto">
            Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6">
            {INFO.map(info => (
              <div key={info.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs text-app-muted font-medium mb-0.5">{info.label}</p>
                  <p className="text-sm text-app-primary font-medium">{info.value}</p>
                </div>
              </div>
            ))}

            <div className="pt-4">
              <p className="text-xs text-app-muted mb-3">Follow us</p>
              <div className="flex gap-3">
                {[FaLinkedin, FaGithub, FaTwitter].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 rounded-xl bg-muted-app flex items-center justify-center text-app-secondary hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-8">

            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineCheck className="text-green-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-app-primary mb-2">Message Sent!</h3>
                <p className="text-app-secondary mb-6">Thank you for reaching out. We&apos;ll respond within 24 hours.</p>
                <Button variant="secondary" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-secondary mb-1.5">Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-secondary mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-secondary mb-1.5">Subject</label>
                  <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="What is this about?" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-secondary mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us how we can help..." rows={5}
                    className="input-field resize-none" />
                </div>
                <Button type="submit" fullWidth size="lg" loading={loading}>
                  Send Message
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
