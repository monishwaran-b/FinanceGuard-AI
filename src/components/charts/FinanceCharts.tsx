import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface CategoryPieChartProps {
  categoryTotals: Record<string, number>;
  currencySymbol: string;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  categoryTotals,
  currencySymbol,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  const categories = Object.keys(categoryTotals).filter(cat => categoryTotals[cat] > 0);
  const dataValues = categories.map(cat => categoryTotals[cat]);

  const colorPalette = [
    '#10B981', // Emerald green
    '#3B82F6', // Blue
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#64748B', // Slate
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [
          {
            data: dataValues.length > 0 ? dataValues : [1],
            backgroundColor: dataValues.length > 0 ? colorPalette.slice(0, categories.length) : ['#334155'],
            borderWidth: 2,
            borderColor: '#0f172a',
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                const val = context.raw as number;
                return ` ${context.label}: ${currencySymbol}${val.toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [categoryTotals, currencySymbol]);

  return (
    <div className="relative w-full h-[260px] flex items-center justify-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

interface IncomeVsExpenseBarChartProps {
  monthlyData: { month: string; income: number; expense: number }[];
  currencySymbol: string;
}

export const IncomeVsExpenseBarChart: React.FC<IncomeVsExpenseBarChartProps> = ({
  monthlyData,
  currencySymbol,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = monthlyData.map(d => d.month);
    const incomeData = monthlyData.map(d => d.income);
    const expenseData = monthlyData.map(d => d.expense);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: '#10B981',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: '#3B82F6',
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
              callback: function (val) {
                return `${currencySymbol}${Number(val) >= 1000 ? `${(Number(val) / 1000).toFixed(0)}k` : val}`;
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#cbd5e1',
              font: {
                family: 'Plus Jakarta Sans',
                size: 12,
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${currencySymbol}${(context.raw as number).toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [monthlyData, currencySymbol]);

  return (
    <div className="relative w-full h-[260px]">
      <canvas ref={canvasRef} />
    </div>
  );
};

interface SpendingTrendLineChartProps {
  monthlyData: { month: string; expense: number; predicted?: number }[];
  currencySymbol: string;
}

export const SpendingTrendLineChart: React.FC<SpendingTrendLineChartProps> = ({
  monthlyData,
  currencySymbol,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const labels = monthlyData.map(d => d.month);
    const expenseData = monthlyData.map(d => d.expense);
    const predictedData = monthlyData.map(d => d.predicted);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Actual Spend',
            data: expenseData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
          },
          ...(predictedData.some(p => p !== undefined)
            ? [
                {
                  label: 'ML Regression Fit (OLS)',
                  data: predictedData,
                  borderColor: '#10B981',
                  borderDash: [5, 5],
                  backgroundColor: 'transparent',
                  pointRadius: 4,
                  pointBackgroundColor: '#10B981',
                  tension: 0.1,
                },
              ]
            : []),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
              },
              callback: function (val) {
                return `${currencySymbol}${Number(val) >= 1000 ? `${(Number(val) / 1000).toFixed(0)}k` : val}`;
              },
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              color: '#cbd5e1',
              font: {
                family: 'Plus Jakarta Sans',
                size: 12,
              },
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${currencySymbol}${(context.raw as number).toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [monthlyData, currencySymbol]);

  return (
    <div className="relative w-full h-[260px]">
      <canvas ref={canvasRef} />
    </div>
  );
};
