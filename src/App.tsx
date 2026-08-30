/**
 * FinanceGuard AI – Smart Budget & Expense Controller
 * Core Application Entrypoint
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ActiveTab,
  Expense,
  Income,
  MonthlyBudget,
  User,
  AppSettings,
  NotificationAlert,
  ExpenseCategory,
  IncomeSource,
} from './types';
import { storageService, DEFAULT_USER, DEFAULT_SETTINGS } from './utils/storage';
import { calculateLinearRegression, generateAIInsights } from './utils/aiEngine';
import {
  LanguageCode,
  getTranslation,
} from './utils/translations';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { IncomeView } from './components/IncomeView';
import { ExpensesView } from './components/ExpensesView';
import { BudgetView } from './components/BudgetView';
import { AiAnalysisView } from './components/AiAnalysisView';
import { PredictionView } from './components/PredictionView';
import { SavingsView } from './components/SavingsView';
import { TransactionsView } from './components/TransactionsView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { PythonProjectModal } from './components/PythonProjectModal';
import { LoginPage } from './components/LoginPage';
import { AiDemoVideoModal } from './components/AiDemoVideoModal';
import { AiTranslatorModal } from './components/AiTranslatorModal';

export default function App() {
  // State Initialization
  const [user, setUser] = useState<User>(() => storageService.getUser());
  const [incomes, setIncomes] = useState<Income[]>(() => storageService.getIncomes());
  const [expenses, setExpenses] = useState<Expense[]>(() => storageService.getExpenses());
  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() => storageService.getBudgets());
  const [settings, setSettings] = useState<AppSettings>(() => storageService.getSettings());
  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => storageService.getNotifications());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => storageService.isLoggedIn());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New Modals: AI Demo Video & AI Translator
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState(false);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  // Global Quick Add Modals
  const [isQuickIncomeOpen, setIsQuickIncomeOpen] = useState(false);
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);

  // Quick Add Form States
  const [quickIncomeSource, setQuickIncomeSource] = useState<IncomeSource>('Salary');
  const [quickIncomeAmount, setQuickIncomeAmount] = useState('');
  const [quickIncomeDate, setQuickIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickIncomeDesc, setQuickIncomeDesc] = useState('');

  const [quickExpenseCategory, setQuickExpenseCategory] = useState<ExpenseCategory>('Food');
  const [quickExpenseAmount, setQuickExpenseAmount] = useState('');
  const [quickExpenseDate, setQuickExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickExpenseDesc, setQuickExpenseDesc] = useState('');

  const currentMonth = '2026-08';
  const currentLang = settings.language || 'en';
  const t = (key: string) => getTranslation(currentLang, key);

  // Persistence Effects
  useEffect(() => {
    storageService.saveUser(user);
  }, [user]);

  useEffect(() => {
    storageService.saveIncomes(incomes);
  }, [incomes]);

  useEffect(() => {
    storageService.saveExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    storageService.saveBudgets(budgets);
  }, [budgets]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    storageService.setLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  // Compute ML Regression & AI Insights
  const regressionPrediction = calculateLinearRegression(expenses, settings.currencySymbol);
  const { insights: aiInsights, financialHealthScore, anomalies } = generateAIInsights(
    incomes,
    expenses,
    budgets,
    currentMonth,
    settings.currencySymbol
  );

  const handleLanguageChange = (code: LanguageCode) => {
    setSettings(prev => ({
      ...prev,
      language: code,
    }));
  };

  // Automated Alert Check on Expense / Budget update
  const checkAndTriggerAlerts = (newExpenses: Expense[], currentBudgets: MonthlyBudget[]) => {
    const activeBudget = currentBudgets.find(b => b.month === currentMonth) || currentBudgets[0];
    if (!activeBudget) return;

    const totalSpent = newExpenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    const usagePct = Math.round((totalSpent / (activeBudget.overallBudget || 1)) * 100);

    if (usagePct >= 100) {
      const exists = notifications.some(n => n.title.includes('Budget Exceeded'));
      if (!exists) {
        const newAlert: NotificationAlert = {
          id: `alt_${Date.now()}`,
          title: `🚨 Overall Budget Exceeded (${usagePct}%)`,
          message: `Warning! You have used ${usagePct}% (${settings.currencySymbol}${totalSpent.toLocaleString()}) of your ${settings.currencySymbol}${activeBudget.overallBudget.toLocaleString()} limit.`,
          type: 'danger',
          timestamp: 'Just now',
          read: false,
        };
        setNotifications(prev => [newAlert, ...prev]);
      }
    } else if (usagePct >= settings.warningThreshold) {
      const exists = notifications.some(n => n.title.includes('Threshold Reached'));
      if (!exists) {
        const newAlert: NotificationAlert = {
          id: `alt_${Date.now()}`,
          title: `⚠️ Budget Warning (${usagePct}% Used)`,
          message: `Notice! Spending has reached ${usagePct}% of your monthly ${settings.currencySymbol}${activeBudget.overallBudget.toLocaleString()} allocation.`,
          type: 'warning',
          timestamp: 'Just now',
          read: false,
        };
        setNotifications(prev => [newAlert, ...prev]);
      }
    }
  };

  // CRUD Incomes
  const handleAddIncome = (incomeData: Omit<Income, 'id' | 'createdAt'>) => {
    const newEntry: Income = {
      ...incomeData,
      id: `inc_${Date.now()}`,
      createdAt: Date.now(),
    };
    setIncomes(prev => [newEntry, ...prev]);
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
  };

  const handleEditIncome = (updated: Income) => {
    setIncomes(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // CRUD Expenses
  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newEntry: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      createdAt: Date.now(),
    };
    const updated = [newEntry, ...expenses];
    setExpenses(updated);
    checkAndTriggerAlerts(updated, budgets);
  };

  const handleEditExpense = (updated: Expense) => {
    const newExpenses = expenses.map(e => (e.id === updated.id ? updated : e));
    setExpenses(newExpenses);
    checkAndTriggerAlerts(newExpenses, budgets);
  };

  const handleDeleteExpense = (id: string) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);
  };

  // CRUD Budgets
  const handleUpdateBudget = (updated: MonthlyBudget) => {
    setBudgets(prev => {
      const idx = prev.findIndex(b => b.month === updated.month);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
    checkAndTriggerAlerts(expenses, [updated]);
  };

  // Alerts Management
  const handleMarkAllAlertsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAlert = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Data Reset
  const handleResetData = () => {
    storageService.resetAllData();
    setUser(storageService.getUser());
    setIncomes(storageService.getIncomes());
    setExpenses(storageService.getExpenses());
    setBudgets(storageService.getBudgets());
    setSettings(storageService.getSettings());
    setNotifications(storageService.getNotifications());
    setIsLoggedIn(true);
  };

  // Submit Quick Income Modal
  const handleQuickIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickIncomeAmount);
    if (isNaN(val) || val <= 0) return;
    handleAddIncome({
      userId: user.id,
      source: quickIncomeSource,
      amount: val,
      date: quickIncomeDate,
      description: quickIncomeDesc || `${quickIncomeSource} Income`,
    });
    setQuickIncomeAmount('');
    setQuickIncomeDesc('');
    setIsQuickIncomeOpen(false);
  };

  // Submit Quick Expense Modal
  const handleQuickExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickExpenseAmount);
    if (isNaN(val) || val <= 0) return;
    handleAddExpense({
      userId: user.id,
      category: quickExpenseCategory,
      amount: val,
      date: quickExpenseDate,
      description: quickExpenseDesc || `${quickExpenseCategory} Expense`,
    });
    setQuickExpenseAmount('');
    setQuickExpenseDesc('');
    setIsQuickExpenseOpen(false);
  };

  // Current Month Totals for Profile
  const totalCurrentIncome = incomes
    .filter(i => i.date.startsWith(currentMonth))
    .reduce((s, i) => s + i.amount, 0);
  const totalCurrentExpense = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((s, e) => s + e.amount, 0);
  const totalCurrentSavings = totalCurrentIncome - totalCurrentExpense;

  const tabTitles: Record<ActiveTab, string> = {
    dashboard: t('dashboard'),
    income: t('income'),
    expenses: t('expenses'),
    budget: t('budget'),
    'ai-analysis': t('aiAnalysis'),
    prediction: t('prediction'),
    suggestions: t('suggestions'),
    transactions: t('transactions'),
    profile: t('profile'),
    settings: t('settings'),
    'python-project': t('pythonProject'),
    translator: t('translator'),
    'demo-video': t('demoVideo'),
  };

  // If user is not logged in, render the comprehensive, multi-language LoginPage
  if (!isLoggedIn) {
    return (
      <>
        <LoginPage
          onLoginSuccess={usr => {
            setUser(usr);
            setIsLoggedIn(true);
          }}
          onSignupSuccess={usr => {
            setUser(usr);
            setIsLoggedIn(true);
          }}
          currentLanguage={currentLang}
          onLanguageChange={handleLanguageChange}
          onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
        />
        <AiDemoVideoModal
          isOpen={isDemoVideoOpen}
          onClose={() => setIsDemoVideoOpen(false)}
          currentLanguage={currentLang}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 antialiased font-sans">
      {/* Main Layout */}
      <div className="flex min-h-screen bg-[#0A0E1A]">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          user={user}
          unreadAlertsCount={notifications.filter(n => !n.read).length}
          onLogout={() => setIsLoggedIn(false)}
          currentLanguage={currentLang}
          onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
          onOpenTranslator={() => setIsTranslatorOpen(true)}
        />

        {/* Content Container */}
        <div className="flex-1 lg:ml-72 flex flex-col min-w-0 bg-[#0A0E1A]">
          {/* Top Navbar */}
          <Navbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            notifications={notifications}
            onMarkAllAlertsRead={handleMarkAllAlertsRead}
            onClearAlert={handleClearAlert}
            onOpenAddIncome={() => setIsQuickIncomeOpen(true)}
            onOpenAddExpense={() => setIsQuickExpenseOpen(true)}
            settings={settings}
            onUpdateSettings={setSettings}
            activeTabTitle={tabTitles[activeTab] || 'FinanceGuard AI'}
            onOpenDemoVideo={() => setIsDemoVideoOpen(true)}
            onOpenTranslator={() => setIsTranslatorOpen(true)}
          />

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto bg-[#0A0E1A]">
            {activeTab === 'dashboard' && (
              <DashboardView
                incomes={incomes}
                expenses={expenses}
                budgets={budgets}
                currentMonth={currentMonth}
                currencySymbol={settings.currencySymbol}
                prediction={regressionPrediction}
                aiInsights={aiInsights}
                setActiveTab={setActiveTab}
                onOpenAddIncome={() => setIsQuickIncomeOpen(true)}
                onOpenAddExpense={() => setIsQuickExpenseOpen(true)}
              />
            )}

            {activeTab === 'income' && (
              <IncomeView
                incomes={incomes}
                onAddIncome={handleAddIncome}
                onEditIncome={handleEditIncome}
                onDeleteIncome={handleDeleteIncome}
                currencySymbol={settings.currencySymbol}
                currentMonth={currentMonth}
              />
            )}

            {activeTab === 'expenses' && (
              <ExpensesView
                expenses={expenses}
                onAddExpense={handleAddExpense}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
                currencySymbol={settings.currencySymbol}
                currentMonth={currentMonth}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetView
                budgets={budgets}
                expenses={expenses}
                onUpdateBudget={handleUpdateBudget}
                currencySymbol={settings.currencySymbol}
                currentMonth={currentMonth}
              />
            )}

            {activeTab === 'ai-analysis' && (
              <AiAnalysisView
                incomes={incomes}
                expenses={expenses}
                budgets={budgets}
                insights={aiInsights}
                financialHealthScore={financialHealthScore}
                anomalies={anomalies}
                currencySymbol={settings.currencySymbol}
                currentMonth={currentMonth}
              />
            )}

            {activeTab === 'prediction' && (
              <PredictionView
                prediction={regressionPrediction}
                expenses={expenses}
                currencySymbol={settings.currencySymbol}
              />
            )}

            {activeTab === 'suggestions' && (
              <SavingsView
                incomes={incomes}
                expenses={expenses}
                currencySymbol={settings.currencySymbol}
                currentMonth={currentMonth}
              />
            )}

            {activeTab === 'transactions' && (
              <TransactionsView
                incomes={incomes}
                expenses={expenses}
                onDeleteIncome={handleDeleteIncome}
                onDeleteExpense={handleDeleteExpense}
                currencySymbol={settings.currencySymbol}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                user={user}
                onUpdateUser={setUser}
                currencySymbol={settings.currencySymbol}
                totalMonthlyIncome={totalCurrentIncome}
                totalMonthlySavings={totalCurrentSavings}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={setSettings}
                onResetData={handleResetData}
                onOpenTranslator={() => setIsTranslatorOpen(true)}
              />
            )}

            {activeTab === 'python-project' && <PythonProjectModal />}
          </main>
        </div>
      </div>

      {/* Interactive AI Demo Video Modal */}
      <AiDemoVideoModal
        isOpen={isDemoVideoOpen}
        onClose={() => setIsDemoVideoOpen(false)}
        currentLanguage={currentLang}
      />

      {/* AI Multi-Language Hub & Translator Modal */}
      <AiTranslatorModal
        isOpen={isTranslatorOpen}
        onClose={() => setIsTranslatorOpen(false)}
        currentLanguage={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Global Quick Add Income Modal */}
      {isQuickIncomeOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Quick Add Income</h3>
              <button
                onClick={() => setIsQuickIncomeOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleQuickIncomeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Source</label>
                <select
                  value={quickIncomeSource}
                  onChange={e => setQuickIncomeSource(e.target.value as IncomeSource)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Salary">Salary</option>
                  <option value="Freelancing">Freelancing</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 25000"
                  value={quickIncomeAmount}
                  onChange={e => setQuickIncomeAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={quickIncomeDate}
                  onChange={e => setQuickIncomeDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Client consultation fee"
                  value={quickIncomeDesc}
                  onChange={e => setQuickIncomeDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuickIncomeOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                >
                  Save Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Quick Add Expense Modal */}
      {isQuickExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Quick Record Expense</h3>
              <button
                onClick={() => setIsQuickExpenseOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleQuickExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={quickExpenseCategory}
                  onChange={e => setQuickExpenseCategory(e.target.value as ExpenseCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Food">🍔 Food</option>
                  <option value="Travel">🚗 Travel</option>
                  <option value="Shopping">🛍️ Shopping</option>
                  <option value="Rent">🏠 Rent</option>
                  <option value="Bills">💡 Bills</option>
                  <option value="Entertainment">🎬 Entertainment</option>
                  <option value="Health">🏥 Health</option>
                  <option value="Education">📚 Education</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1200"
                  value={quickExpenseAmount}
                  onChange={e => setQuickExpenseAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={quickExpenseDate}
                  onChange={e => setQuickExpenseDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner with colleagues"
                  value={quickExpenseDesc}
                  onChange={e => setQuickExpenseDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsQuickExpenseOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
