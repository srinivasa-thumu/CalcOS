# CalcOS Roadmap

This roadmap describes possible areas of development. Items are not commitments until they are planned and implemented.

## Current Phase — Foundation

- [x] Next.js web application deployed on Vercel.
- [x] Simple Interest calculator.
- [x] Compound Interest calculator.
- [x] Browser-local calculation history.
- [x] Workspace-based shared packages.
- [x] Unit and end-to-end test infrastructure.

Verify the current repository and test suite before treating every item above as a release certification.

## Potential Next Steps

### Financial calculators

- Expand the calculator catalogue.
- Add reusable calculator input and result patterns.
- Document financial formulas, units, rounding rules, and assumptions.
- Add regression tests for boundary cases.

### User experience

- Improve accessibility and mobile usability.
- Improve error messages and input guidance.
- Refine calculation history and empty states.

### Engineering quality

- Expand unit and end-to-end coverage.
- Keep CI checks aligned with local development.
- Improve deployment and release documentation.
- Review security, performance, and accessibility as features grow.

### Future platform capabilities

Potential longer-term areas include account-based features, server-side persistence, and cross-device synchronization. These require separate design decisions and are not currently implied by browser-local history.

## Current Limitations

- History is stored locally in the browser.
- No cross-device synchronization is provided.
- A custom domain has not yet been selected.
- No open-source license has been specified.
