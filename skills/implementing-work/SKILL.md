---
name: implementing-work
description: Implement the work described by the user in the spec or tickets — orchestrates TDD, typechecking, code review, and commit.
disable-model-invocation: true
---

# Implement

Implement the work described by the user in the spec or tickets.

## Scope Check

Count the independent user stories/tasks in the spec. **3 or fewer, touching ≤2 files each:** use Light Workflow below — a single continuous pass is faster and the overhead of per-task dispatch doesn't pay for itself. **More than that, or any task requiring multi-file coordination/architectural judgment:** use Heavy Workflow — a single continuous pass with no checkpoints is where mistakes in task 2 propagate uncaught into tasks 3-6, and a context compaction mid-way loses track of what's actually done.

## Light Workflow

1. **Understand the task:** Analyze the provided spec or issue tickets to determine the required changes. Identify which stack is involved (use `crossroad-stack` conventions).
2. **TDD:** Follow the general red-green-refactor cycle `/tdd`, combined with the specific stack conventions routed by `crossroad-stack` (`test-driven-development/references/java.md`, `angular.md`, `react.md`, or `python.md`).
3. **Verification:**
   - Run typechecking regularly (e.g., `./gradlew compileJava compileTestJava` for Java, `npx tsc --noEmit` or `npm run build` for TS/JS, `mypy` for Python).
   - Run single test files regularly during development.
   - Run the full test suite once at the end.
4. **Code Review:** Once done, use `/code-review` to review the work.
5. **Finalize:** Commit your work to the current branch. Imperative mood, why over what ("add TTL cleanup to Cache to bound memory in long-running processes", not "changed Cache.ts"), and reference the user story it implements if one exists. Don't describe the diff — a reader can already see the diff; say what it's for.

## Heavy Workflow

1. **Ledger check:** before dispatching anything, check `.sixth-sense/progress.md` at the repo root. Tasks listed there as complete are done — resume at the first task not marked complete. If the file doesn't exist, this is a fresh start.
2. **Decompose with explicit dependencies:** create one task per user story with `TaskCreate`, then declare real dependencies with `TaskUpdate`'s `addBlockedBy` — a task is blocked by another only if it consumes an interface/type the other one produces, or touches the same file. Don't guess this loosely: check the spec's Interfaces blocks (from `synthesizing-spec`) for producer/consumer relationships between stories, and check for file overlap. A task with no declared blockers is safe to dispatch alongside any other unblocked task; one that's blocked waits for its blocker's commit. Each task's Interfaces block is what its dispatch prompt is told about earlier decisions — don't paste whole prior-task summaries, just the interfaces it actually consumes.
3. **Dispatch, respecting the dependency graph:**
   - Estimate complexity and pick an agent tier via `dispatching-parallel-agents`' Effort Routing table (`sonnet-low/medium/high`, `haiku-batch` only for genuinely mechanical single-file changes).
   - Dispatch every currently-unblocked task (per step 2's graph, up to the agent cap) together, following `dispatching-parallel-agents`' full protocol (dispatch plan, cost bands, conflict prevention, dispatch log) — not one at a time by default anymore. A task with any declared blocker still waits for that blocker to land, dispatched alone once unblocked. If genuinely unsure whether two tasks are independent, treat them as blocking each other — the same round-up-when-unsure rule as effort routing.
   - Each dispatch gets: its requirements, the interfaces it consumes from tasks it's blocked by, and TDD (`/tdd` + the matching stack reference file) as the required method. Record the commit SHA before dispatch.
   - The subagent reports one status: **DONE** (proceed to review), **DONE_WITH_CONCERNS** (read the concerns; address correctness/scope doubts before review, note-and-proceed on mere observations), **NEEDS_CONTEXT** (provide what's missing, re-dispatch same tier), **BLOCKED** (assess: missing context → add it and retry; needs more reasoning → escalate tier; task too large → split it; plan itself is wrong → stop and ask the user).
   - **Review gate:** run the `dylan-dog` skill in Hunting mode on this task's diff (recorded-SHA..HEAD) — this is the per-task spec-compliance + code-quality gate. Critical/Important findings go back to the same subagent to fix, then re-review. Don't move to the next task with open Critical/Important findings.
   - On a clean review, mark the task `completed` via `TaskUpdate` and append one line to `.sixth-sense/progress.md`: `Task N: complete (commits <base7>..<head7>, review clean)`. This survives context compaction — after any compaction, trust the ledger and `git log` over your own recollection, never re-dispatch a task the ledger already marks done. Completing a task may unblock others — check `TaskList` for newly-dispatchable work before moving on.
4. **Verification:** typecheck and run the full suite once all tasks are done (same commands as Light Workflow).
5. **Final review:** once all tasks are complete, run `/code-review` on the whole branch (not just the last task) — the per-task gates catch local issues, this one catches integration problems between tasks.
6. **Finalize:** commit/use `finishing-a-development-branch` as appropriate.

Parallel dispatch in the Heavy Workflow is now scoped to the declared dependency graph, not banned outright — two tasks with no blocking relationship between them (different files, no shared interface) can run together. Tasks that touch the same file or consume each other's output still can't run at the same time; that risk didn't go away, it's just tracked explicitly instead of avoided by blanket rule.
