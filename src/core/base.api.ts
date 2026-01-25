import { APIRequestContext, expect } from '@playwright/test';

export abstract class BaseAPI {
  constructor(protected request: APIRequestContext) {}

  protected async get(url: string) {
    const response = await this.request.get(url);
    expect(response.ok()).toBeTruthy();
    return response;
  }
}
