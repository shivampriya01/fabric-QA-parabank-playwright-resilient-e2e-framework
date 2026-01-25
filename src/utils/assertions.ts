import { expect } from '@playwright/test';

export function assertNotEmpty(value: string, message: string) {
  expect(value, message).toBeTruthy();
}
