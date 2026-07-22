import { test, expect } from "@playwright/test";

test("Software Testing Basics citations match the Search Engine Basics interaction contract", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("https://searchenginebasics.io/search-engine-fundamentals/vector-space-model", { waitUntil: "domcontentloaded" });

  const referenceCitation = page.locator(".citation-ref").first();
  await expect(referenceCitation).toBeVisible();
  await referenceCitation.hover();
  await expect(referenceCitation.locator(".citation-popover")).toBeVisible();
  await expect(referenceCitation.locator(".citation-popover-title")).toContainText("Source");
  await expect(referenceCitation.locator(".citation-popover-link")).toContainText("View source");

  const referenceTarget = await referenceCitation.getAttribute("href");
  await referenceCitation.focus();
  await referenceCitation.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${referenceTarget}$`));
  await expect(page.locator(referenceTarget)).toBeVisible();

  await page.goto("/articles/testing-tools-frameworks", { waitUntil: "domcontentloaded" });

  const localCitation = page.locator(".citation-ref").first();
  await expect(localCitation).toBeVisible();
  await localCitation.hover();
  await expect(localCitation.locator(".citation-popover")).toBeVisible();
  await expect(localCitation.locator(".citation-popover-title")).toContainText("Source");
  await expect(localCitation.locator(".citation-popover-link")).toContainText("View source");

  const localTarget = await localCitation.getAttribute("href");
  await localCitation.focus();
  await localCitation.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${localTarget}$`));
  await expect(page.locator(localTarget)).toBeVisible();
});
