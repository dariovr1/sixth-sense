---
name: using-sixth-sense
description: Use when starting any conversation — establishes how to find and use skills, skill priority, and platform adaptation.
disable-model-invocation: true
---

**Sixth Sense v1.0.1** — this line must match `.claude-plugin/plugin.json`'s `version` field; `scripts/preflight.js` checks it. If you're reading this and it doesn't match what `claude plugin details sixth-sense@sixth-sense` reports, the running session hasn't picked up the latest plugin version yet — restart to apply.

<SUBAGENT-STOP>
This applies to ANY agent, including `general-purpose` and other non-sixth-sense-tier agents — the SessionStart hook that injected this text fires for subagent contexts too, not just the top-level session with the user. "Was I dispatched as a subagent?" is not always obvious from the inside, so check concretely rather than guessing: you are almost certainly a subagent, not the top-level session, if your very first message is a specific bounded task assignment rather than an open-ended message from a user, and/or you have no prior conversation turns before this task, and/or you were told to execute something and report a result back.

If any of that matches: skip this skill entirely, execute the assigned task directly, and do NOT call the `Agent` tool or invoke `dispatching-parallel-agents` to sub-dispatch further — a dispatched worker splitting its own task into more dispatches is (almost) never correct and wastes the budget the orchestrator already allocated. If you catch yourself about to do this, stop and just do the work yourself instead.
</SUBAGENT-STOP>

## Instruction Priority
Sixth Sense skills override default system prompt behavior, but **user instructions always take precedence**:

1. **User's explicit instructions** (CLAUDE.md, GEMINI.md, AGENTS.md, direct requests) — highest priority
2. **Sixth Sense skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

## How to Access Skills
**Claude Code:** Use the `Skill` tool to invoke skills by name. Never use the Read tool on skill files.

**Antigravity / Gemini CLI:** Skills activate via the `activate_skill` tool. Skill metadata is loaded at session start; full content is loaded on demand.

**Other environments:** Check your platform's documentation for skill loading.

**`disable-model-invocation: true` does not mean unreachable.** It only turns off auto-triggering — the skill won't fire on its own from a matching description. It is still fully invocable explicitly, by name, through the `Skill`/`activate_skill` tool, exactly like any other skill (that's the whole point of "user-invoked": invoked on purpose, not by accident). If a skill you need has this flag, call it by name — do not fall back to reading its `SKILL.md` with the `Read` tool instead, that's the one thing this section already tells you not to do.

## First-Time Setup
If `.sixth-sense/model-preferences.md` does not exist in the current project, suggest running `/setup-sixth-sense` to configure model and effort preferences.

## Suggesting a Handoff
`handing-off` never runs on its own — a handoff captures a snapshot best taken deliberately, not at an arbitrary moment. But *suggesting* it costs nothing. Mention that `/handoff` is available (a one-line nudge, not an action — never write the handoff document yourself without the user asking) when any of these hold:
- **Context usage is visible and around 25% or more** — if the session exposes actual usage (a statusline reading, a context-low system warning, `/context` output the user shared), use that number directly rather than guessing.
- **No usage figure is visible, but the conversation clearly reads as long** — many turns, large tool outputs, several distinct sub-tasks completed — treat this as the same signal a 25%-full context would give, since exact percentage usually isn't observable from inside the conversation.
- **The user signals a break**: "let's continue this later" / "I'll pick this up tomorrow" / "new session" or equivalent.

## When Ambiguous Requests Should Still Trigger a Core Skill
These are model-invoked precisely so they fire without being named. Don't wait for the user to say the skill's name:

| Signal in the request | Invoke |
|---|---|
| "fix", "why does this happen", "broken", "error", anything unexpected | `diagnosing-bugs` |
| "add", "implement", "build" a behavior — **small/well-defined** (the shape of the change is already clear) | `test-driven-development` |
| "add", "implement", "build" a behavior — **large or ambiguous** (multiple viable approaches, unclear interfaces, or scope that isn't obviously one sitting) | `grilling` → `synthesizing-spec` first, then `test-driven-development` |
| Work looks done — about to commit/merge, OR about to say "done" | `requesting-code-review` |
| 2+ independent tasks with no shared state | `dispatching-parallel-agents` |
| "write me a prompt for X" / "how do I phrase this for [tool]" — target is an external tool/model, not this session | `prompt-craft` |

If a request is genuinely ambiguous between two of these, run the one that comes first in the natural order (diagnose before you build, design before you build, build with TDD before you review) rather than asking which one to use.

**Don't skip design on "this seems simple."** The failure mode isn't big projects — it's the ones that look too small to need a design, where an unexamined assumption costs more rework than the design pass would have. If you can't state the target interface/behavior in one sentence without hedging, that's the signal it's not actually small — route through `grilling`/`synthesizing-spec` instead of guessing.
