import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PiggyBank,
  BrainCircuit,
  TrendingUp,
  Lightbulb,
  History,
  User,
  Settings,
  Code2,
  LogOut,
  Sparkles,
  ShieldCheck,
  PlayCircle,
  Globe,
} from 'lucide-react';
import { ActiveTab, User as UserType } from '../types';
import {
  LanguageCode,
  getTranslation,
} from '../utils/translations';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserType;
  unreadAlertsCount: number;
  onLogout: () => void;
  currentLanguage: LanguageCode;
  onOpenDemoVideo: () => void;
  onOpenTranslator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  user,
  unreadAlertsCount,
  onLogout,
  currentLanguage,
  onOpenDemoVideo,
  onOpenTranslator,
}) => {
  const t = (key: string) => getTranslation(currentLanguage, key);

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number; specialTag?: string }[] = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'income', label: t('income'), icon: Wallet },
    { id: 'expenses', label: t('expenses'), icon: Receipt },
    { id: 'budget', label: t('budget'), icon: PiggyBank, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
    { id: 'ai-analysis', label: t('aiAnalysis'), icon: BrainCircuit },
    { id: 'prediction', label: t('prediction'), icon: TrendingUp },
    { id: 'suggestions', label: t('suggestions'), icon: Lightbulb },
    { id: 'transactions', label: t('transactions'), icon: History },
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'settings', label: t('settings'), icon: Settings },
    { id: 'python-project', label: t('pythonProject'), icon: Code2, specialTag: 'ML Demo' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#111827] border-r border-[#1E293B] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">FinanceGuard</span>
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Smart Budget &amp; Expense Controller</p>
            </div>
          </div>
        </div>

        {/* Featured Actions: AI Demo Video & Language Hub */}
        <div className="px-3 pt-3 space-y-1.5">
          {/* Watch AI Demo Video */}
          <button
            id="sidebar-watch-demo-btn"
            onClick={() => {
              onOpenDemoVideo();
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-950/50 via-[#1E293B] to-teal-950/50 hover:from-emerald-950/80 hover:to-teal-950/80 text-emerald-400 border border-emerald-500/30 shadow-sm transition"
          >
            <div className="flex items-center gap-2.5">
              <PlayCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{t('demoVideo')}</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/30 text-emerald-300">
              Watch
            </span>
          </button>

          {/* AI Multi-Language Hub */}
          <button
            id="sidebar-translator-btn"
            onClick={() => {
              onOpenTranslator();
              if (window.innerWidth < 1024) setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] transition"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-teal-400" />
              <span>{t('translator')}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">12 Langs</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#1E293B]/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
                {item.specialTag && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                    {item.specialTag}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card & Sign Out */}
        <div className="p-4 border-t border-[#1E293B] bg-[#0F172A]">
          <div className="flex items-center justify-between">
            <button
              id="sidebar-profile-btn"
              onClick={() => {
                setActiveTab('profile');
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="flex items-center gap-3 text-left hover:opacity-80 transition flex-1 min-w-0"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </button>
            <button
              id="sidebar-logout-btn"
              onClick={onLogout}
              title={t('signOut')}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-[#1E293B] rounded-lg transition shrink-0 ml-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
