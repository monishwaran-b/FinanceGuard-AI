export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  rateVsUSD: number;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rateVsUSD: 86.5 },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rateVsUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rateVsUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rateVsUSD: 0.78 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', rateVsUSD: 1.38 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', rateVsUSD: 1.54 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rateVsUSD: 154.2 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)', rateVsUSD: 3.67 },
  { code: 'SGD', symbol: 'SG$', name: 'Singapore Dollar (SGD)', rateVsUSD: 1.34 },
];

export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  
  // Format with thousand separators
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(absVal);

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}
