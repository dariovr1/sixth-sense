---
name: diagnosing-bugs
description: Use when encountering bugs, test failures, or unexpected behavior — replaces random fixes with a disciplined, hypothesis-driven diagnosis loop. Trigger on "diagnose", "debug", "broken", "failing", "throwing".
---

# Diagnosing Bugs

## The Iron Law
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.
Complete the investigation before proposing or implementing any changes. Don't change production code until you've named the root cause out loud.

## The Six-Phase Loop

### 1. Reproduce
Create a reliable feedback loop that proves the bug exists.
- Isolate: simplify environment and input to the smallest possible test case.
- Verify: confirm the reproduction steps consistently trigger the error.
- For Java: isolate with a single JUnit test if possible. Run with `./gradlew test --tests "TestClass.testMethod"`.

### 2. Minimise
Strip away unnecessary code and context until only the failure remains.
- Remove unrelated beans, configurations, dependencies.
- For Spring Boot: test with a minimal `@SpringBootTest` context or a plain unit test.

### 3. Hypothesise
Formulate a theory about the root cause based on evidence.
- State ONE testable hypothesis.
- Check recent changes: `git diff` / `git log`.
- For Java: read the full stack trace. Check bean wiring, transaction boundaries, lazy loading.

### 4. Instrument
Add logging, breakpoints, or probes to verify the hypothesis.
- For Spring Boot: temporary `log.debug()` statements, `@Sql` scripts for DB state, Testcontainers for isolated DB testing.
- Do NOT modify production logic during this phase.

### 5. Fix
Apply the correction — minimal, targeted, addressing root cause not symptoms.

**If the fix doesn't work:** count how many fixes you've tried on this bug.
- **Fewer than 3:** return to phase 3 (Hypothesise) with what you just learned — don't stack a second fix on top of the first.
- **3 or more:** STOP. Do not attempt fix #4. This pattern — each fix revealing new shared state/coupling somewhere else, or requiring "just a bit more refactoring" — means the architecture is wrong, not the hypothesis. Question the fundamentals with your human partner before touching code again.

### 6. Regression Test
Verify the fix and ensure no existing functionality is broken.
- Write a test that reproduces the original bug (red), apply the fix (green).
- Run full test suite: `./gradlew test`.
