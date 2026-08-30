import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Wallet,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import {
  Expense,
  Income,
  MonthlyBudget,
  ActiveTab,
  RegressionPrediction,
  AIInsight,
} from '../types';
import { formatCurrency } from '../utils/currencies';
import {
  CategoryPieChart,
  IncomeVsExpenseBarChart,
  SpendingTrendLineChart,
} from './charts/FinanceCharts';
import { groupExpensesByMonth, groupIncomeByMonth, getCategoryTotalsForMonth } from '../utils/aiEngine';

interface DashboardViewProps {
  incomes: Income[];
  expenses: Expense[];
  budgets: MonthlyBudget[];
  currentMonth: string;
  currencySymbol: string;
  prediction: RegressionPrediction;
  aiInsights: AIInsight[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  incomes,
  expenses,
  budgets,
  currentMonth,
  currencySymbol,
  prediction,
  aiInsights,
  setActiveTab,
  onOpenAddIncome,
  onOpenAddExpense,
}) => {
  // Current month totals
  const currentMonthIncomes = incomes.filter(i => i.date.startsWith(currentMonth));
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));

  const totalIncome = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

  // Budget calculations
  const activeBudget = budgets.find(b => b.month === currentMonth) || budgets[0] || { overallBudget: 55000 };
  const overallBudget = activeBudget.overallBudget;
  const budgetRemaining = overallBudget - totalExpenses;
  const budgetUsagePct = Math.round((totalExpenses / (overallBudget || 1)) * 100);

  // Status
  const isBudgetExceeded = budgetUsagePct >= 100;
  const isBudgetWarning = budgetUsagePct >= 80 && budgetUsagePct < 100;
  const budgetStatusText = isBudgetExceeded
    ? 'Budget Exceeded 🔴'
    : isBudgetWarning
    ? 'Warning (>80%) 🟡'
    : 'Safe 🟢';

  // Category totals for Donut chart
  const categoryTotals = getCategoryTotalsForMonth(expenses, currentMonth);

  // Multi-month bar chart data
  const monthlyExpenseMap = groupExpensesByMonth(expenses);
  const monthlyIncomeMap = groupIncomeByMonth(incomes);
  const allMonths = Array.from(
    new Set([...Object.keys(monthlyExpenseMap), ...Object.keys(monthlyIncomeMap)])
  ).sort();

  const monthlyBarData = allMonths.map(month => ({
    month: month.substring(5), // '04', '05', '08' etc.
    income: monthlyIncomeMap[month] || 0,
    expense: monthlyExpenseMap[month] || 0,
  }));

  // Line chart data with regression prediction
  const monthlyLineData = prediction.monthlyHistory.map(item => ({
    month: item.month.substring(5),
    expense: item.actual,
    predicted: item.predicted,
  }));

  // Recent 5 transactions
  const combinedTransactions = [
    ...incomes.map(i => ({ id: i.id, date: i.date, desc: i.description || i.source, amount: i.amount, type: 'Income', category: i.source })),
    ...expenses.map(e => ({ id: e.id, date: e.date, desc: e.description || e.category, amount: e.amount, type: 'Expense', category: e.category })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Month Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Financial Overview</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
              Live Tracker
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time automated income, expense, and Machine Learning budget analytics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Period: August 2026</span>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Income */}
        <div className="p-5 rounded-2xl glass-card glass-card-hover relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Income</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(totalIncome, currencySymbol)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>{currentMonthIncomes.length} inflow entries</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="p-5 rounded-2xl glass-card glass-card-hover relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              {formatCurrency(totalExpenses, currencySymbol)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400">
              <span>{currentMonthExpenses.length} transactions recorded</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Savings */}
        <div className="p-5 rounded-2xl glass-card glass-card-hover relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Savings</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className={`text-2xl lg:text-3xl font-extrabold font-mono tracking-tight ${totalSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(totalSavings, currencySymbol)}
            </p>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-amber-300">
              <span>{savingsRate}% savings rate</span>
              <span className="text-slate-500">• (Income - Expenses)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Monthly Budget */}
        <div className="p-5 rounded-2xl glass-card glass-card-hover relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Budget</span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isBudgetExceeded
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : isBudgetWarning
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}>
              {budgetStatusText}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(overallBudget, currencySymbol)}
              </p>
              <span className="text-xs font-semibold text-slate-400">
                {budgetUsagePct}% used
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isBudgetExceeded
                    ? 'bg-rose-500'
                    : isBudgetWarning
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, budgetUsagePct)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Remaining: <span className="text-white font-mono font-semibold">{formatCurrency(budgetRemaining, currencySymbol)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* AI Intelligence Spotlight Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">AI Financial Forecast &amp; Insights</h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                OLS Linear Regression
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {prediction.explanation}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="view-ai-analysis-btn"
            onClick={() => setActiveTab('ai-analysis')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <span>View Full AI Insights</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Core Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Expense Category Donut / Pie Chart */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">1. Expense Category Breakdown</h3>
              <p className="text-xs text-slate-400">Current month category distribution</p>
            </div>
            <button
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-emerald-400 hover:underline font-medium"
            >
              Details
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CategoryPieChart categoryTotals={categoryTotals} currencySymbol={currencySymbol} />
          </div>
        </div>

        {/* Chart 2: Monthly Income vs Expense Bar Chart */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">2. Monthly Income vs Expenses</h3>
              <p className="text-xs text-slate-400">Multi-month cashflow comparison</p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">5 Months Trend</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <IncomeVsExpenseBarChart monthlyData={monthlyBarData} currencySymbol={currencySymbol} />
          </div>
        </div>

        {/* Chart 3: Spending Trend Line Chart (ML Fit) */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-white text-sm">3. Spending Trend &amp; ML Fit</h3>
              <p className="text-xs text-slate-400">Regression line &amp; next-month forecast</p>
            </div>
            <button
              onClick={() => setActiveTab('prediction')}
              className="text-xs text-blue-400 hover:underline font-medium"
            >
              ML Model
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SpendingTrendLineChart monthlyData={monthlyLineData} currencySymbol={currencySymbol} />
          </div>
        </div>
      </div>

      {/* Bottom Section: AI Insights List & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insight Highlights */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Active AI Recommendations</h3>
            </div>
            <button
              onClick={() => setActiveTab('suggestions')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              See All Tips
            </button>
          </div>

          <div className="space-y-3">
            {aiInsights.slice(0, 3).map((insight, idx) => (
              <div
                key={insight.id || idx}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-3"
              >
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-200">{insight.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                  {insight.actionableTip && (
                    <div className="mt-2 text-[11px] font-medium text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                      💡 {insight.actionableTip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Recent Transactions</h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs text-emerald-400 hover:underline font-semibold"
            >
              Full Ledger
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 overflow-hidden">
            {combinedTransactions.map(tx => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      tx.type === 'Income'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {tx.type === 'Income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-xs">{tx.desc}</p>
                    <p className="text-[11px] text-slate-500">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs font-bold font-mono ${
                      tx.type === 'Income' ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount, currencySymbol)}
                  </p>
                  <span className="text-[10px] text-slate-500 uppercase">{tx.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
