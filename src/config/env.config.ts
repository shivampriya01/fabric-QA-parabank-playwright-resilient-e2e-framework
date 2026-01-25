import 'dotenv/config';

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://parabank.parasoft.com/parabank',
  API_URL: 'https://parabank.parasoft.com/parabank/services/bank',
  TIMEOUT: {
    SHORT: 5000,
    DEFAULT: 30000,
    LONG: 60000
  }
};