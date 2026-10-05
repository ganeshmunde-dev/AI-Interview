// src/components/common/Loader.jsx
import { motion } from 'framer-motion';

/** Full-page loader */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 animate-spin" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
        </div>
        <p className="text-app-secondary text-sm animate-pulse">Loading InterviewAI...</p>
      </div>
    </div>
  );
}

/** Inline spinner */
export function Spinner({ size = 20 }) {
  return (
    <svg
      className="animate-spin text-indigo-500"
      style={{ width: size, height: size }}
      viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

/** Skeleton loader block */
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

/** Card skeleton */
export function CardSkeleton() {
  return (
    <div className="bg-card border border-app rounded-2xl p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}
