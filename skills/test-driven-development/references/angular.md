# TDD Angular — Jasmine, Karma, Jest

Use these stack-specific conventions when implementing or debugging Angular frontend code.

## Conventions

* **Unit tests**: Jasmine + Karma (default) or Jest. Use `TestBed` to configure component testing.
* **Test command**:
  - Run single spec: `ng test --include=src/app/path/to/file.spec.ts`
  - Run full suite: `ng test --watch=false`
* **Typecheck**: `npx tsc --noEmit` or `ng build` — run regularly.
* **Naming**: Describe block: `describe('ComponentName/Service', ...)` and it block: `it('should [behavior] when [condition]', ...)`
* **No test pollution**: Clean up components/services using `afterEach` or by creating fresh instances.
