import { BasePage } from '../core/base.page';
import { expect } from '@playwright/test';
import {ENV} from '../config/env.config';
import { logger } from '../utils/logger';

export class HomePage extends BasePage {
  // Region-specific locators to avoid ambiguity
  private readonly topNavRegion = this.page.locator('#headerPanel');
  private readonly sidebarRegion = this.page.locator('#leftPanel');
  private readonly footerRegion = this.page.locator('#footerPanel');

  /**
   * Validates a navigation link within a specific region.
   @param region 'top' | 'sidebar' | 'footer'
   @param linkText The visible text of the link
   @param expectedHeader The expected H1 or Title on the destination page
   */
  async validateNavigation(region: 'top' | 'sidebar' | 'footer', linkText: string, expectedHeader: string) {
    let regionLocator;
    
    switch (region) {
      case 'top': regionLocator = this.topNavRegion; break;
      case 'sidebar': regionLocator = this.sidebarRegion; break;
      case 'footer': regionLocator = this.footerRegion; break;
    }

    const navLink = regionLocator.getByRole('link', { name: linkText, exact: true });
    logger.info(`Validating ${region} navigation: clicking '${linkText}'`);
    
    await navLink.click();
    
    // Asserting the Header text for robustness
    if (region == 'sidebar'){
      const rightpanelHeader = this.page.locator('#rightPanel h1').first();
      await expect(rightpanelHeader).toContainText(expectedHeader);
    }

    else if (region == 'top'){
      if (linkText == 'Services'){
        const rightpanelHeader = this.page.locator('#rightPanel>span:first-of-type');
        await expect(rightpanelHeader).toContainText(expectedHeader);
      }
      else if (linkText == 'about' || linkText == 'contact'){
        const rightpanelHeader = this.page.locator('#rightPanel h1');
      await expect(rightpanelHeader).toContainText(expectedHeader);
      } 
      else if (linkText !== 'Products' && linkText !== 'Locations') {
        const rightpanelHeader = this.page.locator('#rightPanel h1');
        await expect(rightpanelHeader).toContainText(expectedHeader);
      }
      else{
        const rightpanelHeader = this.page.locator('.page_body h1');
        await expect(rightpanelHeader).toContainText(expectedHeader);
        //Back Navigation
        await this.performBackNavigation(linkText);
      }
    }

    else if (region == 'footer'){
      if (linkText == 'Services'){
        const rightpanelHeader = this.page.locator('#rightPanel>span:first-of-type');
        await expect(rightpanelHeader).toContainText(expectedHeader);
      }
      else if (linkText == 'Forum') {
        const rightpanelHeader = this.page.locator('h1', { hasText: /^Parasoft Forums$/ });
        await expect(rightpanelHeader).toContainText(expectedHeader);
        //Back Navigation
        await this.performBackNavigation(linkText);
      }
      else if (linkText !== 'Products' && linkText !== 'Locations') {
        const rightpanelHeader = this.page.locator('#rightPanel h1');
        await expect(rightpanelHeader).toContainText(expectedHeader);
      }
      else {
        const rightpanelHeader = this.page.locator('.page_body h1');
        await expect(rightpanelHeader).toContainText(expectedHeader);
        //Back Navigation
        await this.performBackNavigation(linkText);
      }
      
    }
    logger.info(`Navigation successful: Landed on '${expectedHeader}' page.`);
  }

/*
Resilient back navigation. If the link was external (Products/Locations/Forum), 
it uses a direct goto to reset the session safely.
 */
private async performBackNavigation(linkText: string) {
  logger.info(`Navigating back after validating: ${linkText}`);

  if (linkText === 'Products' || linkText === 'Locations' || linkText == 'Forum') {
    // Direct return over browser back navigation (safer approach) as these often go to external subdomains
    await this.page.goto(`${ENV.BASE_URL}/index.htm`);
  }
// Wait for a core global links to ensure the page is interactive for the next loop
  await expect(this.page.locator('#leftPanel')).toBeVisible({ timeout: 3000 });
}
}