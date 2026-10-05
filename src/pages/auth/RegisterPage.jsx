// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';

export default function RegisterPage() {
  const [form, setForm]         = useState({ name: '', email: '', password: '', confirm: '', terms: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { register, loginWithSocial } = useAuth();
  const navigate                = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSocialRegister = async (provider) => {
    setLoading(true);
    const result = await loginWithSocial(provider);
    setLoading(false);
    if (result?.success) {
      toast.success(`Account created with ${provider}! Welcome 🎉`);
      navigate('/dashboard');
    } else {
      toast.error(result?.message || `${provider} registration failed`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (!form.terms) return toast.error('Please accept the terms of service');
    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account created! Welcome to InterviewAI 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Create account</h1>
        <p className="text-app-secondary">Start your journey to interview success</p>
      </div>

      {/* Social Register */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => handleSocialRegister('Google')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-app text-sm font-medium text-app-secondary hover:bg-muted-app transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FcGoogle size={18} /> Google
        </button>
        <button
          type="button"
          onClick={() => handleSocialRegister('GitHub')}
          disabled={loading}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-app text-sm font-medium text-app-secondary hover:bg-muted-app transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FaGithub size={18} /> GitHub
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-app" /></div>
        <div className="relative flex justify-center"><span className="px-4 text-xs text-app-muted" style={{ background: 'rgb(var(--bg-base))' }}>or register with email</span></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Full Name</label>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Rahul Munde" className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Email address</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input name="password" type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              placeholder="Min. 8 characters" className="input-field pl-10 pr-10" />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-primary transition-colors">
              {showPass ? <HiOutlineEyeOff size={18} /> : <HiOutlineEye size={18} />}
            </button>
          </div>
          {/* Password strength */}
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map(l => (
                  <div key={l} className={`h-1 flex-1 rounded-full transition-all ${strength >= l ? strengthColors[strength] : 'bg-muted-app'}`} />
                ))}
              </div>
              <p className="text-xs text-app-muted">Strength: {strengthLabels[strength]}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Confirm Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
              placeholder="Repeat password" className="input-field pl-10" />
          </div>
        </div>

        <label className="flex items-start gap-2 cursor-pointer text-sm text-app-secondary">
          <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded accent-indigo-500 flex-shrink-0" />
          <span>I agree to the <Link to="#" className="text-indigo-500">Terms of Service</Link> and <Link to="#" className="text-indigo-500">Privacy Policy</Link></span>
        </label>

        <Button type="submit" fullWidth loading={loading} size="lg">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-app-secondary">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-400">Sign in</Link>
      </p>
    </div>
  );
}
