---
description: Produce a compact handoff document so a fresh session can pick up the live thread of this one.
---
Use the `Skill` tool with `skill: "sixth-sense:handing-off"` (or, on Antigravity, `activate_skill` with `handing-off`) to load and run the handoff skill — use this exact qualified name, a bare "handoff" may not resolve to it. It writes a compact summary of the in-flight work to the OS temp directory and tells you the path.
