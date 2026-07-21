# TDD React / Next.js — Vitest, Jest, RTL

Use these stack-specific conventions when implementing or debugging React or Next.js code.

## Conventions

* **Unit/Integration tests**: Vitest or Jest + React Testing Library (RTL).
* **Test command**:
  - Run single test: `npm test path/to/Component.test.tsx` or `npx vitest path/to/Component.test.tsx`
  - Run full suite: `npm test` or `npx vitest run`
* **Typecheck**: `npx tsc --noEmit` or `npm run build` — run regularly.
* **Naming**: Describe block: `describe('ComponentName/Service', ...)` and it block: `it('should [behavior] when [condition]', ...)`
* **No test pollution**: Clean up components/services using `afterEach` or by creating fresh instances. In React, use `afterEach(cleanup)` (from `@testing-library/react`) to unmount DOM trees.
