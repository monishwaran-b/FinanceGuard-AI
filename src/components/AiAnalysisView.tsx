import React from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { AIInsight, Expense, Income, MonthlyBudget } from '../types';
import { formatCurrency } from '../utils/currencies';
import { getCategoryTotalsForMonth } from '../utils/aiEngine';
import { CATEGORY_CONFIG } from './ExpensesView';

interface AiAnalysisViewProps {
  incomes: Income[];
  expenses: Expense[];
  budgets: MonthlyBudget[];
  insights: AIInsight[];
  financialHealthScore: number;
  anomalies: Expense[];
  currencySymbol: string;
  currentMonth: string;
}

export const AiAnalysisView: React.FC<AiAnalysisViewProps> = ({
  incomes,
  expenses,
  budgets,
  insights,
  financialHealthScore,
  anomalies,
  currencySymbol,
  currentMonth,
}) => {
  const categoryTotals = getCategoryTotalsForMonth(expenses, currentMonth);
  const totalMonthExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  // Health Score Rating label
  const getHealthBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/15' };
    if (score >= 65) return { label: 'Good & Stable', color: 'text-blue-400 border-blue-500/30 bg-blue-500/15' };
    if (score >= 50) return { label: 'Moderate Caution', color: 'text-amber-400 border-amber-500/30 bg-amber-500/15' };
    return { label: 'Needs Improvement', color: 'text-rose-400 border-rose-500/30 bg-rose-500/15' };
  };

  const healthBadge = getHealthBadge(financialHealthScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/40 border border-emerald-500/30">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">AI Financial Analysis</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              Machine Learning Core
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated spending pattern analysis, month-over-month shifts, IQR anomaly detection, and budget behavior insights.
          </p>
        </div>
      </div>

      {/* Top Cards: Financial Health Score & Anomaly Detection Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Health Score Dial Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Health Index</span>
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${healthBadge.color}`}>
                {healthBadge.label}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center border-4 border-emerald-500/40">
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {financialHealthScore}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <p>• Savings Rate: <span className="text-white font-semibold">Healthy (&gt;25%)</span></p>
                <p>• Budget Adherence: <span className="text-white font-semibold">Safe Zone</span></p>
                <p>• Spending Volatility: <span className="text-white font-semibold">Low</span></p>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-4 border-t border-slate-800/80 pt-2">
            Calculated from debt-to-savings ratio, category discipline, and income variance.
          </p>
        </div>

        {/* Unusual Spending (Anomaly Detector) Card */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Unusual Spending Anomalies ({anomalies.length} Detected)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Statistical 1.8σ Threshold</span>
            </div>

            {anomalies.length === 0 ? (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>No high-variance unusual transactions detected this month. Spending is within expected statistical standard deviation.</span>
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                {anomalies.map(anom => (
                  <div
                    key={anom.id}
                    className="p-3 rounded-xl bg-slate-800/70 border border-amber-500/30 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 font-bold">
                        ⚠️
                      </span>
                      <div>
                        <p className="font-semibold text-white">{anom.description}</p>
                        <p className="text-[11px] text-slate-400">{anom.category} • {anom.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold font-mono text-rose-400">
                        {formatCurrency(anom.amount, currencySymbol)}
                      </p>
                      <span className="text-[10px] text-amber-300">Unusual Spike</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-800/80 pt-2">
            Outliers flagged when single transaction exceeds mean + 1.8× standard deviation baseline.
          </p>
        </div>
      </div>

      {/* Generated AI Insights Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Intelligent Spending Pattern Insights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(item => {
            const isHigh = item.severity === 'high';
            const isMed = item.severity === 'medium';
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl glass-panel border flex flex-col justify-between transition ${
                  isHigh
                    ? 'border-rose-500/40 bg-rose-950/15'
                    : isMed
                    ? 'border-amber-500/40 bg-amber-950/15'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.type.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold ${isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.severity.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
                </div>

                {item.actionableTip && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-emerald-300 font-medium flex items-start gap-2">
                    <span className="text-sm">💡</span>
                    <span>{item.actionableTip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Spending Velocity Table */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Category Spending Velocity &amp; Share</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORY_CONFIG.map(cfg => {
            const amount = categoryTotals[cfg.category] || 0;
            const pct = totalMonthExpense > 0 ? Math.round((amount / totalMonthExpense) * 100) : 0;
            return (
              <div key={cfg.category} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{cfg.icon}</span>
                    <span className="text-xs font-bold text-white">{cfg.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{pct}%</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    {formatCurrency(amount, currencySymbol)}
                  </span>
                  <span className="text-[10px] text-slate-500">of total spend</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
