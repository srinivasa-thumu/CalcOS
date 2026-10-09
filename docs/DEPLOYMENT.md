# CalcOS Deployment Guide

## Hosting

CalcOS is deployed using Vercel and sourced from the GitHub repository:

https://github.com/srinivasa-thumu/CalcOS

Production URL:

https://calc-os-om2p-two.vercel.app/

## Repository and Build

The repository is a pnpm workspace monorepo. The lockfile and workspace configuration are maintained at the repository root.

Vercel build settings must be consistent with the actual project configuration and workspace layout. Avoid changing the Root Directory or build commands without verifying that shared packages and root configuration remain available.

Use the repository's frozen-lockfile install behavior to detect dependency mismatches.

## Environment Variables

The web application uses the public site URL setting for canonical metadata and sitemap-related URLs.

| Variable               | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public base URL of the website |

For the current deployment:

```dotenv
NEXT_PUBLIC_SITE_URL=https://calc-os-om2p-two.vercel.app
```

Configure this variable in Vercel under **Project Settings → Environment Variables**. Select the environments where it should apply.

For local development, use `apps/web/.env.local` if the application reads the variable in that workspace. Do not commit local environment files.

When a custom domain is introduced, update the variable to the canonical production URL and redeploy.

## Release Checklist

- [ ] Confirm the intended GitHub repository and branch.
- [ ] Verify the lockfile matches the workspace manifests.
- [ ] Run unit tests, linting, type checks, and production build.
- [ ] Confirm CI succeeds.
- [ ] Deploy through Vercel.
- [ ] Smoke-test the home page and calculator pages.
- [ ] Verify calculation history and validation behavior.
- [ ] Check sitemap, robots.txt, and canonical URLs.
- [ ] Test the deployed application on mobile.
- [ ] Verify the deployed commit matches the intended release.

## Rollback

If a deployment introduces a production issue, use Vercel's deployment history to identify the last known-good deployment and follow the project's approved rollback process.
