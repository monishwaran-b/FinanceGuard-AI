import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  Briefcase,
  TrendingUp,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { Income, IncomeSource } from '../types';
import { formatCurrency } from '../utils/currencies';

interface IncomeViewProps {
  incomes: Income[];
  onAddIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  onEditIncome: (income: Income) => void;
  onDeleteIncome: (id: string) => void;
  currencySymbol: string;
  currentMonth: string;
}

const SOURCES: { source: IncomeSource; icon: string; color: string }[] = [
  { source: 'Salary', icon: '💼', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { source: 'Freelancing', icon: '💻', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { source: 'Business', icon: '🏢', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { source: 'Investment', icon: '📈', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { source: 'Other', icon: '✨', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export const IncomeView: React.FC<IncomeViewProps> = ({
  incomes,
  onAddIncome,
  onEditIncome,
  onDeleteIncome,
  currencySymbol,
  currentMonth,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Form State
  const [formSource, setFormSource] = useState<IncomeSource>('Salary');
  const [formAmount, setFormAmount] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formDesc, setFormDesc] = useState<string>('');

  // Calculations
  const currentMonthIncomes = incomes.filter(i => i.date.startsWith(currentMonth));
  const totalMonthlyIncome = currentMonthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const allTimeIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  // Source distribution
  const sourceTotals: Record<IncomeSource, number> = {
    Salary: 0,
    Freelancing: 0,
    Business: 0,
    Investment: 0,
    Other: 0,
  };
  currentMonthIncomes.forEach(i => {
    sourceTotals[i.source] = (sourceTotals[i.source] || 0) + i.amount;
  });

  // Filtered List
  const filteredIncomes = incomes.filter(i => {
    const matchesSearch =
      i.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'ALL' || i.source === selectedSource;
    return matchesSearch && matchesSource;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenAdd = () => {
    setEditingIncome(null);
    setFormSource('Salary');
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDesc('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Income) => {
    setEditingIncome(item);
    setFormSource(item.source);
    setFormAmount(item.amount.toString());
    setFormDate(item.date);
    setFormDesc(item.description);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (editingIncome) {
      onEditIncome({
        ...editingIncome,
        source: formSource,
        amount: amountNum,
        date: formDate,
        description: formDesc || `${formSource} Income`,
      });
    } else {
      onAddIncome({
        userId: 'usr_default_01',
        source: formSource,
        amount: amountNum,
        date: formDate,
        description: formDesc || `${formSource} Income`,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Income Management</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track revenue streams, freelance contracts, salary credits, and investment dividends.
          </p>
        </div>
        <button
          id="add-income-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Income</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Monthly Income</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-emerald-400 font-mono mt-2">
            {formatCurrency(totalMonthlyIncome, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">August 2026 Inflow</p>
        </div>

        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Lifetime Income</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-white font-mono mt-2">
            {formatCurrency(allTimeIncome, currencySymbol)}
          </p>
          <p className="text-xs text-slate-400 mt-1">{incomes.length} total entries recorded</p>
        </div>

        <div className="p-5 rounded-2xl glass-card relative">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Stream</span>
          <p className="text-2xl lg:text-3xl font-extrabold text-blue-400 font-mono mt-2">
            Salary (₹70k)
          </p>
          <p className="text-xs text-slate-400 mt-1">77% of monthly revenue</p>
        </div>
      </div>

      {/* Source Distribution Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SOURCES.map(s => {
          const amount = sourceTotals[s.source] || 0;
          return (
            <div key={s.source} className={`p-3.5 rounded-xl border ${s.color}`}>
              <div className="flex items-center justify-between">
                <span className="text-lg">{s.icon}</span>
                <span className="text-[11px] font-bold uppercase">{s.source}</span>
              </div>
              <p className="text-sm font-extrabold font-mono text-white mt-2">
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
              id="search-income-input"
              type="text"
              placeholder="Search description or source..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              id="filter-income-source"
              value={selectedSource}
              onChange={e => setSelectedSource(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Sources</option>
              <option value="Salary">Salary</option>
              <option value="Freelancing">Freelancing</option>
              <option value="Business">Business</option>
              <option value="Investment">Investment</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Incomes Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No income records found.
                  </td>
                </tr>
              ) : (
                filteredIncomes.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{item.date}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {item.source}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-200">{item.description}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      +{formatCurrency(item.amount, currencySymbol)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`edit-income-${item.id}`}
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-income-${item.id}`}
                          onClick={() => onDeleteIncome(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Income Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingIncome ? 'Edit Income Entry' : 'Add New Income Entry'}
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Income Source</label>
                <select
                  id="modal-income-source"
                  value={formSource}
                  onChange={e => setFormSource(e.target.value as IncomeSource)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Salary">Salary</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Amount ({currencySymbol})</label>
                <input
                  id="modal-income-amount"
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 50000"
                  value={formAmount}
                  onChange={e => setFormAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
                <input
                  id="modal-income-date"
                  type="date"
                  required
                  value={formDate}
                  onChange={e => setFormDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description / Note</label>
                <input
                  id="modal-income-desc"
                  type="text"
                  placeholder="e.g. Monthly salary from Tech Corp"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  id="modal-income-submit-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-lg shadow-emerald-500/20"
                >
                  {editingIncome ? 'Save Changes' : 'Save Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
