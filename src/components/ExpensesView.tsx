import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { formatCurrency } from '../utils/currencies';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  currencySymbol: string;
  currentMonth: string;
}

export const CATEGORY_CONFIG: {
  category: ExpenseCategory;
  icon: string;
  color: string;
}[] = [
  { category: 'Food', icon: '🍔', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { category: 'Travel', icon: '🚗', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { category: 'Shopping', icon: '🛍️', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { category: 'Rent', icon: '🏠', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { category: 'Bills', icon: '💡', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { category: 'Entertainment', icon: '🎬', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
  { category: 'Health', icon: '🏥', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { category: 'Education', icon: '📚', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { category: 'Other', icon: '📦', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  currencySymbol,
  currentMonth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Food');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDesc, setFormDesc] = useState<string>('');

  // Calculations
  const currentMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
  const totalMonthlyExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const allTimeExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Category distribution
  const categoryTotals: Record<ExpenseCategory, number> = {
    Food: 0,
    Travel: 0,
    Shopping: 0,
    Rent: 0,
    Bills: 0,
    Entertainment: 0,
    Health: 0,
    Education: 0,
    Other: 0,
  };
  currentMonthExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Filtered List
  const filteredExpenses = expenses.filter(e => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormCategory('Food');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Expense) => {
    setEditingExpense(item);
    setFormCategory(item.category);
    setFormAmount(item.amount.toString());
    setFormDate(item.date);
    setFormDesc(item.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (editingExpense) {
      onEditExpense({
        ...editingExpense,
        category: formCategory,
        amount: amountNum,
        date: formDate,
        description: formDesc || `${formCategory} Expense`,
      });
    } else {
      onAddExpense({
        userId: 'usr_default_01',
        category: formCategory,
        amount: amountNum,
        date: formDate,
        description: formDesc || `${formCategory} Expense`,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Expense Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Categorize and monitor daily expenditures, grocery runs, utilities, and discretionary spends.
          </p>
        </div>
        <button
          id="add-expense-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Expenses</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-blue-400 font-mono mt-2">
            {formatCurrency(totalMonthlyExpenses, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">August 2026 Outflow</p>
        </div>

        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lifetime Expenses</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono mt-2">
            {formatCurrency(allTimeExpenses, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{expenses.length} total transactions</p>
        </div>

        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Spending Category</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono mt-2">
            Rent (₹16,000)
          </p>
          <p className="text-xs text-slate-400 mt-1">Followed by Food (₹12,400)</p>
        </div>
      </div>

      {/* Category Breakdown Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        {CATEGORY_CONFIG.map(c => {
          const amount = categoryTotals[c.category] || 0;
          return (
            <div key={c.category} className={`p-3 rounded-xl border ${c.color} flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="text-base">{c.icon}</span>
                <span className="text-[10px] font-bold uppercase truncate">{c.category}</span>
              </div>
              <p className="text-xs font-extrabold font-mono text-white mt-2 truncate">
                {formatCurrency(amount, currencySymbol)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Controls & Table */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-expense-input"
              type="text"
              placeholder="Search description or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="filter-expense-category"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories</option>
              {CATEGORY_CONFIG.map(c => (
                <option key={c.category} value={c.category}>
                  {c.icon} {c.category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(item => {
                  const cfg = CATEGORY_CONFIG.find(c => c.category === item.category);
                  const isHighSpend = item.amount >= 10000;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{item.date}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          <span>{cfg?.icon || '📦'}</span>
                          <span>{item.category}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <span>{item.description}</span>
                          {isHighSpend && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                              High Value
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                        -{formatCurrency(item.amount, currencySymbol)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`edit-expense-${item.id}`}
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`delete-expense-${item.id}`}
                            onClick={() => onDeleteExpense(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingExpense ? 'Edit Expense' : 'Record New Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Expense Category</label>
                <select
                  id="modal-expense-category"
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {CATEGORY_CONFIG.map(c => (
                    <option key={c.category} value={c.category}>
                      {c.icon} {c.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount ({currencySymbol})</label>
                <input
                  id="modal-expense-amount"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 1500"
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                <input
                  id="modal-expense-date"
                  type="date"
                  required
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description / Store / Item</label>
                <input
                  id="modal-expense-desc"
                  type="text"
                  placeholder="e.g. Weekly grocery stock at Supermart"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  id="modal-expense-submit-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/20"
                >
                  {editingExpense ? 'Save Changes' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
