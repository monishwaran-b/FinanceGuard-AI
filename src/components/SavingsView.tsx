import React from 'react';
import {
  Lightbulb,
  Sparkles,
  PiggyBank,
  TrendingUp,
  Target,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Income, Expense } from '../types';
import { formatCurrency } from '../utils/currencies';
import { calculateSavingsRecommendations } from '../utils/aiEngine';

interface SavingsViewProps {
  incomes: Income[];
  expenses: Expense[];
  currencySymbol: string;
  currentMonth: string;
}

export const SavingsView: React.FC<SavingsViewProps> = ({
  incomes,
  expenses,
  currencySymbol,
  currentMonth,
}) => {
  const savingsData = calculateSavingsRecommendations(incomes, expenses, currentMonth, currencySymbol);

  const smartActionCards = [
    {
      id: 'sav_1',
      title: '20% Golden Income Savings Rule',
      icon: '🎯',
      description: `Saving 20% of your ${formatCurrency(savingsData.currentIncome, currencySymbol)} monthly inflow generates a bulletproof wealth reserve.`,
      targetAmount: savingsData.targetSavings,
      status: savingsData.actualSavings >= savingsData.targetSavings ? 'Achieved' : 'In Progress',
      color: 'border-emerald-500/30 bg-emerald-950/20',
      tips: 'Set up an automated standing bank transfer on salary day to pay your future self first.',
    },
    {
      id: 'sav_2',
      title: 'Optimize Discretionary Shopping',
      icon: '🛍️',
      description: 'Discretionary impulse purchases can be trimmed by 25% through a 48-hour cool-off purchase rule.',
      targetAmount: savingsData.potentialShoppingCuts,
      status: 'Potential Save',
      color: 'border-pink-500/30 bg-pink-950/20',
      tips: 'Add items to a wishlist and wait 48 hours before confirming non-essential checkouts.',
    },
    {
      id: 'sav_3',
      title: 'Food & Dining Out Optimization',
      icon: '🍔',
      description: 'Cooking 2 additional meals at home per week reduces restaurant bills while improving nutrition.',
      targetAmount: savingsData.potentialDiningCuts,
      status: 'Potential Save',
      color: 'border-amber-500/30 bg-amber-950/20',
      tips: 'Meal prep batch lunches for weekdays and limit dining delivery apps to weekends.',
    },
    {
      id: 'sav_4',
      title: 'Entertainment & Recurring Subscriptions',
      icon: '🎬',
      description: 'Audit active digital media streaming accounts, music apps, and unused recurring memberships.',
      targetAmount: savingsData.potentialEntertainmentCuts,
      status: 'Potential Save',
      color: 'border-indigo-500/30 bg-indigo-950/20',
      tips: 'Cancel duplicate streaming subscriptions and switch to annual bundled billing.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Smart Savings Recommendations</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-driven financial optimization applying the 50/30/20 principle and targeted expense cuts.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span>Formula: Recommended Savings = Income × 20%</span>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recommended Savings */}
        <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recommended Monthly Savings (20%)
          </span>
          <p className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
            {formatCurrency(savingsData.targetSavings, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Target baseline based on your monthly income</p>
        </div>

        {/* Current Actual Net Savings */}
        <div className="p-5 rounded-2xl glass-card border border-slate-800 relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Actual Net Savings (August 2026)
          </span>
          <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono mt-2">
            {formatCurrency(savingsData.actualSavings, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{savingsData.savingsPct}% actual savings rate achieved</p>
        </div>

        {/* Potential Extra Annual Wealth Creation */}
        <div className="p-5 rounded-2xl glass-card border border-amber-500/30 relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Extra Potential Annual Growth
          </span>
          <p className="text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono mt-2">
            +{formatCurrency(savingsData.annualCompoundedSavings, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">If strategic cuts are invested at 7% p.a.</p>
        </div>
      </div>

      {/* 50 / 30 / 20 Budget Rule Breakdown Visualizer */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">50 / 30 / 20 Modern Budget Allocation</h3>
            <p className="text-xs text-slate-400">Benchmark your current spending against financial industry gold standards</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">Income: {formatCurrency(savingsData.currentIncome, currencySymbol)}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Needs */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Needs (Target: 50%)</span>
              <span className="font-mono text-slate-300 font-semibold">{savingsData.needsPct}% Current</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, savingsData.needsPct)}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Actual: {formatCurrency(savingsData.needsSpend, currencySymbol)}</span>
              <span>Target: {formatCurrency(savingsData.targetNeeds, currencySymbol)}</span>
            </div>
          </div>

          {/* Wants */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Wants (Target: 30%)</span>
              <span className="font-mono text-slate-300 font-semibold">{savingsData.wantsPct}% Current</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, savingsData.wantsPct)}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Actual: {formatCurrency(savingsData.wantsSpend, currencySymbol)}</span>
              <span>Target: {formatCurrency(savingsData.targetWants, currencySymbol)}</span>
            </div>
          </div>

          {/* Savings */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-white">Savings (Target: 20%)</span>
              <span className="font-mono text-emerald-400 font-semibold">{savingsData.savingsPct}% Current</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, savingsData.savingsPct)}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>Actual: {formatCurrency(savingsData.actualSavings, currencySymbol)}</span>
              <span>Target: {formatCurrency(savingsData.targetSavings, currencySymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actionable Recommendations Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Personalized Actionable Savings Blueprints</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smartActionCards.map(card => (
            <div key={card.id} className={`p-5 rounded-2xl glass-panel border ${card.color} flex flex-col justify-between`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{card.icon}</span>
                    <h4 className="text-sm font-bold text-white">{card.title}</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {card.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{card.description}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xs text-slate-400">Monthly Potential Value:</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400">
                    +{formatCurrency(card.targetAmount, currencySymbol)}/mo
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="text-amber-400">💡</span>
                <span>{card.tips}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
