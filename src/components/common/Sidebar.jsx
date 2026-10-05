// src/components/common/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineHome, HiOutlinePlay, HiOutlineClipboardList,
  HiOutlineChartBar, HiOutlineTrendingUp, HiOutlineAcademicCap,
  HiOutlineUser, HiOutlineCog,
  HiOutlineLogout, HiOutlineChevronLeft, HiOutlineChevronRight,
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';
import { APP_NAME } from '@/constants/appConstants';
import { getInitials } from '@/utils/helpers';

const LINKS = [
  { label: 'Dashboard',       path: '/dashboard',       icon: HiOutlineHome },
  { label: 'Start Interview', path: '/interview/setup', icon: HiOutlinePlay },
  { label: 'History',         path: '/history',         icon: HiOutlineClipboardList },
  { label: 'Results',         path: '/results',         icon: HiOutlineChartBar },
  { label: 'Analytics',       path: '/analytics',       icon: HiOutlineTrendingUp },
  { label: 'AI Coach',        path: '/coaching',        icon: HiOutlineAcademicCap },
  { label: 'Profile',         path: '/profile',         icon: HiOutlineUser },
  { label: 'Settings',        path: '/settings',        icon: HiOutlineCog },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full z-40 flex flex-col border-r border-app overflow-hidden"
      style={{ background: 'rgb(var(--bg-surface))' }}>

      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-app gap-3 flex-shrink-0">
        <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="gradient-text font-bold text-lg whitespace-nowrap">
              {APP_NAME}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {LINKS.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }>
            <Icon size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="whitespace-nowrap text-sm">
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User & Collapse */}
      <div className="border-t border-app p-2 space-y-2 flex-shrink-0">
        {/* User info */}
        <div className={`flex items-center gap-3 px-2 py-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user?.name)}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0">
                <p className="text-xs font-semibold text-app-primary truncate">{user?.name}</p>
                <p className="text-xs text-app-muted truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className={`sidebar-link text-red-500 hover:bg-red-500/10 hover:text-red-500 w-full ${collapsed ? 'justify-center' : ''}`}>
          <HiOutlineLogout size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Collapse toggle */}
        <button onClick={onToggle}
          className={`sidebar-link w-full ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <span className="text-xs text-app-muted">Collapse</span>}
          {collapsed
            ? <HiOutlineChevronRight size={18} />
            : <HiOutlineChevronLeft size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
