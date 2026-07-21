---
name: test-driven-development
description: Use when implementing a feature or fixing a bug. Enforces red-green-refactor. Loads stack-specific conventions for Java/Spring Boot, Angular, React/Next.js, or Python.
---

# TDD — Red-Green-Refactor

This is the general TDD loop. If you need stack-specific commands and conventions, load the matching reference file with the `Read` tool based on the project's stack — check build files (`pom.xml`/`build.gradle`, `package.json`, `pyproject.toml`/`requirements.txt`) if it's unclear:
- Java/Spring Boot: [references/java.md](references/java.md)
- Angular/TypeScript: [references/angular.md](references/angular.md)
- React/Next.js: [references/react.md](references/react.md)
- Python: [references/python.md](references/python.md)

---

## The Iron Law

**ONE test. ONE behavior. Watch it fail before writing code for it.** If you catch yourself about to write a second test before the first one has gone red-then-green, stop — that's the cycle breaking.

## The TDD Cycle: Vertical Slices Only

Follow this exact loop for every behavior:

1. **Confirm Interfaces**: Present the interface changes needed (classes, methods, DTOs, endpoints, components, functions) using the `AskUserQuestion` tool, and wait for the user's actual reply before writing any code or test. Narrating "I'll wait for approval" and continuing in the same turn does NOT satisfy this gate.
   - **Non-interactive session (headless/`-p`, no interactive tool available)**: there is no one to answer. Present the interfaces anyway, state explicitly in the output that this gate was skipped because no interactive tool was available, and proceed. A written spec you're implementing from can stand in for the confirmation *only if you say so explicitly* — don't silently treat it as equivalent without naming that substitution.
2. **List Behaviors**: List the behaviors to test as bullet points, and explicitly include edge/boundary cases alongside the happy path — no-op/empty inputs, already-resolved or already-terminal state, boundary-crossing conditions, and near-but-not-matching conditions (e.g. a collision check needs a test for "close but not overlapping", not only "overlapping"). Repeat step 1's gate for this list before writing the first test (same non-interactive fallback applies).
3. **Execute Cycle**: For each behavior, in order:
   - **RED**: Write **ONE** failing test that describes a single behavior. Run it and confirm it fails for the right reason. Count new failing tests added since the last GREEN — must be exactly 1. More than 1? Delete the extras before continuing.
   - **GREEN**: Before writing anything, run the check in [references/minimal-implementation.md](references/minimal-implementation.md) — YAGNI, reuse, stdlib, native feature, existing dependency, one-liner, only then new code. Write the minimal code to make that test pass. Run the test again and confirm green.
   - **REFACTOR**: Pause and look for refactor candidates. Clean up duplication, improve design, and ensure clean architecture while tests stay green. Be honest — force yourself to refactor.

## Important Rules

* **Vertical Slices**: Each cycle must be a thin vertical slice through all layers. Test the behavior, not the layer.
* **No Horizontal Slicing**: Do NOT write all tests first, then all implementation. This is explicitly banned — if your last tool call was "write N tests" and N > 1, you already broke this rule.
* **Mandatory TDD**: All production code must follow TDD. No exceptions for "simple" code, glue code, or utility helpers.
* **Skipping steps 1-2 is not a shortcut, it's a bug**: "the interface is obvious" is exactly the case where a 30-second confirmation is cheapest relative to the cost of discovering a misunderstanding after 200 lines of code.
* **Test real behavior, not mocks**: before adding any mock or a test-only method to production code, load [testing-anti-patterns.md](testing-anti-patterns.md).

## Red Flags — STOP

- Behavior/interface list narrated as text with no real user reply before the first test
- More than one new failing test exists at once
- Behavior list has no edge/boundary case, only happy-path
- About to implement code for a test not yet watched failing

## Before Calling a Cycle Done

- [ ] Did I write exactly one test since the last GREEN?
- [ ] Did I actually see it fail, and for the right reason (not a typo)?
- [ ] Did interface and behavior list get an explicit, real user reply — or, in a non-interactive session, an explicit stated declaration that the gate was skipped — not just silently narrated text, before the first test?
- [ ] Does the behavior list include at least one edge/boundary case, not only the happy path?

Any box unchecked means the cycle wasn't followed — go back, don't rationalize forward.
