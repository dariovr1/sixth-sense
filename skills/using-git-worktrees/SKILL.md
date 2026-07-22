---
name: using-git-worktrees
description: Creates isolated git worktrees with systematic safety checks and project setup automation. Use when starting feature work that needs isolation from current branch, before executing tasks with subagent-driven development, or anytime you need an isolated workspace for a new branch.
---

# Using Git Worktrees

## When to Activate
- After design approval and before writing implementation plans
- Before executing tasks with parallel agent dispatching
- Any time an isolated workspace for a new branch is required

Announce: "I'm using the `using-git-worktrees` skill to set up an isolated workspace."

## The Process

### Step 1: Directory Selection
Follow this priority order:
1. Check for existing `.worktrees/` directory (preferred/hidden)
2. Check for existing `worktrees/` directory
3. Check CLAUDE.md / GEMINI.md / AGENTS.md for directory preference
4. If none found, ask user to choose:
   - `.worktrees/` (project-local)
   - `~/.config/sixth-sense/worktrees/<project-name>/` (global location)

### Step 2: Safety Verification
Verify the worktree directory is included in `.gitignore`:
- **Why critical:** Prevents accidentally committing worktree contents to the repository
- **If not ignored:** Add the path to `.gitignore`, commit the change, then proceed

### Step 3: Create the Worktree
```bash
git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```
If permission error occurs due to sandbox restrictions, fall back to working in the current directory.

### Step 4: Project Setup
Auto-detect project files and run appropriate dependency installation:
- **Java/Gradle:** `build.gradle` / `build.gradle.kts` → `./gradlew build`
- **Node.js:** `package.json` → `npm install`
- **Python:** `requirements.txt` / `pyproject.toml` → `pip install -r requirements.txt` or `poetry install`
- **Untracked project state:** if `.sixth-sense/` exists in the original working directory, copy it into the new worktree. It's untracked by design (per-project state, not shared history), so `git worktree add` does not bring it along on its own — skipping this silently resets `implementing-work`'s Heavy Workflow ledger (`.sixth-sense/progress.md`) to "fresh start" and loses track of which tasks are already done.

### Step 5: Verify Baseline
Run the project's test suite to establish a clean baseline:
- **Java:** `./gradlew test`
- **Node.js:** `npm test`
- **If tests pass:** Report workspace is ready
- **If tests fail:** Report failures and ask for instructions

## Completion
When work is finished, transition to the `finishing-a-development-branch` skill.
