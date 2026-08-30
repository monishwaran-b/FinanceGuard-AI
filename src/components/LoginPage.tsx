import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Fingerprint,
  PlayCircle,
  Globe,
  TrendingUp,
  BrainCircuit,
  Zap,
  Target,
  ChevronDown,
} from 'lucide-react';
import { User as UserType } from '../types';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslation,
} from '../utils/translations';

interface LoginPageProps {
  onLoginSuccess: (user: UserType) => void;
  onSignupSuccess: (user: UserType) => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onOpenDemoVideo: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onSignupSuccess,
  currentLanguage,
  onLanguageChange,
  onOpenDemoVideo,
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@financeguard.ai');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [incomeGoal, setIncomeGoal] = useState('75000');
  const [savingsGoal, setSavingsGoal] = useState('20000');
  const [error, setError] = useState('');
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);
  const selectedLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

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
        incomeGoal: Number(incomeGoal) || 75000,
        savingsGoal: Number(savingsGoal) || 20000,
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
        incomeGoal: Number(incomeGoal) || 60000,
        savingsGoal: Number(savingsGoal) || 15000,
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

  const handleBiometricUnlock = () => {
    setIsBiometricScanning(true);
    setError('');
    setTimeout(() => {
      setIsBiometricScanning(false);
      setBiometricSuccess(true);
      setTimeout(() => {
        handleDemoLogin();
      }, 700);
    }, 1200);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="relative z-30 w-full border-b border-[#1E293B] bg-[#0F172A]/70 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">
                FinanceGuard
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Smart Budget &amp; Expense Controller
            </p>
          </div>
        </div>

        {/* Right Header Actions: Demo Video & Language Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Watch AI Demo Video Button */}
          <button
            id="login-header-demo-video-btn"
            onClick={onOpenDemoVideo}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition shadow-sm"
          >
            <PlayCircle className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{t('viewDemo')}</span>
            <span className="sm:hidden">{t('demoVideo')}</span>
          </button>

          {/* Multi-Language Selector Dropdown */}
          <div className="relative">
            <button
              id="login-language-switcher-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700/80 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition"
              aria-label="Change Language"
            >
              <span className="text-base leading-none">{selectedLangObj.flag}</span>
              <span className="hidden md:inline">{selectedLangObj.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl bg-[#111827] border border-[#1E293B] shadow-2xl z-50 p-1.5 divide-y divide-[#1E293B]/70">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Language ({SUPPORTED_LANGUAGES.length})
                </div>
                <div className="py-1 space-y-0.5">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                        currentLanguage === lang.code
                          ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-[#1E293B]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Feature Highlights & AI Capability Showcase */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Machine Learning v3.2 Powered by Scikit-Learn</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Autonomous Budgeting &amp;{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Predictive Expense AI
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
                FinanceGuard AI analyzes your spending habits in real-time, forecasts future expenses via linear regression, and proactively flags overspending before it occurs.
              </p>
            </div>

            {/* Metric Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <BrainCircuit className="w-4 h-4" />
                  <span>94.2%</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">ML Forecast Accuracy</div>
                <div className="text-[10px] text-slate-500">R² = 0.88 Trend Fit</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-1">
                <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                  <Zap className="w-4 h-4" />
                  <span>Real-Time</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">Anomaly Radar</div>
                <div className="text-[10px] text-slate-500">Instant Alert Engine</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-1 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                  <Target className="w-4 h-4" />
                  <span>12+ Langs</span>
                </div>
                <div className="text-xs text-slate-300 font-semibold">Global Localization</div>
                <div className="text-[10px] text-slate-500">Auto Currency &amp; AI Trans</div>
              </div>
            </div>

            {/* Quick Interactive Video Demo Banner */}
            <div
              onClick={onOpenDemoVideo}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#111827] via-[#0F172A] to-[#1E293B] border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition group shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition shadow-inner">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                      {t('demoVideoTitle')}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Watch the 4-minute interactive feature walkthrough
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-400 transform group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Security Guarantee Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t('secureEncryption')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>{t('offlineFirst')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dedicated Login / Register Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
              {/* Header Title inside Card */}
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 mb-1">
                  <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {isLoginMode ? t('welcomeBack') : t('joinFinanceGuard')}
                </h2>
                <p className="text-xs text-slate-400">
                  {isLoginMode ? t('signInPrompt') : t('registerPrompt')}
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex rounded-xl bg-[#0A0E1A] p-1 border border-[#1E293B]">
                <button
                  id="auth-mode-login"
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    isLoginMode
                      ? 'bg-[#1E293B] text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('signIn')}
                </button>
                <button
                  id="auth-mode-signup"
                  type="button"
                  onClick={() => {
                    setIsLoginMode(false);
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    !isLoginMode
                      ? 'bg-[#1E293B] text-white shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('register')}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t('nameLabel')}
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="login-name-input"
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('emailLabel')}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email-input"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('passwordLabel')}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {!isLoginMode && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t('confirmPasswordLabel')}
                      </label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="login-confirm-password-input"
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          {t('incomeGoalLabel')}
                        </label>
                        <input
                          type="number"
                          value={incomeGoal}
                          onChange={e => setIncomeGoal(e.target.value)}
                          className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          {t('savingsGoalLabel')}
                        </label>
                        <input
                          type="number"
                          value={savingsGoal}
                          onChange={e => setSavingsGoal(e.target.value)}
                          className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Remember Me & Forgot Password Row */}
                {isLoginMode && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-[#0A0E1A]"
                      />
                      <span>{t('rememberMe')}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-emerald-400 hover:underline font-semibold"
                    >
                      {t('forgotPassword')}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <span>{isLoginMode ? t('signInBtn') : t('createAccountBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Biometric Quick Unlock Option */}
              <div className="pt-2">
                <button
                  id="biometric-unlock-btn"
                  type="button"
                  onClick={handleBiometricUnlock}
                  disabled={isBiometricScanning}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition ${
                    biometricSuccess
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-[#0F172A] hover:bg-[#1E293B] border-[#1E293B] text-slate-300'
                  }`}
                >
                  <Fingerprint
                    className={`w-4 h-4 ${
                      isBiometricScanning
                        ? 'text-emerald-400 animate-pulse'
                        : biometricSuccess
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>
                    {isBiometricScanning
                      ? t('scanningBiometrics')
                      : biometricSuccess
                      ? t('authSuccess')
                      : t('biometricLogin')}
                  </span>
                </button>
              </div>

              {/* 1-Click Instant Demo Login */}
              <div className="pt-2 border-t border-[#1E293B] text-center space-y-2">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">
                  {t('orContinueWith')}
                </div>
                <button
                  id="login-instant-demo-btn"
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-950/40 via-[#1E293B] to-teal-950/40 hover:from-emerald-950/60 hover:to-teal-950/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" />
                  <span>{t('instantDemoBtn')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
              <p className="text-xs text-slate-400">
                Enter your registered email address and we will generate an instant secure recovery link.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-1">
                <div className="font-bold">Password Reset Link Dispatched!</div>
                <p className="text-slate-400">
                  Check your inbox for <span className="text-emerald-400">{forgotEmail}</span> to complete password reset.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {t('emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#1E293B] text-slate-300 hover:bg-slate-800 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                  >
                    Send Recovery Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-20 w-full border-t border-[#1E293B] bg-[#0F172A]/50 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © 2026 FinanceGuard AI • Machine Learning Predictive Financial Platform
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenDemoVideo}
            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Interactive Demo Video</span>
          </button>
          <span>•</span>
          <span className="text-slate-400">12 Languages Supported</span>
        </div>
      </footer>
    </div>
  );
};
