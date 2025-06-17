const { test, expect } = require('@playwright/test');

const time_out = 120000;

// פונקציית עזר לשליפת המחיר הנכון מהווריאציה
async function getVariationPrice(page) {
  await page.setDefaultTimeout(time_out);
  const priceElement = await page.waitForSelector('div.woocommerce-variation-price .woocommerce-Price-amount');
  const priceText = await priceElement.textContent();
  return priceText;
}

// ✅ סטאר X – מידה 57 (ברירת מחדל) + אגוז => ₪ 1,990
test('סטאר X – רק בחירת צבע אגוז (מידה כבר מסומנת 57) => מחיר 1,990 ש"ח', async ({ page }) => {
  await page.setDefaultTimeout(time_out);
  await page.goto('https://star.co.il/product/%d7%9e%d7%90%d7%95%d7%95%d7%a8%d7%a8-%d7%aa%d7%a7%d7%a8%d7%94-%d7%a1%d7%98%d7%90%d7%a8-x/');
  await page.waitForLoadState('networkidle');

  const colorBtn = page.locator('li[title="אגוז"]').first();
  await colorBtn.scrollIntoViewIfNeeded();
  await colorBtn.waitFor({ state: 'visible'});
  await colorBtn.click();

  const priceText = await getVariationPrice(page);
  console.log('📦 סטאר X – אגוז + 57:', priceText);
  expect(priceText).toContain('1,990');
});

// ✅ סטאר X – צבע שחור + מידה 48 => ₪ 1,199
test('סטאר X – שחור ואז מידה 48 => מחיר 1,199 ש"ח', async ({ page }) => {
  await page.setDefaultTimeout(time_out);
  await page.goto('https://star.co.il/product/%d7%9e%d7%90%d7%95%d7%95%d7%a8%d7%a8-%d7%aa%d7%a7%d7%a8%d7%94-%d7%a1%d7%98%d7%90%d7%a8-x/');
  await page.waitForLoadState('networkidle');

  const colorBtn = page.locator('li[title="שחור"]').first();
  await colorBtn.scrollIntoViewIfNeeded();
  await colorBtn.waitFor({ state: 'visible'});
  await colorBtn.click();

  const sizeBtn = page.locator('span.variable-item-span-button', { hasText: "48" }).first();
  await sizeBtn.scrollIntoViewIfNeeded();
  await sizeBtn.waitFor({ state: 'visible'});
  await sizeBtn.click();

  const priceText = await getVariationPrice(page);
  console.log('📦 סטאר X – שחור + 48:', priceText);
  expect(priceText).toContain('1,199');
});

// ✅ סטאר 7 – מידה 52 (צבע שחור מסומן כברירת מחדל) => ₪ 1,200
test('סטאר 7 – מידה 52 עם צבע כבר מסומן => מחיר 1,200 ש"ח', async ({ page }) => {
  await page.setDefaultTimeout(time_out);
  await page.goto('https://star.co.il/product/%d7%9e%d7%90%d7%95%d7%95%d7%a8%d7%a8-%d7%aa%d7%a7%d7%a8%d7%94-%d7%a1%d7%98%d7%90%d7%a8-7/');
  await page.waitForLoadState('networkidle');

  const sizeBtn = page.locator('span.variable-item-span-button', { hasText: "52" }).first();
  await sizeBtn.scrollIntoViewIfNeeded();
  await sizeBtn.waitFor({ state: 'visible' });
  await sizeBtn.click();

  const priceText = await getVariationPrice(page);
  console.log('📦 סטאר 7 – מידה 52:', priceText);
  expect(priceText).toContain('1,200');
});
