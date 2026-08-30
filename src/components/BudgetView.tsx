import React, { useState } from 'react';
import {
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Plus,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import { MonthlyBudget, Expense, ExpenseCategory } from '../types';
import { formatCurrency } from '../utils/currencies';
import { CATEGORY_CONFIG } from './ExpensesView';
import { getCategoryTotalsForMonth } from '../utils/aiEngine';

interface BudgetViewProps {
  budgets: MonthlyBudget[];
  expenses: Expense[];
  onUpdateBudget: (budget: MonthlyBudget) => void;
  currencySymbol: string;
  currentMonth: string;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  budgets,
  expenses,
  onUpdateBudget,
  currencySymbol,
  currentMonth,
}) => {
  const activeBudget = budgets.find(b => b.month === currentMonth) || budgets[0] || {
    userId: 'usr_default_01',
    month: currentMonth,
    overallBudget: 55000,
    categoryBudgets: {
      Food: 14000,
      Rent: 16000,
      Bills: 5000,
      Shopping: 7000,
      Travel: 4500,
      Entertainment: 3500,
      Health: 3000,
      Education: 4000,
      Other: 3000,
    },
  };

  const [isEditingOverall, setIsEditingOverall] = useState(false);
  const [overallInput, setOverallInput] = useState(activeBudget.overallBudget.toString());

  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [categoryInput, setCategoryInput] = useState('');

  // Category Spends
  const categorySpends = getCategoryTotalsForMonth(expenses, currentMonth);
  const totalSpent = Object.values(categorySpends).reduce((a, b) => a + b, 0);
  const overallRemaining = activeBudget.overallBudget - totalSpent;
  const overallUsagePct = Math.round((totalSpent / (activeBudget.overallBudget || 1)) * 100);

  const getStatusBadge = (spent: number, budgetLimit: number) => {
    const pct = Math.round((spent / (budgetLimit || 1)) * 100);
    if (pct >= 100) {
      return {
        label: 'Budget Exceeded',
        icon: '🔴',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        barColor: 'bg-rose-500',
        textColor: 'text-rose-400',
      };
    }
    if (pct >= 80) {
      return {
        label: 'Warning (80%+)',
        icon: '🟡',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        barColor: 'bg-amber-400',
        textColor: 'text-amber-400',
      };
    }
    return {
      label: 'Safe',
      icon: '🟢',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-400',
    };
  };

  const handleSaveOverall = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(overallInput);
    if (isNaN(val) || val <= 0) return;
    onUpdateBudget({
      ...activeBudget,
      overallBudget: val,
    });
    setIsEditingOverall(false);
  };

  const handleOpenEditCategory = (cat: ExpenseCategory) => {
    setEditingCategory(cat);
    setCategoryInput((activeBudget.categoryBudgets[cat] || 0).toString());
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const val = parseFloat(categoryInput);
    if (isNaN(val) || val < 0) return;

    onUpdateBudget({
      ...activeBudget,
      categoryBudgets: {
        ...activeBudget.categoryBudgets,
        [editingCategory]: val,
      },
    });
    setEditingCategory(null);
  };

  const overallStatus = getStatusBadge(totalSpent, activeBudget.overallBudget);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <PiggyBank className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Budget Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Set monthly ceiling limits and granular category allocations with automated threshold alerts.
          </p>
        </div>
        <button
          id="edit-overall-budget-btn"
          onClick={() => {
            setOverallInput(activeBudget.overallBudget.toString());
            setIsEditingOverall(true);
          }}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Edit2 className="w-4 h-4" />
          <span>Set Overall Budget</span>
        </button>
      </div>

      {/* Overall Budget Hero Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-700/70 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Monthly Budget (August 2026)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${overallStatus.badgeClass}`}>
                {overallStatus.icon} {overallStatus.label}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <p className="text-3xl lg:text-4xl font-extrabold text-white font-mono">
                {formatCurrency(activeBudget.overallBudget, currencySymbol)}
              </p>
              <span className="text-sm font-semibold text-slate-400">
                ({overallUsagePct}% utilized)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div>
              <span className="text-xs text-slate-400">Total Spent</span>
              <p className="text-lg font-bold font-mono text-white mt-0.5">
                {formatCurrency(totalSpent, currencySymbol)}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Budget Remaining</span>
              <p className={`text-lg font-bold font-mono mt-0.5 ${overallRemaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(overallRemaining, currencySymbol)}
              </p>
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>0%</span>
            <span>80% Warning Limit</span>
            <span>100% Target Limit</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${overallStatus.barColor}`}
              style={{ width: `${Math.min(100, overallUsagePct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category-wise Budgets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Category-wise Budgets</span>
            <span className="text-xs text-slate-400 font-normal">({CATEGORY_CONFIG.length} Categories)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Click edit on any card to update category allocation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_CONFIG.map(cfg => {
            const cat = cfg.category;
            const budgetLimit = activeBudget.categoryBudgets[cat] || 0;
            const spent = categorySpends[cat] || 0;
            const remaining = budgetLimit - spent;
            const pct = budgetLimit > 0 ? Math.round((spent / budgetLimit) * 100) : 0;
            const status = getStatusBadge(spent, budgetLimit);

            return (
              <div
                key={cat}
                className="p-5 rounded-2xl glass-panel border border-slate-800/90 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                        {cfg.icon}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{cat}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                    </div>
                    <button
                      id={`edit-budget-${cat}`}
                      onClick={() => handleOpenEditCategory(cat)}
                      className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
                      title={`Edit ${cat} Budget`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400">Allocated</span>
                      <p className="text-base font-extrabold font-mono text-white">
                        {formatCurrency(budgetLimit, currencySymbol)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">Spent ({pct}%)</span>
                      <p className="text-base font-extrabold font-mono text-slate-200">
                        {formatCurrency(spent, currencySymbol)}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${status.barColor}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Remaining</span>
                  <span className={`font-bold font-mono ${remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatCurrency(remaining, currencySymbol)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Overall Budget Modal */}
      {isEditingOverall && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Update Monthly Overall Budget</h3>
            <p className="text-xs text-slate-400">
              Set your target spending limit for all combined expenditures in August 2026.
            </p>
            <form onSubmit={handleSaveOverall} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Overall Budget Limit ({currencySymbol})
                </label>
                <input
                  id="modal-overall-budget-input"
                  type="number"
                  required
                  value={overallInput}
                  onChange={e => setOverallInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingOverall(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Budget Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Update {editingCategory} Budget</h3>
            <p className="text-xs text-slate-400">
              Adjust the specific monthly spending allocation for {editingCategory}.
            </p>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Limit ({currencySymbol})
                </label>
                <input
                  id="modal-category-budget-input"
                  type="number"
                  required
                  value={categoryInput}
                  onChange={e => setCategoryInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
