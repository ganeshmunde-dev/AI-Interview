// src/utils/helpers.js
// Reusable utility functions

/**
 * Format a date string into a readable format
 * @param {string|Date} date
 * @param {string} locale
 */
export const formatDate = (date, locale = 'en-IN') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

/**
 * Format a date into relative time (e.g., "2 days ago")
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year',   seconds: 31536000 },
    { label: 'month',  seconds: 2592000  },
    { label: 'week',   seconds: 604800   },
    { label: 'day',    seconds: 86400    },
    { label: 'hour',   seconds: 3600     },
    { label: 'minute', seconds: 60       },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

/**
 * Clamp a number between min and max
 */
export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/**
 * Get score color class based on value
 */
export const getScoreColor = (score) => {
  if (score >= 85) return 'text-green-500';
  if (score >= 65) return 'text-yellow-500';
  if (score >= 45) return 'text-orange-500';
  return 'text-red-500';
};

/**
 * Get score label based on value
 */
export const getScoreLabel = (score) => {
  if (score >= 85) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 45) return 'Average';
  return 'Needs Improvement';
};

/**
 * Get score badge class
 */
export const getScoreBadge = (score) => {
  if (score >= 85) return 'badge-success';
  if (score >= 65) return 'badge-warning';
  return 'badge-danger';
};

/**
 * Format seconds to MM:SS
 */
export const formatTimer = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Truncate a string to maxLength with ellipsis
 */
export const truncate = (str, maxLength = 80) =>
  str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

/**
 * Generate initials from a full name
 */
export const getInitials = (name = '') =>
  name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

/**
 * Shuffle an array (Fisher–Yates)
 */
export const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Debounce a function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Deep clone an object
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Check if user is authenticated (reads from localStorage)
 */
export const isAuthenticated = () => !!localStorage.getItem('interviewai_token');
