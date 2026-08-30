import {
  Expense,
  Income,
  MonthlyBudget,
  User,
  AppSettings,
  NotificationAlert,
  ExpenseCategory,
} from '../types';

const STORAGE_KEYS = {
  USER: 'financeguard_user',
  INCOMES: 'financeguard_incomes',
  EXPENSES: 'financeguard_expenses',
  BUDGETS: 'financeguard_budgets',
  SETTINGS: 'financeguard_settings',
  NOTIFICATIONS: 'financeguard_notifications',
  IS_LOGGED_IN: 'financeguard_auth_status',
};

export const DEFAULT_USER: User = {
  id: 'usr_default_01',
  name: 'Alex Morgan',
  email: 'alex.morgan@financeguard.ai',
  incomeGoal: 75000,
  savingsGoal: 20000,
  joinedDate: '2026-01-15',
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'INR',
  currencySymbol: '₹',
  theme: 'dark',
  language: 'en',
  warningThreshold: 80,
  enableSoundAlerts: true,
  enableAiPredictions: true,
};

// Generate high quality sample data across 5 months up to current month (Aug 2026)
export function getInitialSampleData() {
  const currentYear = 2026;
  const currentMonthNum = 8; // August 2026
  
  const incomes: Income[] = [
    // Month -4 (April 2026)
    { id: 'inc_1', userId: DEFAULT_USER.id, source: 'Salary', amount: 65000, date: '2026-04-01', description: 'Tech Corp Monthly Salary', createdAt: 1711929600000 },
    { id: 'inc_2', userId: DEFAULT_USER.id, source: 'Freelancing', amount: 8500, date: '2026-04-18', description: 'Mobile App UI Design Contract', createdAt: 1713398400000 },
    
    // Month -3 (May 2026)
    { id: 'inc_3', userId: DEFAULT_USER.id, source: 'Salary', amount: 65000, date: '2026-05-01', description: 'Tech Corp Monthly Salary', createdAt: 1714521600000 },
    { id: 'inc_4', userId: DEFAULT_USER.id, source: 'Investment', amount: 4200, date: '2026-05-15', description: 'Dividend Payout & Mutual Fund Yield', createdAt: 1715731200000 },

    // Month -2 (June 2026)
    { id: 'inc_5', userId: DEFAULT_USER.id, source: 'Salary', amount: 70000, date: '2026-06-01', description: 'Tech Corp Salary + Promotion Increment', createdAt: 1717200000000 },
    { id: 'inc_6', userId: DEFAULT_USER.id, source: 'Freelancing', amount: 12000, date: '2026-06-22', description: 'Fullstack AI Dashboard Project', createdAt: 1719014400000 },

    // Month -1 (July 2026)
    { id: 'inc_7', userId: DEFAULT_USER.id, source: 'Salary', amount: 70000, date: '2026-07-01', description: 'Tech Corp Monthly Salary', createdAt: 1719792000000 },
    { id: 'inc_8', userId: DEFAULT_USER.id, source: 'Investment', amount: 5500, date: '2026-07-20', description: 'Quarterly Stock Dividends', createdAt: 1721433600000 },

    // Current Month (August 2026)
    { id: 'inc_9', userId: DEFAULT_USER.id, source: 'Salary', amount: 70000, date: '2026-08-01', description: 'Tech Corp Monthly Salary', createdAt: 1722470400000 },
    { id: 'inc_10', userId: DEFAULT_USER.id, source: 'Freelancing', amount: 14500, date: '2026-08-14', description: 'E-commerce API Integration', createdAt: 1723593600000 },
    { id: 'inc_11', userId: DEFAULT_USER.id, source: 'Business', amount: 6200, date: '2026-08-25', description: 'SaaS Tool Affiliate Revenue', createdAt: 1724544000000 },
  ];

  const expenses: Expense[] = [
    // April 2026 (Total ~ 38,400)
    { id: 'exp_01', userId: DEFAULT_USER.id, category: 'Rent', amount: 16000, date: '2026-04-02', description: 'Apartment Monthly Rent', createdAt: 1712016000000 },
    { id: 'exp_02', userId: DEFAULT_USER.id, category: 'Food', amount: 8200, date: '2026-04-10', description: 'Groceries & Organic Produce', createdAt: 1712707200000 },
    { id: 'exp_03', userId: DEFAULT_USER.id, category: 'Bills', amount: 4100, date: '2026-04-15', description: 'High-speed Fiber Internet & Power', createdAt: 1713139200000 },
    { id: 'exp_04', userId: DEFAULT_USER.id, category: 'Travel', amount: 3500, date: '2026-04-20', description: 'Metro Card & Fuel Refill', createdAt: 1713571200000 },
    { id: 'exp_05', userId: DEFAULT_USER.id, category: 'Entertainment', amount: 2800, date: '2026-04-24', description: 'Cinema & Streaming Subscriptions', createdAt: 1713916800000 },
    { id: 'exp_06', userId: DEFAULT_USER.id, category: 'Shopping', amount: 3800, date: '2026-04-28', description: 'Summer Casual Clothes', createdAt: 1714262400000 },

    // May 2026 (Total ~ 42,600)
    { id: 'exp_07', userId: DEFAULT_USER.id, category: 'Rent', amount: 16000, date: '2026-05-02', description: 'Apartment Monthly Rent', createdAt: 1714608000000 },
    { id: 'exp_08', userId: DEFAULT_USER.id, category: 'Food', amount: 9400, date: '2026-05-12', description: 'Supermarket Groceries & Weekend Dining', createdAt: 1715472000000 },
    { id: 'exp_09', userId: DEFAULT_USER.id, category: 'Bills', amount: 4800, date: '2026-05-16', description: 'AC Electricity Bill & Water', createdAt: 1715817600000 },
    { id: 'exp_10', userId: DEFAULT_USER.id, category: 'Travel', amount: 4200, date: '2026-05-22', description: 'Weekend Roadtrip Tolls & Petrol', createdAt: 1716336000000 },
    { id: 'exp_11', userId: DEFAULT_USER.id, category: 'Health', amount: 3200, date: '2026-05-25', description: 'Dental Checkup & Vitamins', createdAt: 1716595200000 },
    { id: 'exp_12', userId: DEFAULT_USER.id, category: 'Shopping', amount: 5000, date: '2026-05-29', description: 'Ergonomic Desk Accessories', createdAt: 1716940800000 },

    // June 2026 (Total ~ 46,900)
    { id: 'exp_13', userId: DEFAULT_USER.id, category: 'Rent', amount: 16000, date: '2026-06-02', description: 'Apartment Monthly Rent', createdAt: 1717286400000 },
    { id: 'exp_14', userId: DEFAULT_USER.id, category: 'Food', amount: 10500, date: '2026-06-11', description: 'Special Birthday Dinner & Groceries', createdAt: 1718064000000 },
    { id: 'exp_15', userId: DEFAULT_USER.id, category: 'Bills', amount: 4300, date: '2026-06-15', description: 'Electricity & Mobile Plans', createdAt: 1718409600000 },
    { id: 'exp_16', userId: DEFAULT_USER.id, category: 'Education', amount: 6500, date: '2026-06-19', description: 'Cloud Architect Certification Exam', createdAt: 1718755200000 },
    { id: 'exp_17', userId: DEFAULT_USER.id, category: 'Shopping', amount: 6200, date: '2026-06-25', description: 'Wireless Noise Canceling Headphones', createdAt: 1719273600000 },
    { id: 'exp_18', userId: DEFAULT_USER.id, category: 'Entertainment', amount: 3400, date: '2026-06-28', description: 'Concert Tickets', createdAt: 1719532800000 },

    // July 2026 (Total ~ 49,200)
    { id: 'exp_19', userId: DEFAULT_USER.id, category: 'Rent', amount: 16000, date: '2026-07-02', description: 'Apartment Monthly Rent', createdAt: 1719878400000 },
    { id: 'exp_20', userId: DEFAULT_USER.id, category: 'Food', amount: 11200, date: '2026-07-08', description: 'Weekly Dining & Supermarket Stock', createdAt: 1720396800000 },
    { id: 'exp_21', userId: DEFAULT_USER.id, category: 'Bills', amount: 4600, date: '2026-07-16', description: 'Utility and Internet Subscriptions', createdAt: 1721088000000 },
    { id: 'exp_22', userId: DEFAULT_USER.id, category: 'Travel', amount: 4800, date: '2026-07-21', description: 'Cab rides & Airport commute', createdAt: 1721520000000 },
    { id: 'exp_23', userId: DEFAULT_USER.id, category: 'Shopping', amount: 8400, date: '2026-07-26', description: 'Mid-Year Electronic Gadget Sale', createdAt: 1721952000000 },
    { id: 'exp_24', userId: DEFAULT_USER.id, category: 'Entertainment', amount: 4200, date: '2026-07-29', description: 'Resort Day Pass & Dinner', createdAt: 1722211200000 },

    // Current Month (August 2026) (Total ~ 43,850 so far)
    { id: 'exp_25', userId: DEFAULT_USER.id, category: 'Rent', amount: 16000, date: '2026-08-02', description: 'Apartment Monthly Rent', createdAt: 1722556800000 },
    { id: 'exp_26', userId: DEFAULT_USER.id, category: 'Food', amount: 12400, date: '2026-08-07', description: 'Gourmet Meals, Groceries & Cafe outings', createdAt: 1722988800000 },
    { id: 'exp_27', userId: DEFAULT_USER.id, category: 'Bills', amount: 4250, date: '2026-08-12', description: 'Electricity & Broadband Bill', createdAt: 1723420800000 },
    { id: 'exp_28', userId: DEFAULT_USER.id, category: 'Shopping', amount: 6200, date: '2026-08-18', description: 'Smart Watch Band & Tech Essentials', createdAt: 1723939200000 },
    { id: 'exp_29', userId: DEFAULT_USER.id, category: 'Travel', amount: 3200, date: '2026-08-22', description: 'Fuel Refill & Weekly Commute', createdAt: 1724284800000 },
    { id: 'exp_30', userId: DEFAULT_USER.id, category: 'Health', amount: 1800, date: '2026-08-27', description: 'Gym Protein Supplement & Pharmacy', createdAt: 1724716800000 },
  ];

  const defaultCategoryBudgets: Record<ExpenseCategory, number> = {
    Food: 14000,
    Rent: 16000,
    Bills: 5000,
    Shopping: 7000,
    Travel: 4500,
    Entertainment: 3500,
    Health: 3000,
    Education: 4000,
    Other: 3000,
  };

  const budgets: MonthlyBudget[] = [
    {
      userId: DEFAULT_USER.id,
      month: '2026-08',
      overallBudget: 55000,
      categoryBudgets: defaultCategoryBudgets,
    },
    {
      userId: DEFAULT_USER.id,
      month: '2026-07',
      overallBudget: 55000,
      categoryBudgets: defaultCategoryBudgets,
    },
  ];

  const initialAlerts: NotificationAlert[] = [
    {
      id: 'alt_1',
      title: 'Food Budget Warning (88% used)',
      message: 'You have used 88.5% (₹12,400) of your ₹14,000 Food budget for August.',
      type: 'warning',
      timestamp: '2 hours ago',
      read: false,
      category: 'Food',
    },
    {
      id: 'alt_2',
      title: 'Monthly Savings Goal on Track',
      message: 'Your current August net savings is ₹46,850, well exceeding your goal of ₹20,000!',
      type: 'safe',
      timestamp: 'Yesterday',
      read: false,
    },
    {
      id: 'alt_3',
      title: 'Unusual Spending Detected',
      message: 'Food expenses increased +10.7% compared to July. Consider home-cooked meals.',
      type: 'info',
      timestamp: '3 days ago',
      read: true,
      category: 'Food',
    },
  ];

  return { incomes, expenses, budgets, alerts: initialAlerts };
}

