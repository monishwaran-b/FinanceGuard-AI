import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  Cpu,
  BarChart3,
  Sliders,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Code2,
} from 'lucide-react';
import { RegressionPrediction, Expense } from '../types';
import { formatCurrency } from '../utils/currencies';
import { SpendingTrendLineChart } from './charts/FinanceCharts';

interface PredictionViewProps {
  prediction: RegressionPrediction;
  expenses: Expense[];
  currencySymbol: string;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  prediction,
  expenses,
  currencySymbol,
}) => {
  // Interactive Simulator State
  const [diningReductionPct, setDiningReductionPct] = useState(10);
  const [shoppingReductionPct, setShoppingReductionPct] = useState(15);

  const simulatedNextMonthExpense = Math.max(
    5000,
    Math.round(prediction.predictedExpense - (prediction.predictedExpense * (diningReductionPct * 0.05 + shoppingReductionPct * 0.08)) / 10)
  );
  const simulatedSavingsGain = prediction.predictedExpense - simulatedNextMonthExpense;

  const chartData = prediction.monthlyHistory.map(item => ({
    month: item.month,
    expense: item.actual,
    predicted: item.predicted,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-emerald-950/40 border border-blue-500/30">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">Machine Learning Expense Prediction</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervised learning regression algorithm calculating future monthly cash outflows and spending acceleration.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono font-semibold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span>Model: OLS Linear Regression</span>
        </div>
      </div>

      {/* Hero Prediction Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Forecast Card */}
        <div className="p-6 rounded-2xl glass-card border border-blue-500/30 md:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Next Month Expected Expense (September 2026)
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Confidence: {prediction.confidenceScore}%
              </span>
            </div>

            <div className="mt-4">
              <p className="text-3xl lg:text-5xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(prediction.predictedExpense, currencySymbol)}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                {prediction.explanation}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Monthly Slope (m)</span>
              <p className="font-mono font-bold text-white mt-0.5">
                {prediction.slope >= 0 ? '+' : ''}{formatCurrency(prediction.slope, currencySymbol)}/mo
              </p>
            </div>
            <div>
              <span className="text-slate-400">R² Determination</span>
              <p className="font-mono font-bold text-emerald-400 mt-0.5">
                {prediction.rSquared}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Trend Curve</span>
              <p className="font-bold text-blue-400 uppercase mt-0.5">
                {prediction.trendDirection}
              </p>
            </div>
          </div>
        </div>

        {/* Statistical Parameters Card */}
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Regression Model Specs</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Mathematical Equation</span>
                <code className="text-emerald-300 font-mono font-bold text-xs">
                  y = {prediction.slope}x + {prediction.intercept}
                </code>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Training Set</span>
                <span className="text-white font-semibold">
                  {prediction.monthlyHistory.length - 1} Historical Monthly Cycles
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Library Backend</span>
                <span className="text-blue-300 font-semibold font-mono">
                  scikit-learn.linear_model
                </span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 mt-4 border-t border-slate-800 pt-2">
            Ordinary Least Squares minimizes residual sum of squared differences across time points.
          </p>
        </div>
      </div>

      {/* Regression Line Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Historical Multi-Month Trajectory vs. ML Fitted Line</h3>
            <p className="text-xs text-slate-400">Green dashed line displays linear regression model projection into next month</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Actual vs Predicted</span>
        </div>
        <div className="h-[280px]">
          <SpendingTrendLineChart monthlyData={chartData} currencySymbol={currencySymbol} />
        </div>
      </div>

      {/* Interactive "What-If" Scenario Optimizer */}
      <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Interactive "What-If" AI Spending Simulator</h3>
        </div>
        <p className="text-xs text-slate-400">
          Simulate how strategic lifestyle adjustments will impact next month's predicted expenditure and boost your savings bank.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Slider 1: Food/Dining */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Reduce Food &amp; Dining Out:</span>
              <span className="text-emerald-400 font-mono font-bold">{diningReductionPct}% reduction</span>
            </div>
            <input
              id="slider-dining"
              type="range"
              min="0"
              max="50"
              step="5"
              value={diningReductionPct}
              onChange={e => setDiningReductionPct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Shopping */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Reduce Discretionary Shopping:</span>
              <span className="text-blue-400 font-mono font-bold">{shoppingReductionPct}% reduction</span>
            </div>
            <input
              id="slider-shopping"
              type="range"
              min="0"
              max="50"
              step="5"
              value={shoppingReductionPct}
              onChange={e => setShoppingReductionPct(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Simulator Result Pill */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
          <div>
            <span className="text-xs text-slate-400">Adjusted Projected Expense</span>
            <p className="text-xl font-bold text-emerald-400 font-mono">
              {formatCurrency(simulatedNextMonthExpense, currencySymbol)}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-slate-400">Estimated Additional Monthly Savings</span>
            <p className="text-xl font-bold text-white font-mono">
              +{formatCurrency(simulatedSavingsGain, currencySymbol)}/mo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
