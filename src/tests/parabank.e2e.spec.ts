import { test, expect } from '@playwright/test';
import { generateUser, UserData } from '../utils/data.generator';
import { RegistrationPage } from '../pages/registration.page';
import { LoginPage } from '../pages/login.page';
import { sidebarItems, topMenuItems, topRightIcons, topRightHomeIcon, footerItems, footerItems_Home, footerItems_SiteMap, LogOut} from '../config/test.constants';
import { HomePage } from '../pages/home.page';
import { OpenAccountPage } from '../pages/openAccount.page';
import { TransferFundsPage } from '../pages/transferFunds.page';
import { TransactionsApi } from '../api/transactions.api';
import { AccountsOverviewPage } from '../pages/accountsOverview.page';
import { BillPayPage } from '../pages/billPay.page';
import {ENV} from '../config/env.config';
import { logger } from '../utils/logger';

test.describe('Fabric Parabank QE - High-Resilience E2E', () => {
  let userData: UserData;
  let newAccountId: string;
  let activeUser: string;
  const transferAmount = '$100.00'; // Note: Replace '$100.00' with the actual expected initial balance
  const transferAmountNum = transferAmount.match(/\d+(\.\d+)?/); // Regex to extract numeric value from transferAmount
  if (!transferAmountNum) {
    throw new Error('Invalid transfer amount format.');
  }
  const transferAmountValue = transferAmountNum[0]; // Use the extracted numeric value

  test.beforeEach(() => {
    userData = generateUser(); // Returns UserData interface
    console.log('Generated User for Test:', userData);
  });

  test('Complete Banking Flow (full lifecycle even with data collisions): Launch App -> Register -> Login -> Global Links Navigation -> Log Out -> Re-Login -> Open New Savings Account -> Accounts Overview -> Transfer Funds -> Bill Pay -> API Validation', async ({ page, request }) => {
    const registerPage = new RegistrationPage(page);
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const openAcctPage = new OpenAccountPage(page);
    const transferPage = new TransferFundsPage(page);
    const acctOverviewPage = new AccountsOverviewPage(page);
    const billPayPage = new BillPayPage(page);
    const api = new TransactionsApi(request);

    // --- UI SCENARIOS ---
    
    await test.step('1. Navigation', async () => {
      await page.goto(`${ENV.BASE_URL}`);
      logger.info(`Launched Para Bank Application: ${ENV.BASE_URL}`);
    });

    await test.step('2a. User Creation, Actions and Re-Login Flow', async () => {
      await page.getByRole('link', { name: 'Register' }).click();
      // We "Await" the resilient method which returns the confirmed unique user.
    const activeUser = await test.step('Resilient User Registration', async () => {
      return await registerPage.registerResiliently();
    });

    await test.step('2b. Verify Registration Success', async () => {
      await expect(page.getByText(`Welcome ${activeUser.username}`)).toBeVisible();
      await expect(page.getByText('Your account was created successfully')).toBeVisible();
      logger.info(`Proceeding to next test phases with verified registered user: ${activeUser.username}`);
    });
  
    await test.step('3a. Login & Verify', async () => {
      // Registration auto-logs in, but we verify we are on home
      await expect(page.locator('p.smallText')).toContainText(`Welcome ${activeUser.firstName}`);
      logger.info(`Logged in for registered user with msg: Welcome ${activeUser.firstName}`);
    });

    await test.step('4a. Global Links', async () => {
      const menu = page.locator('#leftPanel');
      await expect(menu).toBeVisible();
      logger.info(`Global links on Home screen are present as expected`);
    });

    await test.step('4b. Global Navigation Validation - links work correctly', async () => {
        // Validate Sidebar Navigation
        for (const item of sidebarItems) {
          await test.step(`Sidebar Nav: ${item.link}`, async () => {
            await homePage.validateNavigation('sidebar', item.linkText, item.header);
          });
        }
    
        // Validate Top Menu Items Navigation 
        for (const item of topMenuItems) {
          await test.step(`Top Menu Items Nav: ${item.link}`, async () => {
            await homePage.validateNavigation('top', item.linkText, item.header);
          });
        }

        // Validate Top Right Icons Navigation
        for (const item of topRightIcons) {
          await test.step(`Top Right Icons Nav: ${item.link}`, async () => {
            await homePage.validateNavigation('top', item.linkText, item.header);
          });
        }
        
        //Validate Top right Home Icon Link
        await page.locator('ul.button li.home').click();;
        logger.info(`Validating Top Right Home Icon navigation`);
        await expect(page).toHaveURL(topRightHomeIcon.link);
        const URL_Top_Home_Icon = page.url();
        logger.info(`Top Right Home Icon link: ${URL_Top_Home_Icon}`);
    
        //Validate Footer Items 
        for (const item of footerItems) {
          await test.step(`Footer Nav: ${item.link}`, async () => {
            await homePage.validateNavigation('footer', item.linkText, item.header);
          });
        }
        
        //Validate Footer Item Home link
        await page.locator("//div[@id='footerPanel']//ul/li/a[text()='Home']").click();;
        logger.info(`Validating Footer Item Home link navigation`);
        await expect(page).toHaveURL(footerItems_Home.link);
        const URL_Footer_Home = page.url();
        logger.info(`Footer Item Home link: ${URL_Footer_Home}`);

        //Validate Footer Item Site Map link
        await page.getByRole('link', { name: 'Site Map'}).click();;
        logger.info(`Validating Footer Item Site Map link navigation`);
        await expect(page).toHaveURL(footerItems_SiteMap.link);
        const URL_Footer_Site_Map = page.url();
        logger.info(`Footer Item Site Map link: ${URL_Footer_Site_Map}`);

        // Final Step: Log Out
        await test.step('Validate Log Out', async () => {
          await page.locator("//div[@id='leftPanel']//ul/li/a[text()='Log Out']").click();
          logger.info(`Validating LogOut navigation`);
          await expect(page.locator('h2')).toContainText('Customer Login');
          await expect(page).toHaveURL(LogOut.link);
          const URL_Log_Out = page.url();
          logger.info(`Log Out link: ${URL_Log_Out}`);
        });
    });

    await test.step('3b. Re-Login & Verify', async () => {
      // Login again to the application with the created user
      await loginPage.login(activeUser.username, activeUser.password);
      await expect(page.locator('p.smallText')).toContainText(`Welcome ${activeUser.firstName}`);
      logger.info(`Logged in again for ${activeUser.firstName}`);
    });
  });

    await test.step('5. Open Savings Account', async () => {
      // Opened Savings Account and captured the account number
      await page.getByRole('link', { name: 'Open New Account' }).click();
      newAccountId = await openAcctPage.openAccount('SAVINGS');
      await expect(page.locator('#openAccountResult')).toContainText('Account Opened!');
      logger.info(`Created New Savings Account: ${newAccountId}`);
    });

    await test.step('6. Validate Accounts Overview', async () => {
      // Verify Accounts Overview for accounts including total balance
      await page.getByRole('link', { name: 'Accounts Overview' }).click();
      acctOverviewPage.verifyAccountVisible;
      acctOverviewPage.validateAccountBalance(newAccountId, transferAmount);
      const totalBalance = page.locator('#showOverview #accountTable b').last();
      await expect(totalBalance).toBeVisible();
      logger.info(`Total Balance present and verified on Accounts Overview page.`);
    });

    await test.step('7. Transfer funds from account created in previous step to another account.', async () => {
      // Transfer fund from new account created to another account in intelligent way
      await page.getByRole('link', { name: 'Transfer Funds' }).click();
      await transferPage.transferFunds(transferAmountValue, newAccountId);
    });

    await test.step('8. Pay the bill from account created in previous step', async () => {
      // Bill Payment from new account created
      await page.getByRole('link', { name: 'Bill Pay' }).click();
      await billPayPage.fillBillPaymentForm('Shivam', 'HSR', 'Bengaluru', 'Karnataka', '560102', '91-123456780', '12345678', '12345678', transferAmountValue, newAccountId);
      await billPayPage.sendPayment();
      await billPayPage.verifyBillPayment();
    });

    // --- API SCENARIOS ---

    await test.step('API 1 & 2. Find Transaction & Validate', async () => {
      // Performed search (GET Request) specifically for the credit transaction on the NEW account
      const transactions = await api.findTransactionsByAmount(newAccountId, Number(transferAmountValue));
      expect(transactions.length).toBeGreaterThan(0);
      logger.info (`Response Body length: ${transactions.length}`);
      expect(transactions[0].id).toHaveValue;
      logger.info (`Transaction Id (Credit): ${transactions[0].id}`);
      expect(transactions[0].accountId).toEqual(Number(newAccountId));
      logger.info (`Transaction for Account Id (Credit): ${transactions[0].accountId}`);
      expect(transactions[0].amount).toEqual(Number(transferAmountValue));
      logger.info (`Transaction Amount (Credit): ${transactions[0].amount}`);
      expect(transactions[0].type).toBe('Credit');
      logger.info (`Transaction Type (Credit): ${transactions[0].type}`);
      expect(transactions[0].description).toBe('Funds Transfer Received');
      logger.info (`Transaction Description (Credit): ${transactions[0].description}`);
      logger.info('API Validation Successful: Transaction found with all the details in JSON response.');
    });
  });
});