---
name: grilling
description: Grill the user relentlessly about a plan or design. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one by one.

## Before Drilling In
If there's genuinely more than one viable approach and the user hasn't already picked one, don't grill the first idea in isolation — you'd just polish a plan that might be the wrong one. Lay out 2-3 real options with a one-line tradeoff each, let the user pick a direction, then grill that direction one decision at a time as below.

For each question, provide your recommended answer. Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

## Companion Visuale (Mockups & UI)
Se durante il grilling si discutono componenti dell'interfaccia utente (UI), layout o mockup grafici, proponi o utilizza lo strumento `generate_image` per generare wireframe o design mockups. Mostra le immagini generate all'utente per ottenere un feedback immediato e affilare il design visuale.

If a fact can be found by exploring the codebase, look it up rather than asking me. The decisions, though, are mine — put each one to me and wait for my answer. Do not enact the plan until I confirm we have reached a shared understanding.

## Persisting Decisions
If `CONTEXT.md` already exists at the repo root, treat that as a standing signal that this project wants decisions persisted — invoke the `domain-modeling` skill alongside this one and write each term and architectural choice into `CONTEXT.md`/ADRs as it crystallizes, not only at the end. If it doesn't exist, ask once at the very start of the session (not per-decision) whether to create one and persist as you go, or keep this purely conversational. Don't silently guess either way.
