---
name: synthesizing-spec
description: Turn the current conversation into a structured spec document — no interview, just synthesis of what has already been discussed.
disable-model-invocation: true
---

# To Spec

Synthesize the current conversation into a structured specification. Use the project's own domain vocabulary (reference `CONTEXT.md` if it exists).

## Template

### Problem Statement
[Describe the problem from the user's perspective, including why it is worth solving.]

### Solution
[Outline the high-level shape of the fix, excluding low-level implementation details.]

### User Stories
[Extensive, numbered list of concrete, independently checkable behaviors. Each story carries its own verification command — how `implementing-work`/`verification-before-completion` will prove it's done — not just the top-level Testing Decisions section below.]

1. As a [actor], I want a [feature], so that [benefit].
   - **Verification:** [exact command that proves this story works, e.g. a specific test name — or, for requirements that can't be automated (e.g. visual/UX judgment), an explicit blocking human checkpoint: "requires manual confirmation, not just green tests"]
2. ...

A story without a verification command is incomplete — don't leave it implicit or defer it to Testing Decisions.

### Implementation
[Settled implementation decisions:]
- Modules to be built or modified
- Interfaces to be modified — exact signatures/types where a module's output is consumed by another user story, not just names. This is what keeps `implementing-work` from drifting a type between the story that produces it and the one that consumes it.
- Architectural decisions and technical clarifications
- Schema changes and API contracts
- **Do NOT include specific file paths or code snippets** — that decomposition happens in `implementing-work`, guided by `crossroad-stack`

### Testing Decisions
[Define the seams where the feature will be tested and what "done" looks like. Prefer existing seams over new ones.]

### Out-of-Scope
[What this change deliberately does not cover, to keep the task bounded.]

### Risks (Premortem)
[Accepted-risk table from Dylan Dog: cause / probability / impact / mitigation. Omit this section if premortem found nothing worth tracking.]

### Further Notes
[Any additional context, constraints, or information necessary for implementation.]

## Self-Review

After drafting, check the spec with fresh eyes before running the premortem:

1. **Coverage**: does every requirement discussed in the conversation map to a user story? List gaps.
2. **Placeholder scan**: search for "TBD", "TODO", "handle edge cases", "similar to story N" — these are spec failures, not shorthand. Fix inline.
3. **Type consistency**: do the signatures/types named in one user story's Implementation notes match what an earlier story already committed to? A field called `userId` in story 2 and `user_id` in story 5 is a bug, not a style choice.

Fix issues inline, no need to re-review.

## Before Presenting

Run the `dylan-dog` skill in Premortem mode against the drafted spec before showing it to the user. High-probability/high-impact risks it finds must be resolved (mitigation added, or scope adjusted) before the spec is considered done — everything else goes in the Risks section above as an explicit accepted risk, not silently dropped.

## Opus Second Opinion (on by default)
Check `.sixth-sense/model-preferences.md` for `opus-review`. Runs unless explicitly set to `false` — absent (no setup done) counts as enabled. If explicitly `false`, skip this entirely — say nothing about it. Otherwise, after the self-review and premortem are both done (this is a pass over an already-solid spec, not a substitute for either), dispatch the `opus-review` agent-type with the finished spec as {DESCRIPTION} and the self-review + premortem findings as {PRIOR_REVIEW}. Present its findings alongside the rest — if it found nothing beyond what premortem already caught, say that plainly rather than padding the output to look useful.
