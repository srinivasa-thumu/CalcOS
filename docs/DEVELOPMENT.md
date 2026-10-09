# CalcOS Development Guide

## Prerequisites

- Node.js 20 or later.
- pnpm 10.18.0.

Use the package manager version declared in the root `package.json`.

## Setup

```bash
git clone https://github.com/srinivasa-thumu/CalcOS.git
cd CalcOS
pnpm install --frozen-lockfile
```

## Local Development

```bash
pnpm dev
```

For an application-specific task, use the scripts declared in `apps/web/package.json`.

## Testing and Quality Checks

Run the relevant checks before submitting changes:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

Run browser tests with:

```bash
pnpm test:e2e
```

The end-to-end script builds the project before running Playwright tests.

## Development Guidelines

1. Keep financial calculations out of presentation components.
2. Reuse shared packages instead of duplicating business logic.
3. Validate invalid, boundary, and ordinary inputs.
4. Add unit tests for calculation behavior and edge cases.
5. Add end-to-end tests for important user journeys.
6. Avoid committing secrets or local environment files.
7. Keep `pnpm-lock.yaml` synchronized with workspace manifests.
8. Preserve compatibility with the declared Node.js and pnpm versions.

## Branch and Commit Workflow

1. Create a feature branch.
2. Make focused changes.
3. Run applicable quality checks.
4. Inspect `git diff`.
5. Commit with a descriptive message.
6. Push and verify CI and deployment results.
