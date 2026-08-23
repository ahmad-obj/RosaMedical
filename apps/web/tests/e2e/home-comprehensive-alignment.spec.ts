import { expect, test } from "@playwright/test";

test("Plastic Surgery lead aligns with the supporting specialty rail", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto("/");

  const section = page.locator('[data-section="comprehensive-plans"]');
  await expect(section).toBeVisible();

  const lead = section.locator(".home-comprehensive__lead");
  const supporting = section.locator(".home-comprehensive__specialties");
  const leadBox = await lead.boundingBox();
  const supportingBox = await supporting.boundingBox();

  expect(leadBox).not.toBeNull();
  expect(supportingBox).not.toBeNull();
  expect(Math.abs(leadBox!.x - supportingBox!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(leadBox!.width - supportingBox!.width)).toBeLessThanOrEqual(1);

  const leadFigure = lead.locator(".home-specialty--lead");
  const supportingFigure = supporting.locator(".home-specialty").first();
  const leadFigureBox = await leadFigure.boundingBox();
  const supportingFigureBox = await supportingFigure.boundingBox();

  expect(leadFigureBox).not.toBeNull();
  expect(supportingFigureBox).not.toBeNull();
  expect(leadFigureBox!.width).toBeGreaterThan(supportingFigureBox!.width * 1.2);
});
