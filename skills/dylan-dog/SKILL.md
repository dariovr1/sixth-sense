---
name: dylan-dog
description: The nightmare investigator — hunts edge cases and runs premortems on failure modes. Invoke it directly with /investigate, or it gets called by requesting-code-review, synthesizing-spec, and domain-modeling.
disable-model-invocation: true
---

# Dylan Dog

It does not judge whether the code or spec is clean. It hunts for the monster living inside it.

Two modes, one shared checklist: [checklist.md](checklist.md).

## Premortem Mode (on a spec/design, before implementing)

Use it once a spec has been written and before the user gives it final approval (called by `synthesizing-spec`, `domain-modeling`, `grilling`).

1. Imagine the feature has already shipped and, months later, is the cause of a serious incident or project failure. Don't ask "what could go wrong" in the abstract — start from the failure that already happened and work backward to the causes (prospective hindsight).
2. Enumerate the plausible causes one by one, mapping them explicitly onto `checklist.md`'s categories — the exercise must be systematic, not vibes-based.
3. For each one, assign probability (low/medium/high) and impact (low/medium/high), and propose a concrete mitigation.
4. Only high-impact/high-probability risks block spec approval. The rest get noted in the spec itself as "accepted risk" — the goal isn't to eliminate every risk, it's to make it explicit (YAGNI: no analysis-paralysis).
5. Write the outcome (cause/probability/impact/mitigation table) directly into the relevant section of the spec or into `CONTEXT.md`, not into a separate document. This table is not a one-off artifact — Hunting mode below reads it back when reviewing the code that implements this spec.

## Hunting Mode (on a code diff, during code review)

Replaces the old single-pass review. Saves tokens by routing deep analysis only where it's needed, instead of spending the same effort everywhere.

0. **Check for a linked Premortem**: before triaging, look for a cause/probability/impact/mitigation table from a prior Premortem run on the spec this diff implements (in the spec file or `CONTEXT.md`). If one exists, don't let the review rediscover those risks from scratch — carry each accepted risk's cause/category into the next steps as a **forced-deep** item tied to the specific files/behavior it concerns, and check specifically whether the mitigation that was promised at design time actually exists in this code. Premortem predicts where the monster will be born; Hunting's job here is to confirm it was actually caged, not to go looking for it blind again. If no Premortem is linked, proceed as normal — this step is a bonus when the trail exists, not a requirement to construct one.
1. **Entry threshold**: if the diff touches only one file or is under ~150 changed lines, skip triage — dispatch `dylan-dog-hunter` directly on the whole diff. Triage has a fixed cost that only pays off on diffs large enough to have genuinely low-risk sections. Forced-deep items from step 0 skip triage regardless of diff size — they go straight to the hunter.
2. **Triage** (otherwise): dispatch the `dylan-dog-triage` agent-type (fallback `sonnet-low` with the same in-prompt instructions if Haiku isn't enabled in `.sixth-sense/model-preferences.md`) with `{BASE_SHA}`/`{HEAD_SHA}`. It returns a file/hunk → categories → level map. Merge in any forced-deep items from step 0 — triage's own classification can only raise a section's level, never lower one that Premortem already flagged.
3. **Targeted hunting**: if triage flags no `deep` sections (e.g. a diff of only comments/renames/tests) and step 0 found nothing, don't dispatch the hunter — report directly "no risk areas, shallow review is sufficient" along with triage's rationale. Otherwise dispatch the `dylan-dog-hunter` agent-type, passing it **only** the `deep` sections (and `shallow` if budget allows) with their already-assigned categories, not the whole diff to re-read. For forced-deep items, also pass the specific mitigation text from Premortem so the hunter knows exactly what to verify instead of re-deriving the risk.
4. The hunter applies the adversarial analysis and verification (CONFIRMED/PLAUSIBLE) described in its own agent-type — don't duplicate that logic here.
5. Report the hunter's output as-is (Strengths / Critical / Important / Minor / Assessment) to the user or caller. If no hunting happened (step 3), the verdict is still explicit. If forced-deep items were checked, state explicitly whether each Premortem-accepted risk's mitigation was found implemented or not — this is the loop back to the design-time decision, don't let it go unreported.

## Why Not Multi-Round Debate

Multiple agents debating over multiple rounds increases accuracy, but the cost scales disproportionately (up to 90-100x for marginal gains). Dylan Dog uses at most two passes in sequence (triage → hunter), never an iterative debate between agents.
