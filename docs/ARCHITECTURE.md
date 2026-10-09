# CalcOS Architecture

## 1. Overview

CalcOS is organized as a pnpm workspace monorepo. The web application consumes shared packages for financial calculations, domain types, validation, money-related utilities, and storage.

The design separates reusable business logic from the presentation layer.

## 2. Components

### Web application — `apps/web`

Responsibilities:

- Render pages using the Next.js App Router.
- Present calculator forms and results.
- Validate user input through the application and shared validation logic.
- Display and manage calculation history.
- Integrate shared workspace packages.

### `packages/calculation-core`

Contains reusable financial calculation logic, independent of the user interface wherever practical.

### `packages/domain-types`

Defines shared domain types used across the application and packages.

### `packages/validation`

Contains reusable input validation rules.

### `packages/money`

Contains money-related utilities. Monetary precision and rounding rules should be explicitly defined and tested for each financial use case.

### `packages/storage`

Provides storage-related abstractions used by the application.

## 3. Calculation Flow

A typical calculator interaction follows this sequence:

1. The user enters financial inputs.
2. The application validates the inputs.
3. Validated inputs are passed to the calculation logic.
4. The calculation result is presented to the user.
5. Where supported, the calculation is recorded in browser-local history.

The calculation layer should remain independent of React components so it can be unit-tested directly.

## 4. Storage

Calculation history currently uses browser-local IndexedDB storage.

Consequences:

- History is specific to the browser profile and origin.
- Clearing site data may remove stored history.
- History does not automatically synchronize across devices.
- Browser-local storage is not a substitute for a server-side backup.

## 5. Quality Attributes

The architecture should prioritize:

- Correct financial calculations.
- Explicit validation and rounding behavior.
- Reusable business logic.
- Responsive accessibility-conscious UI.
- Automated unit and browser testing.
- Maintainable package boundaries.

## 6. Future Evolution

Possible future capabilities include additional calculators, reusable calculator templates, expanded financial tests, and optional server-side persistence.

These are future directions, not claims about currently implemented features.
