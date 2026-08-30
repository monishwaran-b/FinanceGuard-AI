import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Plus,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  PlayCircle,
  Globe,
  ChevronDown,
  Languages,
} from 'lucide-react';
import { NotificationAlert, AppSettings } from '../types';
import { CURRENCIES } from '../utils/currencies';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslation,
} from '../utils/translations';

interface NavbarProps {
  onToggleSidebar: () => void;
  notifications: NotificationAlert[];
  onMarkAllAlertsRead: () => void;
  onClearAlert: (id: string) => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  activeTabTitle: string;
  onOpenDemoVideo: () => void;
  onOpenTranslator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  notifications,
  onMarkAllAlertsRead,
  onClearAlert,
  onOpenAddIncome,
  onOpenAddExpense,
  settings,
  onUpdateSettings,
  activeTabTitle,
  onOpenDemoVideo,
  onOpenTranslator,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const currentLang = settings.language || 'en';
  const t = (key: string) => getTranslation(currentLang, key);
  const selectedLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLang) ||
    SUPPORTED_LANGUAGES[0];

  const handleCurrencyChange = (newCode: string) => {
    const found = CURRENCIES.find(c => c.code === newCode);
    if (found) {
      onUpdateSettings({
        ...settings,
        currency: found.code,
        currencySymbol: found.symbol,
      });
    }
  };

  const handleLanguageSelect = (code: LanguageCode) => {
    onUpdateSettings({
      ...settings,
      language: code,
    });
    setShowLangDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#0F172A]/90 backdrop-blur-xl border-b border-[#1E293B] px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="mobile-menu-toggle"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base lg:text-lg font-bold text-white tracking-tight">{activeTabTitle}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">Real-time Budget &amp; AI Intelligence Monitor</p>
        </div>
      </div>

      {/* Right: AI Demo Video, Multi-Language, Currency, Quick Add, Notifications */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Watch AI Demo Video Button */}
        <button
          id="navbar-demo-video-btn"
          onClick={onOpenDemoVideo}
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition shadow-sm"
          title="Watch AI Demo Video"
        >
          <PlayCircle className="w-3.5 h-3.5 animate-pulse" />
          <span>{t('demoVideo')}</span>
        </button>

        {/* Multi-Language Dropdown Selector */}
        <div className="relative">
          <button
            id="navbar-language-btn"
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-[#1E293B] border border-slate-700/70 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition shadow-sm"
            title="Switch Language"
          >
            <span className="text-sm sm:text-base leading-none">{selectedLangObj.flag}</span>
            <span className="hidden md:inline">{selectedLangObj.nativeName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl bg-[#111827] border border-[#1E293B] shadow-2xl z-50 p-1.5 divide-y divide-[#1E293B]/70">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>{t('switchLanguage')}</span>
                <button
                  onClick={onOpenTranslator}
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[10px]"
                >
                  <Languages className="w-3 h-3" />
                  <span>AI Hub</span>
                </button>
              </div>
              <div className="py-1 space-y-0.5">
                {SUPPORTED_LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      currentLang === lang.code
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

        {/* Currency Selector */}
        <div className="relative">
          <select
            id="currency-selector"
            value={settings.currency}
            onChange={e => handleCurrencyChange(e.target.value)}
            className="bg-[#1E293B] text-slate-200 text-xs font-semibold rounded-xl px-2.5 sm:px-3 py-2 border border-slate-700/70 focus:outline-none focus:border-emerald-500 hover:bg-slate-800 cursor-pointer transition shadow-sm"
          >
            {CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code} className="bg-[#0F172A] text-white">
                {curr.symbol} {curr.code}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Add Income Button */}
        <button
          id="quick-add-income-btn"
          onClick={onOpenAddIncome}
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition shadow-sm"
        >
          <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
          <span>{t('quickIncome')}</span>
        </button>

        {/* Quick Add Expense Button */}
        <button
          id="quick-add-expense-btn"
          onClick={onOpenAddExpense}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('quickExpense')}</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-[#1E293B] border border-slate-700/70 text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-sm"
            aria-label="View alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div
              id="notifications-panel"
              className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-[#111827] border border-[#1E293B] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3.5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">{t('smartAlerts')}</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    id="mark-all-read-btn"
                    onClick={onMarkAllAlertsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition"
                  >
                    {t('markAllRead')}
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#1E293B]/70">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto mb-2" />
                    {t('noAlerts')}
                  </div>
                ) : (
                  notifications.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-3.5 flex items-start gap-3 transition ${
                        !alert.read ? 'bg-[#1E293B]/50' : 'bg-transparent'
                      }`}
                    >
                      <div className="mt-0.5">
                        {alert.type === 'danger' && (
                          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {alert.type === 'warning' && (
                          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {alert.type === 'safe' && (
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {alert.type === 'info' && (
                          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            <Info className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-200 truncate">{alert.title}</p>
                          <span className="text-[10px] text-slate-500 shrink-0">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{alert.message}</p>
                      </div>
                      <button
                        onClick={() => onClearAlert(alert.id)}
                        className="text-slate-500 hover:text-slate-300 p-1"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
