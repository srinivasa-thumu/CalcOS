import { expect, test } from '@playwright/test';

test.describe('Simple Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators/simple-interest');
  });

  test('calculates interest using an annual rate and manual duration', async ({
    page,
  }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');
    await page.getByLabel('Years').fill('2');
    await page.getByLabel('Months (0–11)').fill('0');
    await page.getByLabel('Days').fill('0');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('Simple Interest');
    await expect(result).toContainText('1,000.00');
    await expect(result).toContainText('11,000.00');
    await expect(result).toContainText('2y');
  });

  test('calculates simple interest using monthly interest per ₹100', async ({
    page,
  }) => {
    await page.getByLabel('Principal Amount').fill('10000');

    await page.getByRole('combobox', { name: 'Interest Rate Type' }).click();
    await page.getByRole('option', { name: 'Monthly interest per ₹100' }).click();

    await page.getByLabel('Monthly Interest per ₹100 (₹)').fill('1.5');
    await page.getByLabel('Years').fill('1');
    await page.getByLabel('Months (0–11)').fill('0');
    await page.getByLabel('Days').fill('0');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('1,800.00');
    await expect(result).toContainText('11,800.00');
    await expect(result).toContainText('18%');
  });

  test('calculates duration from start and end dates', async ({ page }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');

    await page.getByRole('combobox', { name: 'Duration Type' }).click();
    await page.getByRole('option', { name: 'Start and end dates' }).click();

    await page.getByLabel('Start Date').fill('2024-01-01');
    await page.getByLabel('End Date').fill('2026-05-03');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('2y, 4m, 2 days');
  });

  test('shows validation errors for an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByText('Principal must be greater than 0.'),
    ).toBeVisible();

    await expect(
  page
    .getByRole('alert')
    .filter({
      hasText: 'Enter whole numbers for years, months, and days.',
    }),
).toBeVisible();

    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toHaveCount(0);
  });

  test('reset clears inputs and restores default modes', async ({ page }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');
    await page.getByLabel('Years').fill('2');
    await page.getByLabel('Months (0–11)').fill('0');
    await page.getByLabel('Days').fill('0');

    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(page.getByLabel('Annual Interest Rate (%)')).toHaveValue('');
    await expect(page.getByLabel('Years')).toHaveValue('');
    await expect(
      page.getByRole('combobox', { name: 'Interest Rate Type' }),
    ).toContainText('Annual interest rate (%)');
    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toHaveCount(0);
  });
});

test.describe('Compound Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators/compound-interest');
  });

  test('calculates compound interest with annual compounding', async ({
    page,
  }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');
    await page.getByLabel('Years').fill('2');
    await page.getByLabel('Months (0–11)').fill('0');
    await page.getByLabel('Days').fill('0');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('Compound Interest');
    await expect(result).toContainText('1,025.00');
    await expect(result).toContainText('11,025.00');
  });

  test('applies monthly interest per ₹100 directly for monthly compounding', async ({
    page,
  }) => {
    await page.getByLabel('Principal Amount').fill('10000');

    await page.getByRole('combobox', { name: 'Interest Rate Type' }).click();
    await page.getByRole('option', { name: 'Monthly interest per ₹100' }).click();

    await page.getByLabel('Monthly Interest per ₹100 (₹)').fill('1.5');
    await page.getByLabel('Years').fill('1');
    await page.getByLabel('Months (0–11)').fill('0');
    await page.getByLabel('Days').fill('0');

    const frequency = page.getByRole('combobox', {
      name: 'Compounding Frequency',
    });

    await frequency.click();
    await page.getByRole('option', { name: 'Monthly' }).click();

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('1,956.18');
    await expect(result).toContainText('11,956.18');
  });

  test('reset restores default compounding frequency and rate mode', async ({
    page,
  }) => {
    const frequency = page.getByRole('combobox', {
      name: 'Compounding Frequency',
    });

    await frequency.click();
    await page.getByRole('option', { name: 'Monthly' }).click();

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(frequency).toContainText('Annually');
    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(
      page.getByRole('combobox', { name: 'Interest Rate Type' }),
    ).toContainText('Annual interest rate (%)');
  });
});

test('saved calculations appear in history after navigation and reload', async ({
  page,
}) => {
  await page.goto('/calculators/simple-interest');

  await page.getByLabel('Principal Amount').fill('10000');
  await page.getByLabel('Annual Interest Rate (%)').fill('5');
  await page.getByLabel('Years').fill('2');
  await page.getByLabel('Months (0–11)').fill('0');
  await page.getByLabel('Days').fill('0');

  await page.getByRole('button', { name: 'Calculate' }).click();

  await expect(
    page.getByRole('region', { name: 'Calculation result' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'History' }).click();
  await expect(page).toHaveURL(/\/history$/);

  await page.reload();

  await expect(page.getByText(/Simple Interest/i).first()).toBeVisible();
  await expect(page.getByText(/11,000\.00/).first()).toBeVisible();
});