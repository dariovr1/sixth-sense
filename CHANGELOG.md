# Changelog

## 1.0.0: Initial public release

- `crossroad-stack`: routes each task to the right stack conventions (Java/Spring Boot, Angular, React/Next.js, Python) instead of one generic set of rules.
- `dispatching-parallel-agents`: 8 explicit model/effort tiers for subagents (`sonnet-low/medium/high/research`, `haiku-batch`, `dylan-dog-triage/hunter`, `opus-review`), configured per project via `/setup-sixth-sense`.
- Dylan Dog: a two-mode edge-case hunter. Premortem runs on a spec before implementation; Hunting runs on a diff during review, triaging cheaply before spending a deep pass only where it's needed.
- `grilling` and `synthesizing-spec`: an adversarial design interview before large or ambiguous builds, with the option to persist decisions to `CONTEXT.md` and ADRs instead of leaving them implicit.
- `opus-review`: an optional second-opinion pass on a finished spec or review, on by default.
- `handing-off`: a compact handoff document for long or interrupted sessions.
- Skills that shared a bare name with a built-in or unrelated skill were renamed, so the `Skill` tool can't silently resolve to the wrong one. See "Known limitations" in the README.

Internal development history (1.0.0 through 1.3.3) is tracked in `CLAUDE.md` for anyone working on the plugin itself.
