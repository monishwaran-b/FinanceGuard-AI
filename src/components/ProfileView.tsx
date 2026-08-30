import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Target,
  PiggyBank,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Save,
  Award,
} from 'lucide-react';
import { User } from '../types';
import { formatCurrency } from '../utils/currencies';

interface ProfileViewProps {
  user: User;
  onUpdateUser: (user: User) => void;
  currencySymbol: string;
  totalMonthlyIncome: number;
  totalMonthlySavings: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  currencySymbol,
  totalMonthlyIncome,
  totalMonthlySavings,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [incomeGoal, setIncomeGoal] = useState(user.incomeGoal.toString());
  const [savingsGoal, setSavingsGoal] = useState(user.savingsGoal.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const incomeGoalNum = parseFloat(incomeGoal) || 75000;
  const savingsGoalNum = parseFloat(savingsGoal) || 20000;

  const incomeProgressPct = Math.min(100, Math.round((totalMonthlyIncome / incomeGoalNum) * 100));
  const savingsProgressPct = Math.min(100, Math.round((totalMonthlySavings / savingsGoalNum) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      incomeGoal: incomeGoalNum,
      savingsGoal: savingsGoalNum,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-emerald-500/20">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">{user.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Account Tier</span>
        </div>
      </div>

      {/* Goal Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Income Goal Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Income Goal</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">{incomeProgressPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-extrabold font-mono text-white">
              {formatCurrency(totalMonthlyIncome, currencySymbol)}
            </p>
            <span className="text-xs text-slate-400">
              Goal: {formatCurrency(incomeGoalNum, currencySymbol)}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${incomeProgressPct}%` }} />
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Savings Goal</span>
            <span className="text-xs font-bold text-amber-400 font-mono">{savingsProgressPct}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-extrabold font-mono text-white">
              {formatCurrency(totalMonthlySavings, currencySymbol)}
            </p>
            <span className="text-xs text-slate-400">
              Goal: {formatCurrency(savingsGoalNum, currencySymbol)}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${savingsProgressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-emerald-400" />
          <span>Update Profile &amp; Financial Targets</span>
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and target goals updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                id="profile-name-input"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                id="profile-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Monthly Income Goal ({currencySymbol})
              </label>
              <input
                id="profile-income-goal-input"
                type="number"
                required
                value={incomeGoal}
                onChange={e => setIncomeGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Monthly Savings Goal ({currencySymbol})
              </label>
              <input
                id="profile-savings-goal-input"
                type="number"
                required
                value={savingsGoal}
                onChange={e => setSavingsGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              id="profile-save-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
