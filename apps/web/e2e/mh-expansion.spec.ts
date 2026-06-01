import { expect, test } from "@playwright/test";

test("monster page supports hunted action and capture toggle", async ({ page }) => {
  const email = `mh-e2e-${Date.now()}@test.com`;
  const password = "password123";

  await page.goto("/login");
  await page.getByPlaceholder("Email").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("link", { name: "Monsters" }).click();
  await page.getByPlaceholder("New monster name").fill("E2E Zinogre");
  await page.getByRole("button", { name: "Add Monster" }).click();
  await page.getByRole("link", { name: "E2E Zinogre" }).click();

  await expect(page.getByRole("button", { name: "Hunted" })).toBeVisible();
  await page.getByRole("button", { name: "Hunted" }).click();
  await expect(page.getByLabel("Increase Hunts")).toBeVisible();

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("Can be captured").uncheck();
  await expect(page.getByRole("button", { name: "Captured" })).not.toBeVisible();

  await page.getByRole("button", { name: "Weaknesses" }).click();
  const cell = page.locator("table input").first();
  await cell.fill("42");
  await cell.blur();
});
