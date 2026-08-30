import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onLoginSuccess: (user: UserType) => void;
  onSignupSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onLoginSuccess,
  onSignupSuccess,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@financeguard.ai');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      if (!email || !password) {
        setError('Please provide both email and password.');
        return;
      }
      onLoginSuccess({
        id: 'usr_default_01',
        name: email.includes('alex') ? 'Alex Morgan' : email.split('@')[0],
        email: email,
        incomeGoal: 75000,
        savingsGoal: 20000,
        joinedDate: '2026-01-15',
      });
    } else {
      if (!name || !email || !password) {
        setError('All fields are required.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      onSignupSuccess({
        id: `usr_${Date.now()}`,
        name,
        email,
        incomeGoal: 60000,
        savingsGoal: 15000,
        joinedDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      id: 'usr_default_01',
      name: 'Alex Morgan',
      email: 'alex.morgan@financeguard.ai',
      incomeGoal: 75000,
      savingsGoal: 20000,
      joinedDate: '2026-01-15',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/20 mb-1">
            <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">FinanceGuard</h2>
            <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
              AI
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Smart Budget &amp; Expense Controller</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            id="auth-tab-login"
            onClick={() => {
              setIsLoginMode(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isLoginMode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            id="auth-tab-signup"
            onClick={() => {
              setIsLoginMode(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isLoginMode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <span>{isLoginMode ? 'Access Dashboard' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <button
            id="quick-demo-login-btn"
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>1-Click Instant Demo Login (Preloaded Data)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
