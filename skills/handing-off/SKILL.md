---
name: handing-off
description: Produce a compact handoff document for a long or interrupted session, so a fresh session (or the same one after context compaction) inherits the live thread instead of re-deriving it. Explicit invocation only.
disable-model-invocation: true
---

# Handing Off

A conversation squeezed down to just its resumable core — what's in flight and why, in the conversation's own terms — so a fresh agent inherits the momentum, not the noise.

## When to Use
Invoke explicitly (via `/handoff` or by name) when a session is long, about to hit a context limit, or work needs to continue in a new session/machine. Not automatic — the user decides when continuity is worth capturing.

## What Goes In

**Only the live thread**: what's currently in flight, what was just decided, what's still open, and why — told in the terms this conversation actually used, not a generic status template.

**Do not restate what already lives elsewhere.** If it's in a spec, plan, ADR, `CONTEXT.md`, GitHub issue, commit, or diff, reference it by path or URL — don't copy its content into the handoff. The handoff's job is to cover the gap between those artifacts and what's still only in the conversation, not to duplicate them. A handoff that re-explains the whole spec has failed at being compact.

**Strip secrets before writing.** Scan for API keys, passwords, tokens, and PII, and remove them — this file may sit around, and the discipline is "never persist a secret," not "usually remember to."

## Where It Goes
Write to the OS temp directory, not the project workspace — this is not a project artifact and should not need maintaining or gitignoring. Use a predictable, fixed filename per project so a fresh session can be pointed at it directly:

```
<os-temp-dir>/sixth-sense-handoff-<project-directory-name>.md
```

Overwrite on each invocation — a handoff is the *current* live thread, not a history of past ones. After writing, tell the user the exact path, so they can paste it (or its path) as the first message of a fresh session.

## Structure

```markdown
# Handoff — <project> — <ISO timestamp>

## Live thread
[What's in flight right now, and why — the actual open question or task, not a summary of everything discussed]

## Just decided
[Recent decisions not yet written into a spec/ADR/CONTEXT.md — if it's already there, reference it instead of repeating it here]

## Still open
[Unresolved questions, pending confirmations, next concrete step]

## References
[Paths/URLs to specs, plans, ADRs, issues, commits, diffs relevant to the live thread — this is how the handoff stays compact instead of re-stating them]
```

## Pairing With Other Skills
Complements `synthesizing-spec` and `domain-modeling` rather than overlapping them: those skills produce durable, referenceable artifacts (specs, `CONTEXT.md`); this skill produces the ephemeral bridge between sessions, and points at those artifacts instead of re-deriving them.
