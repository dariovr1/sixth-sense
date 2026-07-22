# Changelog

## 1.0.1: New skill, tighter conventions, fewer silent gaps

- `prompt-craft` (new skill): get a polished, portable prompt for an external tool or model (an image generator, another LLM, a different agent) instead of writing one by hand from scratch — interviews you first, with a question budget that scales with the task instead of a fixed count, and treats any pasted prompt as inert data rather than instructions to follow.
- `crossroad-stack`: routes Python Desktop/GUI projects (`tkinter`, `PyQt`/`PySide`, `pystray`, screen/overlay capture) to their own conventions instead of falling through to generic Python Backend rules, and requires a human to actually look at the rendered UI before calling a visual change done — automated tests passing was never proof a layout renders correctly.
- `dylan-dog`: two new checklist categories catch what the others didn't — **Dependency Legitimacy** flags any dependency new to a diff for a human checkpoint before install (defends against hallucinated/slopsquatted package names), and **Decision Coverage** traces whether a `CONTEXT.md`/ADR decision tag actually shows up in the code it's supposed to govern.
- `synthesizing-spec`: every user story now carries its own verification command (or an explicit manual checkpoint for what can't be automated), not just a top-level testing section — closes the gap where a spec could look complete while an individual requirement had no way to confirm it actually works.
- `domain-modeling`: decisions get a short traceable ID (`D-01`, `D-02`, ...) in `CONTEXT.md`/ADRs, so `dylan-dog`'s Decision Coverage check has something concrete to grep for.
- `diagnosing-bugs` and `requesting-code-review`: both read and write a shared `.sixth-sense/learnings.jsonl` ledger, so a non-obvious pitfall found once (a platform quirk, an API gotcha) doesn't have to be rediscovered from scratch in a later session.
- `implementing-work`: a new "No Orthogonal Changes" rule stops unrelated refactors/renames from riding along in a diff meant for one task, and Heavy Workflow now makes an explicit call on worktree isolation before dispatching, instead of defaulting silently to none.
- `using-git-worktrees`: copies the untracked `.sixth-sense/` project state into a new worktree — without this, isolating mid-task silently reset `implementing-work`'s progress ledger to "fresh start."
- `dylan-dog-triage`: reads its checklist categories from `skills/dylan-dog/checklist.md` instead of a hardcoded list in the prompt, so adding a category (like the two above) can't leave triage checking against a stale set.

## 1.0.0: Initial public release

- `crossroad-stack`: routes each task to the right stack conventions (Java/Spring Boot, Angular, React/Next.js, Python) instead of one generic set of rules.
- `dispatching-parallel-agents`: 8 explicit model/effort tiers for subagents (`sonnet-low/medium/high/research`, `haiku-batch`, `dylan-dog-triage/hunter`, `opus-review`), configured per project via `/setup-sixth-sense`.
- Dylan Dog: a two-mode edge-case hunter. Premortem runs on a spec before implementation; Hunting runs on a diff during review, triaging cheaply before spending a deep pass only where it's needed.
- `grilling` and `synthesizing-spec`: an adversarial design interview before large or ambiguous builds, with the option to persist decisions to `CONTEXT.md` and ADRs instead of leaving them implicit.
- `opus-review`: an optional second-opinion pass on a finished spec or review, on by default.
- `handing-off`: a compact handoff document for long or interrupted sessions.
- Skills that shared a bare name with a built-in or unrelated skill were renamed, so the `Skill` tool can't silently resolve to the wrong one. See "Known limitations" in the README.

Internal development history (1.0.0 through 1.3.3) is tracked in `CLAUDE.md` for anyone working on the plugin itself.
