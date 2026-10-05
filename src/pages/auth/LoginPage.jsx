// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [form, setForm]         = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login, loginWithSocial } = useAuth();
  const navigate                = useNavigate();
  const location                = useLocation();
  const from                    = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    const result = await loginWithSocial(provider);
    setLoading(false);
    if (result?.success) {
      toast.success(`Signed in with ${provider}! 👋`);
      navigate(from, { replace: true });
    } else {
      toast.error(result?.message || `${provider} login failed`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Welcome back</h1>
        <p className="text-app-secondary">Sign in to your InterviewAI account</p>
      </div>

            {/* Instant Demo Access Button */}
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('interview_logged_out');
          const { token: t, user: u } = mockAuthUser;
          localStorage.setItem('ai_interview_token', t);
          localStorage.setItem('ai_interview_user', JSON.stringify(u));
          login('rahul.munde@example.com', 'password123');
          navigate('/dashboard');
        }}
        className="w-full py-3 px-4 mb-6 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        🚀 Instant Demo Access (Skip Login & Go to Dashboard)
      </button>

      {/* Social Login */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSocialLogin('Google')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-app text-sm font-medium text-app-secondary hover:bg-muted-app transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FcGoogle size={18} /> Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin('GitHub')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-app text-sm font-medium text-app-secondary hover:bg-muted-app transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FaGithub size={18} /> GitHub
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app" /></div>
        <div className="relative flex justify-center"><span className="px-4 text-xs text-app-muted" style={{ background: 'rgb(var(--bg-base))' }}>or continue with email</span></div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Email address</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input
              name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email"
              className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input
              name="password" type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="current-password"
              className="input-field pl-10 pr-10" />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-primary transition-colors">
              {showPass ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-app-secondary">
            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange}
              className="w-4 h-4 rounded accent-indigo-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-indigo-500 hover:text-indigo-400 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
      </form>

      {/* Demo hint */}
      <div className="mt-4 p-3 rounded-xl text-xs text-app-muted" style={{ background: 'rgb(var(--bg-muted))' }}>
        💡 <strong>Demo:</strong> Enter any email & password to log in
      </div>

      <p className="mt-6 text-center text-sm text-app-secondary">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-indigo-500 font-semibold hover:text-indigo-400">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
