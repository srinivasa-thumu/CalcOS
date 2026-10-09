const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = new URL(
  configuredSiteUrl || 'http://localhost:3000',
);

export const siteName = 'CalcOS';

export const defaultDescription =
  'Free online financial calculators for simple interest and compound interest. Calculate interest and total returns quickly and accurately.';