import { expect, test } from '@playwright/test';

test.describe('Simple Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculators/simple-interest');
  });

  test('calculates interest and total amount', async ({ page }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');
    await page.getByLabel('Time (Years)').fill('2');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('Simple Interest');
    await expect(result).toContainText('1,000.00');
    await expect(result).toContainText('11,000.00');
  });

  test('shows validation errors for an empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByText('Principal amount must be greater than 0.'),
    ).toBeVisible();

    await expect(
      page.getByText('Time period must be greater than 0.'),
    ).toBeVisible();

    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toHaveCount(0);
  });

  test('reset clears inputs and the result', async ({ page }) => {
    await page.getByLabel('Principal Amount').fill('10000');
    await page.getByLabel('Annual Interest Rate (%)').fill('5');
    await page.getByLabel('Time (Years)').fill('2');

    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(
      page.getByRole('region', { name: 'Calculation result' }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(page.getByLabel('Principal Amount')).toHaveValue('');
    await expect(page.getByLabel('Annual Interest Rate (%)')).toHaveValue('');
    await expect(page.getByLabel('Time (Years)')).toHaveValue('');

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
    await page.getByLabel('Time (Years)').fill('2');

    await page.getByRole('button', { name: 'Calculate' }).click();

    const result = page.getByRole('region', {
      name: 'Calculation result',
    });

    await expect(result).toBeVisible();
    await expect(result).toContainText('Compound Interest');
    await expect(result).toContainText('1,025.00');
    await expect(result).toContainText('11,025.00');
  });

  test('reset restores the default compounding frequency', async ({
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
  });
});

test('saved calculations appear in history after navigation and reload', async ({
  page,
}) => {
  await page.goto('/calculators/simple-interest');

  await page.getByLabel('Principal Amount').fill('10000');
  await page.getByLabel('Annual Interest Rate (%)').fill('5');
  await page.getByLabel('Time (Years)').fill('2');

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