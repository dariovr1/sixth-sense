---
description: Run the Code Review workflow against recent commits.
---
Use the `Skill` tool with `skill: "sixth-sense:requesting-code-review"` (or, on Antigravity, `activate_skill` with `requesting-code-review`) to load and run the review skill — use this exact qualified name, not a bare "code-review", which resolves to an unrelated built-in skill of the same name. It inspects the current git diff and dispatches a specialized subagent to review the code rigorously and objectively.
