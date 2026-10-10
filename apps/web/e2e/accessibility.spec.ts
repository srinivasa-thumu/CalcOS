import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/calculators/simple-interest',
  '/calculators/compound-interest',
  '/history',
  '/robots.txt',
  '/sitemap.xml',
];

test.describe('Accessibility and responsive checks', () => {
  test('main pages render without uncaught browser errors', async ({
    page,
  }) => {
    const pageErrors: string[] = [];

    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
    });

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('load');
    }

    expect(pageErrors).toEqual([]);
  });

  test('simple interest form has accessible names and labeled fields', async ({
    page,
  }) => {
    await page.goto('/calculators/simple-interest');

    await expect(
      page.getByRole('form', { name: 'Simple interest calculator' }),
    ).toBeVisible();

    await expect(page.getByLabel('Principal Amount')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Interest Rate Type' }),
    ).toBeVisible();
    await expect(page.getByLabel('Annual Interest Rate (%)')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Duration Type' }),
    ).toBeVisible();
    await expect(page.getByLabel('Years')).toBeVisible();
    await expect(page.getByLabel('Months (0–11)')).toBeVisible();
    await expect(page.getByLabel('Days')).toBeVisible();
  });

  test('compound interest form has accessible names and labeled fields', async ({
    page,
  }) => {
    await page.goto('/calculators/compound-interest');

    await expect(
      page.getByRole('form', { name: 'Compound interest calculator' }),
    ).toBeVisible();

    await expect(page.getByLabel('Principal Amount')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Interest Rate Type' }),
    ).toBeVisible();
    await expect(page.getByLabel('Annual Interest Rate (%)')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Duration Type' }),
    ).toBeVisible();
    await expect(page.getByLabel('Years')).toBeVisible();
    await expect(page.getByLabel('Months (0–11)')).toBeVisible();
    await expect(page.getByLabel('Days')).toBeVisible();
    await expect(
      page.getByRole('combobox', { name: 'Compounding Frequency' }),
    ).toBeVisible();
  });

  test('calculator controls are reachable using the keyboard', async ({
    page,
  }) => {
    await page.goto('/calculators/simple-interest');

    await page.keyboard.press('Tab');

    const firstFocusedElement = await page.evaluate(() => {
      const element = document.activeElement;

      return {
        tagName: element?.tagName,
        isBody: element === document.body,
      };
    });

    expect(firstFocusedElement.isBody).toBe(false);
    expect(firstFocusedElement.tagName).toBeTruthy();

    const calculateButton = page.getByRole('button', {
      name: 'Calculate',
    });

    let calculateButtonFocused = false;

    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press('Tab');

      calculateButtonFocused = await calculateButton.evaluate(
        (element) => element === document.activeElement,
      );

      if (calculateButtonFocused) {
        break;
      }
    }

    expect(calculateButtonFocused).toBe(true);
  });

  test('main pages do not overflow horizontally', async ({ page }) => {
    for (const route of routes.slice(0, 4)) {
      await page.goto(route);

      const dimensions = await page.evaluate(() => ({
        viewportWidth: document.documentElement.clientWidth,
        documentWidth: document.documentElement.scrollWidth,
      }));

      expect(
        dimensions.documentWidth,
        `Unexpected horizontal overflow on ${route}`,
      ).toBeLessThanOrEqual(dimensions.viewportWidth);
    }
  });

  test('empty simple interest form displays validation errors', async ({
    page,
  }) => {
    await page.goto('/calculators/simple-interest');

    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByText('Principal must be greater than 0.'),
    ).toBeVisible();

    await expect(
  page
    .getByRole('form', { name: 'Simple interest calculator' })
    .getByRole('alert')
    .filter({
      hasText: 'Enter whole numbers for years, months, and days.',
    }),
).toBeVisible();

    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toHaveCount(0);
  });
});