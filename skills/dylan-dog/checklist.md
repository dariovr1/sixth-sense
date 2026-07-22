# Shared Heuristic Checklist

Used by both premortem (on a spec/design) and hunting (on a code diff). Not every category always applies — assign only the relevant ones.

## SFDIPOT
Structure, Function, Data, Interfaces, Platform, Operations, Time. Systematic dimensions of the system to sweep one by one instead of relying on gut feel.

## CRUD
For every data entity touched: are Create, Read, Update, Delete all covered? An update that forgets to invalidate a cache read elsewhere is a classic CRUD bug.

## Boundary / Equivalence
For every input: minimum value, maximum value, just above/below the limit, empty, null, wrong type. Errors cluster at the edges, not the middle of the range.

## Concurrency & Shared State
Race conditions, double submit, idempotency, what happens if two requests touch the same state at the same instant.

## Failure & Recovery
What happens if an external dependency (network, disk, downstream service) dies mid-operation? Does the state stay consistent, or does it end up half-done?

## Security
Untrusted input, injection, authorization/authentication, exposure of data that shouldn't leave that layer.

## Oracles (HICCUPPS-lite)
To judge whether a behavior is *actually* a bug and not just "different from what I expected": compare it against the code's history, comparable products, stated claims/documentation, and reasonable end-user expectations.

## Mutation Thinking
For every boolean condition or comparison: if I flip the operator, change `<` to `<=`, or remove this check — would the test notice? If the answer is no, that's a gap in coverage, not just a hypothesis.

## Unnecessary Complexity
A downstream safety net for the minimal-implementation ladder `test-driven-development` applies during GREEN (see `skills/test-driven-development/references/minimal-implementation.md`) — this category catches what slips through it. New code, a new abstraction, or a new dependency where the codebase already had a stdlib call, a native feature, or an existing utility that would have done the same job in fewer lines. Unlike the other categories, this is never Critical/Important on its own — no test fails, no bug ships — file it as Minor with the simpler alternative named concretely (not "this could be simpler," but "this is `x.map().filter().reduce()`, `Array.prototype.filter` alone does it").

## Dependency Legitimacy
Any dependency new to this diff (not already in the lockfile/manifest before this change) is untrusted by default: tag it `[ASSUMED]` and require an explicit human checkpoint before it's installed — package names can be hallucinated or planted by an attacker (slopsquatting). Without network access to verify age/download count/source repo, still degrade to tagging and checkpointing everything new rather than passing silently — fail-safe, never a silent pass.

## Decision Coverage
If the project has `CONTEXT.md`/ADRs with `D-NN` decision tags (see `domain-modeling`), grep the diff for whether decisions referenced by the touched code actually appear — flag (warning only, never a blocker) any `D-NN` tag in CONTEXT.md/ADRs that doesn't show up anywhere in the code or commit history it's supposed to govern. This is a non-blocking trace check, not a gate.
