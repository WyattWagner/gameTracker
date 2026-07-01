import { expect, test } from "@playwright/test";

test("user can log hunt flow and see dashboard update", async ({ page }) => {
  const email = `e2e-${Date.now()}@test.com`;
  const password = "password123";

  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Expedition Log" })).toBeVisible();

  await page.getByRole("button", { name: "Monsters" }).click();
  await page.getByPlaceholder("Custom monster name").fill("E2E Rathalos");
  await page.getByRole("button", { name: "Add custom" }).click();
  await expect(page.getByText("E2E Rathalos")).toBeVisible();

  await page.getByRole("button", { name: "Home" }).click();
  await expect(page.getByText("Quests Completed")).toBeVisible();
});
