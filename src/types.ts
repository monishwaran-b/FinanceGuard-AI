import { LanguageCode } from './utils/translations';

export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Shopping'
  | 'Rent'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Education'
  | 'Other';

export type IncomeSource =
  | 'Salary'
  | 'Freelancing'
  | 'Business'
  | 'Investment'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  incomeGoal: number;
  savingsGoal: number;
  joinedDate: string;
}

export interface Income {
  id: string;
  userId: string;
  source: IncomeSource;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: number;
}

export interface Expense {
  id: string;
  userId: string;
  category: ExpenseCategory;
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  createdAt: number;
  isRecurring?: boolean;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  budgetAmount: number;
}

export interface MonthlyBudget {
  userId: string;
  month: string; // YYYY-MM
  overallBudget: number;
  categoryBudgets: Record<ExpenseCategory, number>;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'safe' | 'warning' | 'danger' | 'info';
  timestamp: string;
  read: boolean;
  category?: string;
}

export interface RegressionPrediction {
  predictedExpense: number;
  confidenceScore: number; // percentage (e.g., 88%)
  rSquared: number;
  slope: number; // trend per month
  intercept: number;
  monthlyHistory: { month: string; actual: number; predicted?: number }[];
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  explanation: string;
}

export interface AIInsight {
  id: string;
  type: 'spending' | 'budget' | 'trend' | 'anomaly' | 'saving';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  actionableTip?: string;
  category?: ExpenseCategory;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  theme: 'dark' | 'light';
  language: LanguageCode;
  warningThreshold: number; // e.g. 80 (%)
  enableSoundAlerts: boolean;
  enableAiPredictions: boolean;
}

export type ActiveTab =
  | 'dashboard'
  | 'income'
  | 'expenses'
  | 'budget'
  | 'ai-analysis'
  | 'prediction'
  | 'suggestions'
  | 'transactions'
  | 'profile'
  | 'settings'
  | 'python-project'
  | 'demo-video'
  | 'translator';