// LocalStorage helpers
export const storageService = {
  getUser: (): User => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  saveUser: (user: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getIncomes: (): Income[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INCOMES);
      if (data) return JSON.parse(data);
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(initial.incomes));
      return initial.incomes;
    } catch {
      return getInitialSampleData().incomes;
    }
  },

  saveIncomes: (incomes: Income[]) => {
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  },

  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      if (data) return JSON.parse(data);
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initial.expenses));
      return initial.expenses;
    } catch {
      return getInitialSampleData().expenses;
    }
  },

  saveExpenses: (expenses: Expense[]) => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getBudgets: (): MonthlyBudget[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (data) return JSON.parse(data);
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initial.budgets));
      return initial.budgets;
    } catch {
      return getInitialSampleData().budgets;
    }
  },

  saveBudgets: (budgets: MonthlyBudget[]) => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  },

  getSettings: (): AppSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getNotifications: (): NotificationAlert[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
      const initial = getInitialSampleData();
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial.alerts));
      return initial.alerts;
    } catch {
      return getInitialSampleData().alerts;
    }
  },

  saveNotifications: (alerts: NotificationAlert[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(alerts));
  },

  isLoggedIn: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) !== 'false';
  },

  setLoggedIn: (status: boolean) => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status ? 'true' : 'false');
  },

  resetAllData: () => {
    localStorage.clear();
    const initial = getInitialSampleData();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(initial.incomes));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initial.expenses));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initial.budgets));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial.alerts));
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  },
};
