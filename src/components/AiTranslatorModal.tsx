import React, { useState } from 'react';
import {
  X,
  Globe,
  ArrowRightLeft,
  Sparkles,
  Copy,
  Check,
  Languages,
  BookOpen,
  Send,
  Zap,
} from 'lucide-react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslation,
} from '../utils/translations';

interface AiTranslatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

// Financial glossary dictionary across languages for quick lookup
const FINANCIAL_GLOSSARY: Record<string, Record<LanguageCode, string>> = {
  'Income': {
    en: 'Income',
    es: 'Ingresos',
    fr: 'Revenus',
    de: 'Einnahmen',
    hi: 'आय',
    ta: 'வருமானம்',
    zh: '收入',
    ja: '収入',
    ar: 'الدخل',
    pt: 'Renda',
    it: 'Entrate',
    ru: 'Доход',
  },
  'Expenses': {
    en: 'Expenses',
    es: 'Gastos',
    fr: 'Dépenses',
    de: 'Ausgaben',
    hi: 'खर्च',
    ta: 'செலவுகள்',
    zh: '支出',
    ja: '支出',
    ar: 'المصروفات',
    pt: 'Despesas',
    it: 'Spese',
    ru: 'Расходы',
  },
  'Budget': {
    en: 'Budget',
    es: 'Presupuesto',
    fr: 'Budget',
    de: 'Budget',
    hi: 'बजट',
    ta: 'பட்ஜெட்',
    zh: '预算',
    ja: '予算',
    ar: 'الميزانية',
    pt: 'Orçamento',
    it: 'Budget',
    ru: 'Бюджет',
  },
  'Savings': {
    en: 'Savings',
    es: 'Ahorros',
    fr: 'Épargne',
    de: 'Ersparnisse',
    hi: 'बचत',
    ta: 'சேமிப்பு',
    zh: '储蓄',
    ja: '貯蓄',
    ar: 'المدخرات',
    pt: 'Economias',
    it: 'Risparmi',
    ru: 'Сбережения',
  },
  'Linear Regression': {
    en: 'Linear Regression Forecast',
    es: 'Pronóstico de Regresión Lineal',
    fr: 'Prévision par Régression Linéaire',
    de: 'Lineare Regressionsprognose',
    hi: 'लीनियर रिग्रेशन पूर्वानुमान',
    ta: 'நேரியல் பின்னடைவு கணிப்பு',
    zh: '线性回归预测',
    ja: '線形回帰予測',
    ar: 'توقع الانحدار الخطي',
    pt: 'Previsão de Regressão Linear',
    it: 'Previsione Regressione Lineare',
    ru: 'Прогноз линейной регрессии',
  },
};

export const AiTranslatorModal: React.FC<AiTranslatorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
}) => {
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>(currentLanguage);
  const [inputText, setInputText] = useState('Monthly apartment rent paid via bank transfer, keeping expenses under budget.');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);

  if (!isOpen) return null;

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);

    // AI Translation Simulation
    setTimeout(() => {
      // Basic smart translation simulation
      const sampleMap: Record<LanguageCode, string> = {
        en: 'Monthly apartment rent paid via bank transfer, keeping expenses under budget.',
        es: 'Alquiler mensual del apartamento pagado mediante transferencia bancaria, manteniendo los gastos dentro del presupuesto.',
        fr: 'Loyer mensuel de l’appartement payé par virement bancaire, maintenant les dépenses dans les limites du budget.',
        de: 'Monatliche Wohnungsmiete per Banküberweisung bezahlt, wodurch die Ausgaben im Rahmen des Budgets bleiben.',
        hi: 'बैंक हस्तांतरण के माध्यम से मासिक अपार्टमेंट किराया का भुगतान किया गया, जिससे खर्च बजट के भीतर रहा।',
        ta: 'வங்கி பரிமாற்றம் மூலம் செலுத்தப்பட்ட மாதாந்திர அடுக்குமாடி வாடகை, செலவுகளை பட்ஜெட்டுக்குள் வைத்திருக்கிறது.',
        zh: '通过银行转账支付每月公寓租金，将各项支出严格控制在预算范围内。',
        ja: '銀行振込でアパートの家賃を支払い、支出を予算内に抑えました。',
        ar: 'تم دفع إيجار الشقة الشهري عبر التحويل المصرفي مع الحفاظ على النفقات ضمن حدود الميزانية.',
        pt: 'Aluguel mensal do apartamento pago via transferência bancária, mantendo os gastos dentro do orçamento.',
        it: 'Affitto mensile dell’appartamento pagato tramite bonifico bancario, mantenendo le spese entro il budget.',
        ru: 'Ежемесячная арендная плата за квартиру оплачена банковским переводом, расходы в пределах бюджета.',
      };

      setTranslatedText(sampleMap[targetLang] || `[${targetLang.toUpperCase()}]: ${inputText}`);
      setIsTranslating(false);
    }, 500);
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText(inputText);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Globe className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">AI Multi-Language Hub</h2>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                  12 Languages
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Switch app interface language &amp; translate financial notes with zero latency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global App Interface Language Switcher Grid */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Choose Global Application Language
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              Current: {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.nativeName}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`p-2.5 rounded-2xl border text-xs font-medium transition flex flex-col items-center gap-1 cursor-pointer ${
                  currentLanguage === lang.code
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10'
                    : 'bg-[#0A0E1A] border-[#1E293B] text-slate-400 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-semibold text-slate-200">{lang.nativeName}</span>
                <span className="text-[10px] text-slate-500">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Financial Note & Receipt AI Text Translator */}
        <div className="space-y-3 pt-2 border-t border-[#1E293B]">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Financial Note &amp; Receipt Translator</span>
            </div>
          </div>

          {/* Language Selectors & Swap */}
          <div className="flex items-center gap-3">
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value as LanguageCode)}
              className="flex-1 bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={`src-${l.code}`} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>

            <button
              onClick={handleSwap}
              className="p-2 rounded-xl bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Swap Languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value as LanguageCode)}
              className="flex-1 bg-[#0A0E1A] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={`tgt-${l.code}`} value={l.code}>
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Input & Output Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-400">
                Source Financial Text / Description
              </label>
              <textarea
                rows={3}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type or paste any transaction memo or receipt description..."
                className="w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-emerald-400">
                  AI Localized Translation
                </label>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full h-[76px] bg-[#0A0E1A] border border-[#1E293B] rounded-xl p-3 text-xs text-slate-200 overflow-y-auto">
                {translatedText ? (
                  translatedText
                ) : (
                  <span className="text-slate-500 italic">
                    Click "Translate Note" to generate localized financial text...
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTranslating ? 'Translating...' : 'Translate Financial Note'}</span>
            </button>
          </div>
        </div>

        {/* Financial Terms Multi-Lingual Glossary */}
        <div className="space-y-2 pt-2 border-t border-[#1E293B]">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>3. Instant Financial Terminology Reference ({currentLanguage.toUpperCase()})</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.keys(FINANCIAL_GLOSSARY).map(term => (
              <div
                key={term}
                className="p-2 rounded-xl bg-[#0A0E1A] border border-[#1E293B] text-[11px]"
              >
                <div className="text-slate-500">{term}</div>
                <div className="font-bold text-white">
                  {FINANCIAL_GLOSSARY[term][currentLanguage] || term}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
