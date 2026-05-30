import { expect, test } from "@playwright/test";

test("user can log hunt flow and see dashboard update", async ({ page }) => {
  const email = `e2e-${Date.now()}@test.com`;
  const password = "password123";

  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Monsters" }).click();
  await page.getByPlaceholder("New monster name").fill("E2E Rathalos");
  await page.getByRole("button", { name: "Add Monster" }).click();
  await expect(page.getByText("E2E Rathalos")).toBeVisible();

  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.getByText("Total Hunts")).toBeVisible();
});
