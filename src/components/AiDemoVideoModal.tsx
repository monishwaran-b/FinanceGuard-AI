import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  BrainCircuit,
  TrendingUp,
  ShieldAlert,
  PiggyBank,
  CheckCircle2,
  Layers,
  Zap,
  Sliders,
  Radio,
  FileText,
  Activity,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  LanguageCode,
  getTranslation,
} from '../utils/translations';

interface AiDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  currencySymbol?: string;
}

interface DemoChapter {
  id: number;
  title: string;
  duration: number; // in seconds
  icon: React.ElementType;
  narration: string;
  badge: string;
}

export const AiDemoVideoModal: React.FC<AiDemoVideoModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  currencySymbol = '₹',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScriptGenerator, setShowScriptGenerator] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('tech-pro');
  const [isGeneratingCustomScript, setIsGeneratingCustomScript] = useState(false);
  const [customScriptGenerated, setCustomScriptGenerated] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const t = (key: string) => getTranslation(currentLanguage, key);

  // 4 Core Demo Chapters (Total duration: 40 seconds)
  const chapters: DemoChapter[] = [
    {
      id: 1,
      title: t('chapter1'),
      duration: 10,
      icon: Layers,
      badge: 'Live Dashboard',
      narration: `Welcome to FinanceGuard AI. The real-time financial command center tracks your income, categorized expenses, and dynamic health score with zero-latency synchronization.`,
    },
    {
      id: 2,
      title: t('chapter2'),
      duration: 10,
      icon: TrendingUp,
      badge: 'Scikit-Learn ML',
      narration: `Our Machine Learning model applies linear regression across historical spending to forecast next month expenses with 94.2% confidence and mathematical accuracy.`,
    },
    {
      id: 3,
      title: t('chapter3'),
      duration: 10,
      icon: ShieldAlert,
      badge: 'Anomaly Radar',
      narration: `The intelligent anomaly engine constantly scans category budgets. When sudden dining or shopping spikes exceed 80%, immediate actionable alerts are dispatched.`,
    },
    {
      id: 4,
      title: t('chapter4'),
      duration: 10,
      icon: PiggyBank,
      badge: 'Autonomous AI',
      narration: `Autonomous smart savings algorithms calculate surplus cashflow and optimize recurring bills to help you achieve your monthly wealth goals ahead of schedule.`,
    },
  ];

  const totalDuration = chapters.reduce((sum, ch) => sum + ch.duration, 0);

  // Determine current chapter index
  const getCurrentChapter = (time: number) => {
    let accumulated = 0;
    for (let i = 0; i < chapters.length; i++) {
      accumulated += chapters[i].duration;
      if (time <= accumulated) return { chapter: chapters[i], index: i, progressInChapter: (time - (accumulated - chapters[i].duration)) / chapters[i].duration };
    }
    return { chapter: chapters[chapters.length - 1], index: chapters.length - 1, progressInChapter: 1 };
  };

  const currentChapterInfo = getCurrentChapter(currentTime);

  // Playback timer loop
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return Math.min(prev + 0.1 * playbackSpeed, totalDuration);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, playbackSpeed, totalDuration]);

  // Voice Narration trigger on chapter change
  const currentChapterIndex = currentChapterInfo.index;
  useEffect(() => {
    if (!isOpen || !isPlaying || !isVoiceEnabled || isMuted) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const currentChapter = chapters[currentChapterIndex];
      const utterance = new SpeechSynthesisUtterance(currentChapter.narration);
      utterance.rate = 1.05 * playbackSpeed;
      utterance.pitch = 1.0;
      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [currentChapterIndex, isOpen, isPlaying, isVoiceEnabled, isMuted, playbackSpeed]);

  // Stop speech when closing modal
  useEffect(() => {
    if (!isOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  // Audio Waveform Canvas Animation
  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (isPlaying && !isMuted) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#10B981';
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.sin(x * 0.05 + phase) *
              12 *
              Math.sin(x * 0.02 + phase * 0.5) *
              (isPlaying ? 1 : 0.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary cyan harmonic wave
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y =
            height / 2 +
            Math.cos(x * 0.04 - phase * 0.8) *
              8 *
              (isPlaying ? 1 : 0.2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        phase += 0.08 * playbackSpeed;
      } else {
        // Flatline
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isOpen, isPlaying, isMuted, playbackSpeed]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setCurrentTime(pos * totalDuration);
  };

  const handleChapterJump = (chapterIndex: number) => {
    let targetTime = 0;
    for (let i = 0; i < chapterIndex; i++) {
      targetTime += chapters[i].duration;
    }
    setCurrentTime(targetTime + 0.1);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGeneratePersonaDemo = () => {
    setIsGeneratingCustomScript(true);
    setTimeout(() => {
      setIsGeneratingCustomScript(false);
      setCustomScriptGenerated(true);
      setCurrentTime(0);
      setIsPlaying(true);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div
        ref={videoContainerRef}
        className="w-full max-w-5xl bg-[#0A0E1A] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative"
      >
        {/* Top Video Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E293B] bg-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
              <BrainCircuit className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  FinanceGuard AI Demo Showcase
                </span>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Generated Video
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive Multi-Chapter Machine Learning System Demonstration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="toggle-custom-script-btn"
              onClick={() => setShowScriptGenerator(!showScriptGenerator)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Custom AI Script</span>
            </button>
            <button
              id="close-demo-video-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
              aria-label="Close Video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Script Generator Drawer (if open) */}
        {showScriptGenerator && (
          <div className="p-4 bg-[#111827] border-b border-[#1E293B] transition-all space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Demo Script &amp; Persona Generator</span>
              </div>
              <button
                onClick={() => setShowScriptGenerator(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select a financial profile to customize the interactive video walkthrough narrative:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'tech-pro', label: 'Tech Professional', desc: 'High Income, Variable Freelance & Stock Yields' },
                { id: 'student', label: 'College Student', desc: 'Tight Budget, Rent & Study Expenses' },
                { id: 'freelancer', label: 'Creative Freelancer', desc: 'Volatile Inflows, Client Invoices' },
                { id: 'family', label: 'Family Household', desc: 'Mortgage, Groceries, Child Care' },
              ].map(persona => (
                <button
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona.id)}
                  className={`p-2.5 text-left rounded-xl border text-xs transition ${
                    selectedPersona === persona.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                      : 'bg-[#0A0E1A] border-[#1E293B] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{persona.label}</div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{persona.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {customScriptGenerated
                  ? 'Customized scenario loaded! Playing synthesized demo.'
                  : 'Ready to re-compile demonstration sequence.'}
              </span>
              <button
                onClick={handleGeneratePersonaDemo}
                disabled={isGeneratingCustomScript}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                {isGeneratingCustomScript ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling Script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate &amp; Run Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Video Canvas Stage / Screen */}
        <div className="relative aspect-video w-full bg-gradient-to-b from-[#0F172A] to-[#0A0E1A] flex flex-col justify-between p-4 sm:p-8 overflow-hidden select-none">
          
          {/* Animated Background Particle Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Top Video Overlay: Chapter Title & Live Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 bg-[#0F172A]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#1E293B]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-slate-200">
                {currentChapterInfo.chapter.title}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#1E293B] text-[11px] text-emerald-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{currentChapterInfo.chapter.badge}</span>
            </div>
          </div>

          {/* Center Stage: Dynamic Chapter Visualizer Animations */}
          <div className="relative z-10 my-auto flex flex-col items-center justify-center">
            
            {/* SCENE 1: Real-Time Dashboard & Health Score */}
            {currentChapterInfo.index === 0 && (
              <div className="w-full max-w-lg bg-[#111827]/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-300">Financial Command Center</div>
                  <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                    Health Score: 88/100
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E293B]">
                    <div className="text-[10px] text-slate-400">Total Income</div>
                    <div className="text-sm font-extrabold text-emerald-400">{currencySymbol}90,700</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E293B]">
                    <div className="text-[10px] text-slate-400">Total Expenses</div>
                    <div className="text-sm font-extrabold text-rose-400">{currencySymbol}43,850</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0A0E1A] border border-[#1E293B]">
                    <div className="text-[10px] text-slate-400">Net Savings</div>
                    <div className="text-sm font-extrabold text-teal-400">{currencySymbol}46,850</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Monthly Budget Limit ({currencySymbol}55,000)</span>
                    <span className="text-emerald-400 font-bold">79.7% Used (Safe)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
                      style={{ width: `${Math.min(currentChapterInfo.progressInChapter * 100, 79.7)}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: Machine Learning Linear Regression */}
            {currentChapterInfo.index === 1 && (
              <div className="w-full max-w-lg bg-[#111827]/90 border border-teal-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <BrainCircuit className="w-4 h-4 text-teal-400" />
                    <span>ML Regression Forecast Engine</span>
                  </div>
                  <div className="text-xs text-teal-400 font-bold">R² = 0.88 (Strong Fit)</div>
                </div>

                {/* Regression Mathematical Plot Simulation */}
                <div className="h-32 w-full bg-[#0A0E1A] border border-[#1E293B] rounded-xl relative p-3 flex flex-col justify-between overflow-hidden">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Apr: {currencySymbol}38.4k</span>
                    <span>May: {currencySymbol}42.6k</span>
                    <span>Jun: {currencySymbol}46.9k</span>
                    <span>Jul: {currencySymbol}49.2k</span>
                    <span className="text-teal-400 font-bold">Aug (Pred): {currencySymbol}48.2k</span>
                  </div>

                  {/* Trend Line Visualizer */}
                  <div className="relative h-16 w-full flex items-center">
                    <div className="absolute w-full h-[2px] bg-slate-700 top-1/2" />
                    <div
                      className="absolute h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 top-1/2 left-0 origin-left transform -rotate-6 transition-all duration-300 shadow-md shadow-teal-500/50"
                      style={{ width: `${currentChapterInfo.progressInChapter * 100}%` }}
                    />
                    <div className="absolute right-4 top-2 px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono border border-teal-500/40">
                      Slope: +{currencySymbol}1,450/mo
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Confidence: 94.2%</span>
                    <span>Algorithm: Ordinary Least Squares (OLS)</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 3: Real-Time Anomaly & Overspending Alert Radar */}
            {currentChapterInfo.index === 2 && (
              <div className="w-full max-w-lg bg-[#111827]/90 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <ShieldAlert className="w-4 h-4 animate-pulse" />
                    <span>Real-Time Anomaly Detection Engine</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Warning Threshold (80%)
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">Food Budget Utilization Alert</div>
                    <p className="text-[11px] text-slate-300">
                      You have reached 88.5% ({currencySymbol}12,400) of your {currencySymbol}14,000 Food budget for August.
                    </p>
                    <div className="text-[10px] text-amber-400 font-semibold">
                      Recommendation: Reduce dining out for next 7 days to maintain savings.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#0A0E1A] border border-[#1E293B] text-slate-300 flex items-center justify-between">
                    <span>Rent &amp; Utilities</span>
                    <span className="text-emerald-400 font-bold">Within Limit</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#0A0E1A] border border-[#1E293B] text-slate-300 flex items-center justify-between">
                    <span>Shopping</span>
                    <span className="text-emerald-400 font-bold">88.5% Optimal</span>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 4: Autonomous Savings AI & Smart Recommendations */}
            {currentChapterInfo.index === 3 && (
              <div className="w-full max-w-lg bg-[#111827]/90 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <PiggyBank className="w-4 h-4" />
                    <span>Autonomous Wealth Optimizer</span>
                  </div>
                  <div className="text-xs text-emerald-300 font-bold">Goal: {currencySymbol}20,000/mo</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0A0E1A] to-teal-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">August Target Achievement</span>
                    <span className="text-sm font-extrabold text-emerald-400">234% Completed</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Accumulated Net Savings: <span className="text-white font-bold">{currencySymbol}46,850</span> (Surplus +{currencySymbol}26,850)
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Emergency fund fully shielded for 6+ months</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Launch Full Interactive App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Video Subtitles / CC Narration Display & Voice Waveform */}
          <div className="relative z-10 space-y-2">
            <div className="w-full flex items-center justify-between bg-[#0F172A]/85 backdrop-blur-md rounded-xl p-3 border border-[#1E293B]">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <canvas
                  ref={canvasRef}
                  width={90}
                  height={24}
                  className="rounded bg-[#0A0E1A] border border-slate-800 flex-shrink-0"
                />
                <p className="text-xs sm:text-sm text-slate-200 font-medium italic line-clamp-2">
                  "{currentChapterInfo.chapter.narration}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="p-4 sm:p-5 bg-[#0F172A] border-t border-[#1E293B] space-y-3.5">
          {/* Scrub Bar with Chapter Segments */}
          <div
            onClick={handleSeek}
            className="w-full h-3 bg-[#1E293B] rounded-full cursor-pointer relative overflow-hidden group shadow-inner"
          >
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            />
            {/* Chapter Dividers */}
            <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
              {chapters.map((ch, idx) => (
                <div key={ch.id} className="h-full w-[2px] bg-slate-900/80" />
              ))}
            </div>
          </div>

          {/* Chapter Quick Jump Pills */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-1">
            {chapters.map((ch, idx) => {
              const Icon = ch.icon;
              const isCurrent = currentChapterInfo.index === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleChapterJump(idx)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'bg-[#1E293B]/70 text-slate-400 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{ch.title}</span>
                  <span className="sm:hidden">Ch {idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Player Buttons Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                id="demo-video-play-pause-btn"
                onClick={() => {
                  if (currentTime >= totalDuration) {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-slate-950" />
                ) : (
                  <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                )}
              </button>

              {/* Replay */}
              <button
                id="demo-video-replay-btn"
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Time display */}
              <div className="font-mono text-slate-400 text-xs font-semibold">
                <span className="text-white">{formatTime(currentTime)}</span> /{' '}
                {formatTime(totalDuration)}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Voice Synthesizer Toggle */}
              <button
                id="demo-video-voice-toggle"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  isVoiceEnabled
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle AI Speech Synthesis"
              >
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">AI Voice</span>
              </button>

              {/* Mute / Unmute */}
              <button
                id="demo-video-mute-btn"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Playback Speed */}
              <button
                id="demo-video-speed-btn"
                onClick={() => {
                  const speeds = [1, 1.25, 1.5, 0.75];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2 py-1 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white font-mono text-xs font-bold"
              >
                {playbackSpeed}x
              </button>

              {/* Fullscreen Toggle */}
              <button
                id="demo-video-fullscreen-btn"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E293B] transition"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
