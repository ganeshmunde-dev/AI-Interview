// src/constants/appConstants.js
// Central constants — swap API_BASE_URL when Spring Boot is ready

export const APP_NAME = 'InterviewAI';
export const APP_TAGLINE = 'Ace Every Interview with AI-Powered Mock Sessions';
export const APP_VERSION = '1.0.0';

// API — will point to Spring Boot in Phase 2
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Local Storage Keys
export const LS_KEYS = {
  TOKEN:        'interviewai_token',
  USER:         'interviewai_user',
  THEME:        'interviewai_theme',
  INTERVIEW:    'interviewai_session',
};

// Navigation items for Sidebar
export const SIDEBAR_LINKS = [
  { label: 'Dashboard',       path: '/dashboard',        icon: 'RxDashboard' },
  { label: 'Start Interview', path: '/interview/setup',  icon: 'HiOutlinePlay' },
  { label: 'History',         path: '/history',          icon: 'HiOutlineClipboardList' },
  { label: 'Results',         path: '/results',          icon: 'HiOutlineChartBar' },
  { label: 'Profile',         path: '/profile',          icon: 'HiOutlineUser' },
  { label: 'Settings',        path: '/settings',         icon: 'HiOutlineCog' },
];

// Interview Modes
export const INTERVIEW_MODES = {
  AI: 'ai',
  TYPING: 'typing',
};

export const INTERVIEW_MODE_OPTIONS = [
  {
    id: INTERVIEW_MODES.AI,
    title: 'AI Interview',
    tagline: 'Talk to an AI interviewer',
    icon: '🤖',
    badge: 'Realistic Simulation',
    accentColor: 'from-indigo-500 to-purple-600',
    features: [
      'AI asks questions aloud',
      'Voice-based answers',
      'Webcam enabled',
      'Realistic interview experience',
      'AI follow-up questions',
    ],
    cta: 'Choose AI Interview',
  },
  {
    id: INTERVIEW_MODES.TYPING,
    title: 'Typing Interview',
    tagline: 'Traditional interview with smart voice assistance',
    icon: '⌨️',
    badge: 'Traditional & Flexible',
    accentColor: 'from-blue-500 to-cyan-600',
    features: [
      'Questions displayed on screen',
      'Type your answers',
      'Voice-to-text available',
      'Edit answers before submitting',
      'Webcam optional',
    ],
    cta: 'Choose Typing Interview',
  },
];

// Roles available in Interview Setup
export const INTERVIEW_ROLES = [
  { id: 'frontend',       label: 'Frontend Developer',  icon: '🎨' },
  { id: 'react_dev',      label: 'React Developer',     icon: '⚛️' },
  { id: 'java_dev',       label: 'Java Developer',      icon: '☕' },
  { id: 'fullstack',      label: 'Java Full Stack',     icon: '🔥' },
  { id: 'spring_boot',    label: 'Spring Boot',         icon: '🌱' },
  { id: 'php',            label: 'PHP Developer',       icon: '🐘' },
  { id: 'backend',        label: 'Backend Developer',   icon: '⚙️' },
  { id: 'hr',             label: 'HR Round',            icon: '🤝' },
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { id: 'easy',   label: 'Easy',   color: 'text-green-500',  bg: 'bg-green-500/10' },
  { id: 'medium', label: 'Medium', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 'hard',   label: 'Hard',   color: 'text-red-500',    bg: 'bg-red-500/10' },
];

// Interview types
export const INTERVIEW_TYPES = [
  { id: 'technical', label: 'Technical',  icon: '💻' },
  { id: 'hr',        label: 'HR Round',   icon: '🤝' },
  { id: 'coding',    label: 'Coding',     icon: '📝' },
  { id: 'mixed',     label: 'Mixed',      icon: '🔀' },
];

// Interviewer Personalities
export const INTERVIEWER_PERSONALITIES = [
  {
    id: 'professional',
    label: 'Professional Interviewer',
    icon: '👔',
    tone: 'formal, structured and objective',
    description: 'Formal, methodical, and objective. Focuses on conceptual depth, clean design, and trade-off analysis.',
  },
  {
    id: 'friendly',
    label: 'Friendly & Supportive',
    icon: '🤝',
    tone: 'warm, encouraging and supportive',
    description: 'Warm, encouraging, and approachable. Helps reduce interview anxiety while maintaining rigor.',
  },
  {
    id: 'strict',
    label: 'Challenging / Strict',
    icon: '⚡',
    tone: 'direct, demanding and high-pressure',
    description: 'Direct and demanding. Deep-dives into edge cases, concurrency tradeoffs, and boundary conditions.',
  },
  {
    id: 'hr',
    label: 'Behavioral / HR Specialist',
    icon: '🎯',
    tone: 'behavioral, empathetic and situational',
    description: 'Focuses on communication, teamwork, leadership, conflict resolution, and the STAR method.',
  },
];

// Question counts
export const QUESTION_COUNTS = [5, 10, 20];

// Score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD:      65,
  AVERAGE:   45,
};

// Chart colors
export const CHART_COLORS = {
  primary:  'rgba(99, 102, 241, 1)',
  accent:   'rgba(139, 92, 246, 1)',
  success:  'rgba(34, 197, 94, 1)',
  warning:  'rgba(234, 179, 8, 1)',
  danger:   'rgba(239, 68, 68, 1)',
  primaryBg:'rgba(99, 102, 241, 0.15)',
  accentBg: 'rgba(139, 92, 246, 0.15)',
};

// Pricing plans
export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: '/month',
    features: ['5 mock interviews/month', 'Basic AI feedback', 'Common question bank', 'Email support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹499',
    period: '/month',
    features: ['Unlimited interviews', 'Advanced AI feedback', 'All roles & difficulty', 'Voice & camera mode', 'PDF reports', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Everything in Pro', 'Team dashboards', 'Custom questions', 'API access', 'Dedicated support'],
    cta: 'Contact Us',
    popular: false,
  },
];
