// src/components/common/Button.jsx
import { motion } from 'framer-motion';

/**
 * Reusable Button component
 * variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const sizes = {
    sm:  'px-3 py-1.5 text-xs gap-1.5',
    md:  'px-5 py-2.5 text-sm gap-2',
    lg:  'px-7 py-3 text-base gap-2',
  };

  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    outline:   'btn-outline',
    danger:    'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all',
    ghost:     'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl text-app-secondary hover:bg-muted-app hover:text-app-primary transition-all',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full justify-center' : ''}
        ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}
        ${className}
      `}>
      {loading ? (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && <span className="flex-shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
