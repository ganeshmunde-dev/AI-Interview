// src/layouts/DashboardLayout.jsx
// Layout for all authenticated/dashboard pages
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/common/Sidebar';

const pageVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -10 },
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const sidebarWidth = collapsed ? 72 : 240;

  return (
    <div className="min-h-screen flex" style={{ background: 'rgb(var(--bg-base))' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      {/* Main content */}
      <motion.main
        animate={{ marginLeft: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="flex-1 min-h-screen overflow-x-hidden">
        <div key={location.pathname} className="min-h-screen animate-fade-in">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
