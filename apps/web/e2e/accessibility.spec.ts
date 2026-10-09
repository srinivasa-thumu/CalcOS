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

  test('calculator forms have accessible names and labeled fields', async ({
    page,
  }) => {
    await page.goto('/calculators/simple-interest');

    await expect(
      page.getByRole('form', { name: 'Simple interest calculator' }),
    ).toBeVisible();

    await expect(page.getByLabel('Principal Amount')).toBeVisible();
    await expect(
      page.getByLabel('Annual Interest Rate (%)'),
    ).toBeVisible();
    await expect(page.getByLabel('Time (Years)')).toBeVisible();

    await page.goto('/calculators/compound-interest');

    await expect(
      page.getByRole('form', { name: 'Compound interest calculator' }),
    ).toBeVisible();

    await expect(page.getByLabel('Principal Amount')).toBeVisible();
    await expect(
      page.getByLabel('Annual Interest Rate (%)'),
    ).toBeVisible();
    await expect(page.getByLabel('Time (Years)')).toBeVisible();
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

    // Tab through the page and confirm the form's Calculate button
    // can receive keyboard focus.
    const calculateButton = page.getByRole('button', {
      name: 'Calculate',
    });

    let calculateButtonFocused = false;

    for (let i = 0; i < 20; i += 1) {
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

  test('validation errors are displayed when required inputs are empty', async ({
    page,
  }) => {
    await page.goto('/calculators/simple-interest');

    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByText('Principal amount must be greater than 0.'),
    ).toBeVisible();

    await expect(
      page.getByText('Time period must be greater than 0.'),
    ).toBeVisible();
  });
});