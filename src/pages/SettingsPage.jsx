// src/pages/SettingsPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HiOutlineMoon, HiOutlineBell, HiOutlineGlobe, HiOutlineShieldCheck,
  HiOutlineSun, HiOutlineKey, HiOutlineTrash,
} from 'react-icons/hi';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';

function Toggle({ checked, onChange }) {
  return (
    <button onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0
        ${checked ? 'bg-indigo-500' : 'bg-muted-app'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow
        ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );
}

function SettingRow({ icon, title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-app last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-muted-app flex items-center justify-center text-indigo-500 flex-shrink-0">{icon}</div>
        <div>
          <p className="text-sm font-medium text-app-primary">{title}</p>
          {desc && <p className="text-xs text-app-muted">{desc}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [notifs, setNotifs] = useState({
    email:   true,
    push:    false,
    weekly:  true,
    tips:    true,
  });
  const [lang, setLang] = useState('en');

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-app-primary">Settings</h1>
        <p className="text-sm text-app-muted">Manage your account preferences</p>
      </motion.div>

      {/* Appearance */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-1">Appearance</h3>
        <p className="text-xs text-app-muted mb-4">Customize how InterviewAI looks</p>
        <SettingRow icon={isDark ? <HiOutlineMoon size={18} /> : <HiOutlineSun size={18} />}
          title="Dark Mode" desc="Switch between dark and light theme">
          <Toggle checked={isDark} onChange={toggleTheme} />
        </SettingRow>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-1">Notifications</h3>
        <p className="text-xs text-app-muted mb-4">Choose what you want to be notified about</p>
        <SettingRow icon={<HiOutlineBell size={18} />} title="Email Notifications"
          desc="Receive results and reports via email">
          <Toggle checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
        </SettingRow>
        <SettingRow icon={<HiOutlineBell size={18} />} title="Push Notifications"
          desc="Browser push notifications">
          <Toggle checked={notifs.push} onChange={v => setNotifs(n => ({ ...n, push: v }))} />
        </SettingRow>
        <SettingRow icon={<HiOutlineBell size={18} />} title="Weekly Summary"
          desc="Weekly performance digest every Monday">
          <Toggle checked={notifs.weekly} onChange={v => setNotifs(n => ({ ...n, weekly: v }))} />
        </SettingRow>
        <SettingRow icon={<HiOutlineBell size={18} />} title="Tips & Tricks"
          desc="Receive interview tips and study recommendations">
          <Toggle checked={notifs.tips} onChange={v => setNotifs(n => ({ ...n, tips: v }))} />
        </SettingRow>
      </Card>

      {/* Language */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-1">Language & Region</h3>
        <p className="text-xs text-app-muted mb-4">Choose your preferred language</p>
        <SettingRow icon={<HiOutlineGlobe size={18} />} title="Language" desc="Select your preferred language">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="input-field w-auto text-sm py-2 px-3">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </SettingRow>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="font-semibold text-app-primary mb-1">Security</h3>
        <p className="text-xs text-app-muted mb-4">Manage your account security</p>
        <div className="space-y-3">
          <Button variant="secondary" fullWidth icon={<HiOutlineKey size={16} />}
            onClick={() => toast('Password change will be available with Spring Boot backend', { icon: '🔒' })}>
            Change Password
          </Button>
          <Button variant="secondary" fullWidth icon={<HiOutlineShieldCheck size={16} />}
            onClick={() => toast('2FA will be available in a future update', { icon: '🛡️' })}>
            Enable Two-Factor Authentication
          </Button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card>
        <h3 className="font-semibold text-red-500 mb-1">Danger Zone</h3>
        <p className="text-xs text-app-muted mb-4">Irreversible actions — proceed with caution</p>
        <Button variant="danger" icon={<HiOutlineTrash size={16} />}
          onClick={() => toast.error('Account deletion requires backend integration')}>
          Delete Account
        </Button>
      </Card>

      <Button fullWidth onClick={() => toast.success('Settings saved!')}>
        Save All Changes
      </Button>
    </div>
  );
}
