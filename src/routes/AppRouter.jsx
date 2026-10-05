// src/routes/AppRouter.jsx
import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import MainLayout      from '@/layouts/MainLayout';
import AuthLayout      from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute  from '@/routes/ProtectedRoute';
import { PageLoader }  from '@/components/common/Loader';

// Lazy-loaded pages
const LandingPage        = lazy(() => import('@/pages/LandingPage'));
const AboutPage          = lazy(() => import('@/pages/AboutPage'));
const PricingPage        = lazy(() => import('@/pages/PricingPage'));
const ContactPage        = lazy(() => import('@/pages/ContactPage'));

const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

const DashboardPage      = lazy(() => import('@/pages/dashboard/DashboardPage'));
const InterviewSetupPage = lazy(() => import('@/pages/interview/InterviewSetupPage'));
const InterviewScreen    = lazy(() => import('@/pages/interview/InterviewScreen'));
const ResultsPage              = lazy(() => import('@/pages/interview/ResultsPage'));
const HistoryPage              = lazy(() => import('@/pages/HistoryPage'));
const PerformanceAnalyticsPage = lazy(() => import('@/pages/analytics/PerformanceAnalyticsPage'));
const AIInterviewCoachingPage  = lazy(() => import('@/pages/coaching/AIInterviewCoachingPage'));
const ProfilePage              = lazy(() => import('@/pages/ProfilePage'));
const SettingsPage             = lazy(() => import('@/pages/SettingsPage'));

export default function AppRouter() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgb(var(--bg-card))',
            color: 'rgb(var(--text-primary))',
            border: '1px solid rgb(var(--border-color))',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route index          element={<LandingPage />} />
            <Route path=""        element={<LandingPage />} />
            <Route path="about"   element={<AboutPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="login"           element={<LoginPage />} />
            <Route path="register"        element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard"        element={<DashboardPage />} />
            <Route path="interview/setup"  element={<InterviewSetupPage />} />
            <Route path="interview/screen" element={<InterviewScreen />} />
            <Route path="results"          element={<ResultsPage />} />
            <Route path="history"          element={<HistoryPage />} />
            <Route path="analytics"        element={<PerformanceAnalyticsPage />} />
            <Route path="coaching"         element={<AIInterviewCoachingPage />} />
            <Route path="profile"          element={<ProfilePage />} />
            <Route path="settings"         element={<SettingsPage />} />
          </Route>

          {/* Safe Fallback: Redirect anything else to / */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
