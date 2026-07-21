---
name: dispatching-parallel-agents
description: Use when facing multiple independent tasks that can be worked on without shared state or sequential dependencies — dispatches specialized subagents with effort routing, batching, and agent cap.
---

# Dispatching Parallel Agents

## Pre-Dispatch: Read Preferences
Before any dispatch, read `.sixth-sense/model-preferences.md` from the project root.
If the file does not exist, use defaults: Sonnet medium, **Haiku batching enabled** for the `haiku-batch` tier only (the eligibility bar below is already the guardrail — narrow it further, don't widen it), max 4 agents. Opus is never used for task routing or dispatch, regardless of preferences — the only Opus entry point is the narrow second-opinion pass in `synthesizing-spec`/`requesting-code-review` (`opus-review` flag, on by default), never this skill's Effort Routing. See `configuring-sixth-sense`. Run `/setup-sixth-sense` to change these defaults (e.g. to turn Haiku batching off entirely), not to unlock them.

## When to Dispatch
Dispatch parallel subagents only when:
* **Independence:** Tasks have no shared state or sequential dependencies (they do not modify the same files or rely on each other's output).
* **Workload:** The total volume of work is significant or benefits from parallel execution.
* **Complexity:** The task can be cleanly decomposed into distinct, non-overlapping workstreams.

If tasks are sequential or tightly coupled, execute them iteratively.

## Effort Routing
For each task, estimate difficulty and assign the appropriate agent-type:

| Criteria | Agent |
|---|---|
| Single-file change, <20 lines, no architectural decision | `haiku-batch` (if enabled, otherwise `sonnet-low`) |
| Well-defined task, 1-3 files, straightforward logic | `sonnet-low` |
| Business logic, targeted refactor, 2-5 files | `sonnet-medium` |
| Architectural decisions, multi-file refactor, non-obvious logic | `sonnet-high` |
| Web research — gathering sources, fact-checking, SERP/keyword lookups, writing a dossier | `sonnet-research` (the only tier with `WebSearch`/`WebFetch` — every other tier lacks them, so don't fall back to `general-purpose` for research batches) |

**Don't route on the task description alone — check the actual code being touched.** Free-form judgment on "how complex does this sound" is inconsistent run to run: the same task can plausibly read as `sonnet-low` or `sonnet-medium` depending on framing, and the wrong call costs a resume, not just a slower one. Before assigning a tier, spend one cheap look at what's actually being modified:
- **New, empty-slate file with a fully-specified test list** → the description-based tier stands.
- **Existing file being modified, especially one with async/timer/concurrency/lifecycle logic (`useEffect`, listeners, connection/resource handling), or with no existing test coverage to lean on** → bump the tier up one notch from what the description alone would suggest, regardless of how self-contained the task sounds. This costs one `Read`/`Grep`, not a subagent turn.
- When genuinely unsure between two tiers, round up, not down — the same asymmetry as `dylan-dog-triage`'s calibration: a task that turns out easier than its tier wastes some budget; a task that turns out harder than its tier wastes a whole resume cycle.

**Cost per turn beats price per token**: the cheaper model often takes 2-3x the turns on a multi-step task, costing more overall. Don't route to `haiku-batch` just because it's the cheapest tier — route there only genuinely mechanical tasks (single file, complete spec, no decisions).

## Batching
Tasks that fall within the `haiku-batch` threshold must be grouped into a single call — not dispatched one by one. The prompt to the batch agent must contain the full list of tasks to execute in sequence.

## Agent Cap
Do not dispatch more than N `Agent()` calls in the same turn. N defaults to 4, configurable in `.sixth-sense/model-preferences.md` under the `max-parallel-agents` field.

## Protocol
1. **Present the Dispatch Plan:** Before calling any `Agent()`, show the full plan as a table — every task (or batch), the agent-type assigned to it, a one-line reason tied to the Effort Routing criteria above, and a rough relative cost band (`$` haiku-batch, `$$` sonnet-low, `$$$` sonnet-medium/sonnet-research, `$$$$` sonnet-high — don't invent precise dollar figures, they go stale and imply false precision; the point is to make the *relative* spend visible, not to forecast a bill). E.g. "Task 3 → `haiku-batch` (Haiku 4.5, `$`): single-file rename, no logic change" / "Task 5 → `sonnet-high` (`$$$$`): touches 6 files, requires an architectural call on the caching layer".
   - **Interactive session:** use `AskUserQuestion` (or an explicit question if no other interactive tool is available) and wait for the user's actual reply before dispatching anything. Narrating the plan and continuing in the same turn does not satisfy this gate. If the user pushes back on a tier, adjust only the disputed items and re-confirm before proceeding.
   - **Non-interactive session (headless/`-p`, no interactive tool available):** there is no one to answer. Show the plan, state explicitly in the output that the confirmation gate was skipped because no interactive tool was available, and proceed. Do not silently skip the gate without saying so — a plan that was never confirmed must never look like one that was.
2. **Scope Isolation:** Give each subagent only the task description and the relevant files. Do not pass the entire session context.
3. **Instruction Precision:** Explicit, granular instructions. For file edits, provide exact strings to search and replace.
4. **Skill Enforcement:** Subagents have `Read` but not `Skill` — they cannot invoke a skill by trigger phrase or name. "Follow the tdd skill" means nothing to them. Instead, inline the concrete rules that matter for this task directly in the dispatch prompt, and/or give the exact file path to a reference file for them to `Read` themselves (e.g. `skills/test-driven-development/references/java.md`, `skills/dylan-dog/checklist.md`) — never assume a subagent will discover or load anything you didn't name explicitly.
5. **Result Synthesis:** Each subagent must provide a concise summary of the work done, with the commit SHA or verification evidence.
6. **Conflict Prevention:** Strictly forbid concurrent agents from modifying the same file.
7. **Log the Dispatch:** Append one line per subagent to `.sixth-sense/dispatch-log.md` at the project root (create it with a header if it doesn't exist): `<ISO timestamp> | <agent-type> | <task description> | <one-line rationale>`. This is what makes "which skills/tiers actually fired" answerable by reading a file later, instead of digging through raw session transcripts.

**Skipping step 1 is not a shortcut, it's a bug**: routing decisions spend the user's money and turns on their behalf — a 10-second confirmation is cheap relative to discovering a wrong tier only after 4 subagents have already run.

## While Waiting for Background Dispatches
When subagents run with `run_in_background: true`, completion notifications arrive automatically — do not poll. No placeholder `Bash` calls (`sleep`, `echo waiting`), no scheduling a wakeup, no re-checking status in a loop. Do something else useful, or simply end the turn and let the notification bring you back. Only actively re-check a subagent yourself if you have a concrete reason to suspect it stalled (e.g. a notification is overdue relative to the task's expected size) — verify by reading the files it was supposed to produce, not by trusting a status message.

## Post-Dispatch
After completion, aggregate the outputs, resolve any logical conflicts, and run a final verification (`verification-before-completion` skill) before merging.
