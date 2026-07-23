---
name: requesting-code-review
description: Use when completing tasks, implementing features, or before merging — dispatches Dylan Dog (edge-case hunting) and processes feedback with technical rigor, not performative agreement.
---

# Code Review

## When to Request Review
**Mandatory:** After completing a major feature; Before merging into main; After each task in parallel agent workflows.
**Optional:** When stuck; Before refactoring; After fixing a complex bug.

## Requesting Review

### 1. Check for a git repository
```bash
git rev-parse --is-inside-work-tree
```
If this fails (no `.git`, e.g. a scratch/test directory), skip to **1b — Degraded Review** below. Otherwise continue to **2 — Dispatch via Dylan Dog**.

### 1b. No Git Repository: Snapshot Review
Dylan Dog's triage stage needs a diff to size and partition — without one there's nothing to triage, so **skip triage**. That doesn't mean giving up on a fresh, dedicated reviewer: dispatch `dylan-dog-hunter` directly, in **snapshot mode** — no {BASE_SHA}/{HEAD_SHA}, just the current contents of every file created or modified in this session (you already know this list from your own tool calls — don't guess). A dedicated subagent reviewing fresh, without the bias of having written the code itself, beats self-review even without a diff to work from.

1. List every file created or modified in this session.
2. Dispatch `dylan-dog-hunter` with {DESCRIPTION}, {PLAN_OR_REQUIREMENTS}, and the file list in place of a diff — it applies the full checklist to each file read fresh, since there's no history to partition by risk.
3. State explicitly in the output that this was a **snapshot review — no git repository, triage skipped** — so it's never mistaken for the full triage-scoped process.

### 1c. Fallback: Manual Review (only if dispatch itself isn't viable)
If dispatching a subagent isn't appropriate for this session (e.g. severe budget constraints already flagged elsewhere), fall back to reviewing it yourself instead of skipping review — but say explicitly why you didn't dispatch the hunter, don't silently downgrade:
1. Apply the categories from `skills/dylan-dog/checklist.md` yourself, in one pass, across the same file list.
2. Before reporting any finding that depends on framework/runtime behavior (does this really cause a re-render? does this really race?), verify the exact semantics — don't assert from general impression. A finding that contradicts the framework's real behavior is worse than no finding.
3. Report findings with `ReportFindings`, same severity bands as Dylan Dog (Critical/Important/Minor, CONFIRMED/PLAUSIBLE).
4. State explicitly in the output that this was a **degraded review — no subagent dispatched, self-reviewed** — so it's never mistaken for either the full process or the snapshot review above.

### 2. Get git SHAs
```bash
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@' || git branch --list main master | head -1 | tr -d ' *')
BASE_SHA=$(git merge-base HEAD "$DEFAULT_BRANCH")
HEAD_SHA=$(git rev-parse HEAD)
```
Don't hardcode `main` — it silently breaks on repos whose default branch is `master` or anything else (`git merge-base` fails with no useful signal that the branch name was the problem).

### 3. Dispatch via Dylan Dog
Before dispatching, check `.sixth-sense/learnings.jsonl` at the project root for entries relevant to the files in this diff — a documented pitfall on this exact class of code saves the hunter from rediscovering it from scratch. Skip silently if the file doesn't exist. If relevant entries exist, fold them into {PLAN_OR_REQUIREMENTS} so the hunter checks for them directly.

Invoke the `dylan-dog` skill in Hunting mode with:
- **{DESCRIPTION}:** Brief summary of what you built.
- **{PLAN_OR_REQUIREMENTS}:** What the code should do. Check `.sixth-sense/spec.md` at the project root first (written by `synthesizing-spec`) and use it if present, rather than reconstructing the requirements from memory.
- **{BASE_SHA}:** The starting commit.
- **{HEAD_SHA}:** The ending commit.

It triages the diff by risk and dispatches `dylan-dog-triage`/`dylan-dog-hunter` — no vague "edge cases handled?" pass, and no full-cost deep review on parts of the diff that don't need it.

### 3b. Opus Second Opinion (on by default)
Check `.sixth-sense/model-preferences.md` for `opus-review`. Runs unless explicitly set to `false` — absent (no setup done) counts as enabled, same as the recommended default in `configuring-sixth-sense`. If explicitly `false`, skip this — don't mention it. Otherwise, after Dylan Dog's pass (Hunting in step 3, the snapshot review in 1b, or the manual fallback in 1c) is done, dispatch the `opus-review` agent-type with the diff/description as {DESCRIPTION} and Dylan Dog's findings as {PRIOR_REVIEW}. Merge its findings into the same Critical/Important/Minor report — don't present it as a separate, competing review. If it found nothing beyond the prior pass, say so plainly rather than padding the output.

### 4. Act on feedback
When receiving code review feedback:

```
1. READ: Complete feedback without reacting
2. UNDERSTAND: Restate the requirement in own words (or ask)
3. VERIFY: Check against codebase reality
4. EVALUATE: Technically sound for THIS codebase?
5. RESPOND: Technical acknowledgment or reasoned pushback
6. IMPLEMENT: One item at a time, test each
```

**Priority:**
- Fix **Critical** issues immediately.
- Fix **Important** issues before proceeding.
- Note **Minor** issues for later.
- Push back with technical reasoning if wrong.

## Forbidden Responses
- "You're absolutely right!" — performative
- "Great point!" — performative
- "Let me implement that now" — before verification

**Instead:**
- Restate the technical requirement
- Ask clarifying questions
- Just fix it and describe what changed

## GitHub Thread Replies
When replying to inline review comments on GitHub, reply in the comment thread (`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies`), not as a top-level PR comment.

## Learnings Ledger
If Dylan Dog's review (or your own act-on-feedback pass) surfaces a non-obvious, reusable pattern, append it to `.sixth-sense/learnings.jsonl` at the project root the same way `diagnosing-bugs` does: `{"pattern": "...", "confidence": "...", "source_file": "...", "discovered_by": "requesting-code-review"}`, one JSON object per line, create the file if it doesn't exist.
