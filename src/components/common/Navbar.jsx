// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenuAlt3, HiOutlineX, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME } from '@/constants/appConstants';
import { getInitials } from '@/utils/helpers';

const NAV_LINKS = [
  { label: 'Features', path: '/#features' },
  { label: 'How It Works', path: '/#how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-app"
      style={{ background: 'rgb(var(--bg-base) / 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="section-container">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">AI</span>
            <span className="gradient-text">{APP_NAME}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.path}
                className="px-4 py-2 rounded-lg text-sm font-medium text-app-secondary hover:text-app-primary hover:bg-muted-app transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme}
              className="p-2 rounded-lg text-app-secondary hover:text-app-primary hover:bg-muted-app transition-colors"
              aria-label="Toggle theme">
              {isDark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(o => !o)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted-app transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-app-primary">{user?.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-card p-2 shadow-xl"
                      onMouseLeave={() => setProfileOpen(false)}>
                      <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-app-secondary hover:bg-muted-app hover:text-app-primary transition-colors" onClick={() => setProfileOpen(false)}>
                        📊 Dashboard
                      </Link>
                      <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-app-secondary hover:bg-muted-app hover:text-app-primary transition-colors" onClick={() => setProfileOpen(false)}>
                        👤 Profile
                      </Link>
                      <Link to="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-app-secondary hover:bg-muted-app hover:text-app-primary transition-colors" onClick={() => setProfileOpen(false)}>
                        ⚙️ Settings
                      </Link>
                      <div className="divider my-1" />
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Log In</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-app-secondary" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <HiOutlineX size={22} /> : <HiOutlineMenuAlt3 size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-app overflow-hidden"
            style={{ background: 'rgb(var(--bg-base))' }}>
            <div className="section-container py-4 flex flex-col gap-2">
              {NAV_LINKS.map(link => (
                <a key={link.label} href={link.path}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-app-secondary hover:bg-muted-app transition-colors"
                  onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="btn-secondary mt-2" onClick={() => setMenuOpen(false)}>Log In</Link>
                  <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
