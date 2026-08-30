import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  FolderTree,
  ExternalLink,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { PYTHON_FLASK_PROJECT_FILES, ProjectFile } from '../utils/exportPythonProject';

export const PythonProjectModal: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PYTHON_FLASK_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-emerald-950/40 border border-blue-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
              Python / Flask / Scikit-Learn Project Hub
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
              College Project Package
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete, organized source code files ready to run with Python Flask, SQLite, and Scikit-Learn.
          </p>
        </div>
      </div>

      {/* 4 Steps Quick Setup Guide */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Local Python Execution Steps (Beginner Friendly)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Install Python</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Install Python 3.10+ and check "Add Python to PATH".
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-blue-400">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Install Libraries</span>
            </div>
            <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 p-1 rounded">
              pip install -r requirements.txt
            </code>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Run Flask Server</span>
            </div>
            <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 p-1 rounded">
              python app.py
            </code>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">4</span>
              <span>Open in Browser</span>
            </div>
            <code className="text-[11px] font-mono text-slate-300 block bg-slate-950 p-1 rounded">
              http://127.0.0.1:5000
            </code>
          </div>
        </div>
      </div>

      {/* Code Viewer & File Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree List */}
        <div className="lg:col-span-4 p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>FinanceGuardAI / Structure</span>
          </div>

          <div className="space-y-1.5">
            {PYTHON_FLASK_PROJECT_FILES.map(file => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-mono transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileCode className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] uppercase font-sans font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 mt-4 space-y-1">
            <p className="font-semibold text-white">Database Schema Included:</p>
            <p>• USERS (id, name, email, password)</p>
            <p>• INCOME (id, user_id, source, amount, date)</p>
            <p>• EXPENSES (id, user_id, category, amount, date)</p>
            <p>• BUDGETS (id, user_id, category, amount, month)</p>
          </div>
        </div>

        {/* Right: Code Preview with Copy / Download */}
        <div className="lg:col-span-8 p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white font-mono">{selectedFile.path}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="copy-file-code-btn"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                id="download-file-btn"
                onClick={handleDownloadFile}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-950/90 rounded-xl p-4 border border-slate-800/80 overflow-x-auto max-h-[520px]">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed selection:bg-blue-500/30">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
