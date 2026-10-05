// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Button from '@/components/common/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // mock delay
    setLoading(false);
    setSent(true);
    toast.success('Reset link sent!');
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <HiOutlineCheckCircle className="text-green-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-app-primary mb-3">Check Your Email</h2>
        <p className="text-app-secondary mb-6">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.<br />
          Please check your inbox and follow the instructions.
        </p>
        <Button variant="secondary" fullWidth onClick={() => setSent(false)}>
          Resend Email
        </Button>
        <div className="mt-4">
          <Link to="/login" className="text-sm text-indigo-500 hover:text-indigo-400 flex items-center justify-center gap-1">
            <HiOutlineArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-app-primary mb-2">Forgot password?</h1>
        <p className="text-app-secondary">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-app-secondary mb-1.5">Email address</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className="input-field pl-10" />
          </div>
        </div>
        <Button type="submit" fullWidth loading={loading} size="lg">
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-indigo-500 hover:text-indigo-400 flex items-center justify-center gap-1">
          <HiOutlineArrowLeft size={16} /> Back to Login
        </Link>
      </div>
    </div>
  );
}
