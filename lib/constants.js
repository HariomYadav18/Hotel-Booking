export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  INR: 'INR'
};

export const DEFAULT_CURRENCY = CURRENCIES.USD;

export const MAX_STAY_NIGHTS = 30;

export const TAX_RATE = 0.1;
export const SERVICE_FEE_RATE = 0.05;

export const DEMO_MODE = !process.env.MONGODB_URI || process.env.MONGODB_URI === 'demo';


