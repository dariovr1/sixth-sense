---
name: domain-modeling
description: Build and sharpen a project's domain model — pin down terminology, record architectural decisions, maintain CONTEXT.md and ADRs.
---

# Domain Modeling

Actively build and sharpen a project's domain model.

## When to Use
Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill needs to maintain the domain model.

## Instructions
- Challenge fuzzy terms against the glossary.
- Stress-test with edge-case scenarios — invoke the `dylan-dog` skill in Premortem mode rather than improvising; it maps failure modes to a fixed heuristic checklist instead of relying on whatever comes to mind.
- Update `CONTEXT.md` and ADRs (Architectural Decision Records) inline as decisions crystallize.
- If a term or concept is not in `CONTEXT.md`, add it. Create the file lazily if it does not exist.
- Focus on the active discipline of changing the model, rather than just consuming/reading it.
- For Spring Boot projects: use the project's package structure as a guide for bounded contexts.
