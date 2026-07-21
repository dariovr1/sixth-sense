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
