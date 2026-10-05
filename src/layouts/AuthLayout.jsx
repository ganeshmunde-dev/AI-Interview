// src/layouts/AuthLayout.jsx
// Centered layout for Login, Register, ForgotPassword
import { Outlet, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { APP_NAME } from '@/constants/appConstants';

export default function AuthLayout() {
  const location          = useLocation();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex" style={{ background: 'rgb(var(--bg-base))' }}>
      {/* Left panel — branding/illustration */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)' }} />
        <div className="flex flex-col justify-center items-center h-full p-12 relative z-10 text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold mb-6">AI</div>
          <h1 className="text-4xl font-bold mb-4 text-center leading-tight">
            Master Every<br />Interview
          </h1>
          <p className="text-white/80 text-center text-lg max-w-xs">
            AI-powered mock interviews with real-time feedback to land your dream job.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
            {[
              { label: '50K+', desc: 'Interviews' },
              { label: '94%',  desc: 'Success Rate' },
              { label: '120+', desc: 'Companies' },
              { label: '2.5K+', desc: 'Questions' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl font-bold">{s.label}</div>
                <div className="text-white/70 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
            <span className="gradient-text font-bold text-lg">{APP_NAME}</span>
          </Link>
          <button onClick={toggleTheme}
            className="p-2 rounded-lg text-app-secondary hover:text-app-primary hover:bg-muted-app transition-colors">
            {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md">
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
