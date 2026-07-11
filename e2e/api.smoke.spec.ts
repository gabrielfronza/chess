import { expect, test } from '@playwright/test';

test('API is reachable', async ({ request }) => {
  const response = await request.get('/');

  expect(response.ok()).toBe(true);
  await expect(response.text()).resolves.toBe('Hello World!');
});
