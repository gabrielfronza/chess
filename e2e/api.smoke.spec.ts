import { expect, test } from "@playwright/test";

test("API health endpoint is reachable", async ({ request }) => {
  const response = await request.get("/api/v1/health");

  expect(response.ok()).toBe(true);
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    version: "0.1.0",
  });
});
