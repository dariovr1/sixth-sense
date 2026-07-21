---
name: finishing-a-development-branch
description: Use when implementation is complete, all tests pass, and you need to decide how to integrate the work — guides completion of development work by presenting structured options for merge, PR, or cleanup.
---

# Finishing a Development Branch

## Core Principle
Verify tests → Present options → Execute choice → Clean up.

## The Process

### Step 1: Verify Tests
Before presenting any options, verify that all tests pass:
- **Java:** `./gradlew test`
- **Node.js/Angular:** `npm test` / `ng test`
- Apply `verification-before-completion` — evidence before claims.

### Step 2: Present Options
Once tests are verified, present the following structured options to the user:
1. **Merge to main:** Direct merge for simple changes.
2. **Create PR:** Open a pull request for team review.
3. **Keep branch:** Preserve the current branch and worktree for later work.
4. **Clean up:** Remove the branch and clean up the worktree.

### Step 3: Execute Choice
Systematically handle the workflow chosen by the user, ensuring all necessary git operations are completed.

**Create PR**: the description is not a diff summary — a reviewer can already see the diff. Include: what this changes and why (one or two sentences), a link/reference to the spec or issue it implements if one exists, and the verification evidence (test suite result, not "tests pass" unsubstantiated — same evidence-before-claims bar as `verification-before-completion`). Skip a section entirely rather than filling it with "N/A" or restating the title.

### Step 4: Cleanup Artifacts
After executing the chosen option, ask if the user wants to remove any artifacts created during the session (e.g., plans, specs, or `.bak` files).
