# CalcOS

**CalcOS** is a web-based calculator platform designed to provide accurate, practical financial calculations through a clean and responsive interface.

## Features

- **Simple Interest:** Calculate interest and maturity amount.
- **Compound Interest:** Calculate compound growth with configurable compounding frequency.
- **Calculation History:** Review previous calculations stored locally in the browser.
- **Input Validation:** Validate calculator inputs before performing calculations.
- **Responsive UI:** Use the application on desktop and mobile devices.

## Technology Stack

- **Frontend:** Next.js App Router, React, TypeScript
- **UI:** Material UI (MUI), Emotion
- **Monorepo:** pnpm workspaces and Turborepo
- **Testing:** Vitest and Playwright
- **Hosting:** Vercel

## Project Structure

```text
CalcOS/
├── apps/
│   └── web/                  # Next.js web application
├── packages/
│   ├── calculation-core/     # Calculation logic
│   ├── domain-types/         # Shared domain types
│   ├── money/                # Money-related utilities
│   ├── storage/              # Storage abstractions
│   └── validation/           # Input validation
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── DEPLOYMENT.md
│   └── ROADMAP.md
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
└── package.json
```

## Prerequisites

- Node.js 20 or later
- pnpm 10.18.0

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/srinivasa-thumu/CalcOS.git
cd CalcOS
pnpm install --frozen-lockfile
```

Start the development environment:

```bash
pnpm dev
```

Open the local URL printed by the development server.

## Available Commands

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Start development tasks                   |
| `pnpm build`        | Build workspace applications and packages |
| `pnpm test`         | Run unit tests                            |
| `pnpm test:e2e`     | Build and run Playwright end-to-end tests |
| `pnpm lint`         | Run linting tasks                         |
| `pnpm typecheck`    | Run TypeScript checks                     |
| `pnpm format`       | Format supported project files            |
| `pnpm format:check` | Check formatting                          |

## Deployment

CalcOS is deployed on Vercel:

https://calc-os-om2p-two.vercel.app/

The application is maintained in the `main` branch of the GitHub repository.

See [Deployment Guide](docs/DEPLOYMENT.md) for environment configuration and deployment practices.

## Architecture and Development

- [Architecture](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Roadmap and Limitations](docs/ROADMAP.md)

## Current Limitations

- Calculation history is stored locally in the browser.
- History is not synchronized across devices.
- No server-side account system or cloud history synchronization is currently provided.

## Contributing

1. Create a feature branch.
2. Make the required changes.
3. Run relevant tests, linting, and type checks.
4. Review the changes before committing.
5. Open a pull request with a clear description.

## License

No open-source license has been specified yet. Unless a license is added, the project should not be assumed to be available for unrestricted reuse.
