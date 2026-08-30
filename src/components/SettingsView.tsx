import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Coins,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Database,
  Globe,
  Languages,
} from 'lucide-react';
import { AppSettings } from '../types';
import { CURRENCIES } from '../utils/currencies';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslation,
} from '../utils/translations';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetData: () => void;
  onOpenTranslator?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onOpenTranslator,
}) => {
  const [threshold, setThreshold] = useState(settings.warningThreshold.toString());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentLang = settings.language || 'en';
  const t = (key: string) => getTranslation(currentLang, key);

  const handleCurrencyChange = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      onUpdateSettings({
        ...settings,
        currency: found.code,
        currencySymbol: found.symbol,
      });
      triggerSaved();
    }
  };

  const handleLanguageChange = (code: LanguageCode) => {
    onUpdateSettings({
      ...settings,
      language: code,
    });
    triggerSaved();
  };

  const handleToggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: next });
    triggerSaved();
  };

  const handleToggleSound = () => {
    onUpdateSettings({ ...settings, enableSoundAlerts: !settings.enableSoundAlerts });
    triggerSaved();
  };

  const handleToggleAi = () => {
    onUpdateSettings({ ...settings, enableAiPredictions: !settings.enableAiPredictions });
    triggerSaved();
  };

  const handleThresholdSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(threshold, 10);
    if (!isNaN(val) && val >= 50 && val <= 95) {
      onUpdateSettings({ ...settings, warningThreshold: val });
      triggerSaved();
    }
  };

  const triggerSaved = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">{t('settings')}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure multi-language localization, display currency, alert triggers, theme preferences, and data synchronization.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Settings saved and applied in real-time.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Language Selection Card */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Language &amp; Localization</span>
            </div>
            {onOpenTranslator && (
              <button
                onClick={onOpenTranslator}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Languages className="w-3 h-3" />
                <span>AI Translator</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Select from 12 supported global and regional languages for the entire interface.
          </p>
          <select
            id="settings-language-select"
            value={currentLang}
            onChange={e => handleLanguageChange(e.target.value as LanguageCode)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.nativeName} ({l.name})
              </option>
            ))}
          </select>
        </div>

        {/* Currency Selection */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Default Display Currency</span>
          </div>
          <p className="text-xs text-slate-400">
            Select your preferred currency symbol across all dashboard summaries and reports.
          </p>
          <select
            id="settings-currency-select"
            value={settings.currency}
            onChange={e => handleCurrencyChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Preference */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>Theme Mode</span>
          </div>
          <p className="text-xs text-slate-400">
            Switch between dark professional finance canvas and high contrast light mode.
          </p>
          <button
            id="toggle-theme-btn"
            onClick={handleToggleTheme}
            className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition flex items-center justify-center gap-2"
          >
            <span>Current: {settings.theme === 'dark' ? 'Dark Navy Canvas 🌙' : 'Light Canvas ☀️'}</span>
          </button>
        </div>

        {/* Alert Threshold */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Bell className="w-4 h-4 text-rose-400" />
            <span>Budget Warning Threshold</span>
          </div>
          <p className="text-xs text-slate-400">
            Trigger automated warning notifications when monthly spending reaches this percentage.
          </p>
          <form onSubmit={handleThresholdSave} className="flex gap-2">
            <input
              id="settings-threshold-input"
              type="number"
              min="50"
              max="95"
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700"
            >
              Update %
            </button>
          </form>
        </div>

        {/* AI & Sound Options */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Predictive Options</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-300">Linear Regression Predictions</span>
              <button
                id="toggle-ai-btn"
                onClick={handleToggleAi}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  settings.enableAiPredictions
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {settings.enableAiPredictions ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-300">Sound Audio Cues for Thresholds</span>
              <button
                id="toggle-sound-btn"
                onClick={handleToggleSound}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  settings.enableSoundAlerts
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {settings.enableSoundAlerts ? 'Active' : 'Muted'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Data Danger Zone */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">Reset Database &amp; Reseed Demo Data</h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Restores the application to initial sample state with 5-month realistic financial data.
          </p>
        </div>
        <button
          id="reset-database-btn"
          onClick={() => {
            if (window.confirm('Reset all financial logs and re-seed default sample data?')) {
              onResetData();
            }
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/20"
        >
          Reset to Sample Data
        </button>
      </div>
    </div>
  );
};
