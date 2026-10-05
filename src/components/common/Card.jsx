// src/components/common/Card.jsx
import { motion } from 'framer-motion';

/**
 * Reusable Card component
 * variant: 'default' | 'glass' | 'stat' | 'bordered'
 */
export default function Card({
  children,
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  padding = true,
}) {
  const variants = {
    default:  'bg-card border border-app rounded-2xl shadow-sm',
    glass:    'glass-card',
    stat:     'stat-card',
    bordered: 'bg-card border-2 border-indigo-500/20 rounded-2xl',
  };

  return (
    <motion.div
      whileHover={hover && onClick ? { y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' } : hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      className={`
        ${variants[variant]}
        ${padding ? 'p-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}>
      {children}
    </motion.div>
  );
}
