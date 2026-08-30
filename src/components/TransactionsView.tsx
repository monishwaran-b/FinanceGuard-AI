import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Trash2,
  Calendar,
  ArrowDownRight,
  ArrowUpRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Income, Expense } from '../types';
import { formatCurrency } from '../utils/currencies';
import { CATEGORY_CONFIG } from './ExpensesView';

interface TransactionsViewProps {
  incomes: Income[];
  expenses: Expense[];
  onDeleteIncome: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  currencySymbol: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  incomes,
  expenses,
  onDeleteIncome,
  onDeleteExpense,
  currencySymbol,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'Income' | 'Expense'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  // Unified list
  const allTransactions = [
    ...incomes.map(i => ({
      id: i.id,
      date: i.date,
      category: i.source,
      description: i.description || i.source,
      amount: i.amount,
      type: 'Income' as const,
      rawItem: i,
    })),
    ...expenses.map(e => ({
      id: e.id,
      date: e.date,
      category: e.category,
      description: e.description || e.category,
      amount: e.amount,
      type: 'Expense' as const,
      rawItem: e,
    })),
  ];

  // Filtering
  const filtered = allTransactions.filter(item => {
    const matchesSearch =
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesStart = !startDate || item.date >= startDate;
    const matchesEnd = !endDate || item.date <= endDate;

    return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = filtered.map(t => [
      t.date,
      t.type,
      `"${t.category}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinanceGuard_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (item: (typeof allTransactions)[0]) => {
    if (item.type === 'Income') {
      onDeleteIncome(item.id);
    } else {
      onDeleteExpense(item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Transaction History Ledger</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Comprehensive financial registry with search, multi-field filtering, sorting, and CSV export.
          </p>
        </div>
        <button
          id="export-csv-btn"
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="ledger-search-input"
              type="text"
              placeholder="Search by description or category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              id="ledger-type-filter"
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Types (Income &amp; Expense)</option>
              <option value="Income">Incomes Only</option>
              <option value="Expense">Expenses Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="ledger-category-filter"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Categories / Sources</option>
              <optgroup label="Income Sources">
                <option value="Salary">Salary</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Business">Business</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </optgroup>
              <optgroup label="Expense Categories">
                {CATEGORY_CONFIG.map(c => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              id="ledger-sort-filter"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="date-desc">Newest First (Date ↓)</option>
              <option value="date-asc">Oldest First (Date ↑)</option>
              <option value="amount-desc">Highest Amount (Amount ↓)</option>
              <option value="amount-asc">Lowest Amount (Amount ↑)</option>
            </select>
          </div>
        </div>

        {/* Date Range Row */}
        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Date Range:</span>
          </span>
          <input
            id="ledger-start-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs"
          />
          <span className="text-slate-500">to</span>
          <input
            id="ledger-end-date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs"
          />
          {(startDate || endDate || searchTerm || typeFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('ALL');
                setCategoryFilter('ALL');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs text-rose-400 hover:underline ml-auto"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Category / Source</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No transactions match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={`${t.type}-${t.id}`} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">{t.date}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.type === 'Income'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {t.type === 'Income' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{t.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-300">{t.category}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">{t.description}</td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                        t.type === 'Income' ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount, currencySymbol)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDelete(t)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
