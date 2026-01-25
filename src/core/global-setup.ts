import { chromium, FullConfig } from '@playwright/test';
import {ENV} from '../config/env.config';
import { logger } from '../utils/logger';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    logger.info('--- GLOBAL START: Resetting ParaBank Environment ---');
    
    // Navigate to the hidden admin panel
    await page.goto(`${ENV.BASE_URL}/admin.htm`);
    
    // Perform Clean-and-Initialize cycle from ParaBank's Admin page
    await page.getByRole('button', { name: 'Clean' }).click(); // CLEAN: ParaBank's Admin page uses these specific buttons to purge DB state
    logger.info('Environment purged (Cleaned).');
      
    await page.getByRole('button', { name: 'Initialize' }).click(); // INITIALIZE : ParaBank's Admin page uses these specific buttons to purge DB state
    logger.info('Environment seeded (Initialized).');
    
    logger.info('--- GLOBAL SETUP COMPLETE: Ready for Tests ---');
  } catch (error) {
    /* If the reset fails, we log the error but don't stop the suite ->
     This allows tests to attempt running in case the app is up but admin is flaky */
    if (error instanceof Error) {
        logger.error(`WARNING: Global Setup failed to reset DB. Error: ${error.message}`);
      } else {
        // Handle cases where 'error' is not an instance of Error
        logger.error('WARNING: Global Setup failed to reset DB. An unknown error occurred.');
      }
  } finally {
    await browser.close(); // closing the browser instance
  }
}

export default globalSetup;