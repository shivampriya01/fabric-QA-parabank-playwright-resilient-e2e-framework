import { APIRequestContext, expect } from '@playwright/test';
import { ENV } from '../config/env.config';
import { logger } from '../utils/logger';

export class TransactionsApi {
  constructor(private request: APIRequestContext) {}

  async findTransactionsByAmount(accountId: string, amount: number) {
    logger.info(`API Get Request: Searching transactions for Acct: ${accountId} with Amount: ${amount}`);
    
    // ParaBank Endpoint for Transaction Search
    const response = await this.request.get(
      `${ENV.API_URL}/accounts/${accountId}/transactions/amount/${amount}`, { 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },    
      }

    );
    
    expect(response.status()).toBe(200);
    logger.info (`Status code: ${response.status()}`);
    const responseBody = await response.json();
    logger.info (`Response Body: ${responseBody}`);
    return await responseBody;
  }
}