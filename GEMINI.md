# Sixth Sense — Project Instructions for Antigravity

This repository contains the Sixth Sense plugin. If you are working ON this repo (developing the plugin), follow these instructions.

## Stack
- Skills are Markdown files with YAML frontmatter in `skills/<name>/SKILL.md`
- The SKILL.md format is identical for Claude Code and Antigravity
- Skills are auto-discovered from the `.agents/skills/` or `skills/` directory

## Conventions
- The `name` field in the frontmatter MUST match the directory name
- Model-invoked skills have a `description` rich in trigger phrases
- User-invoked skills have `disable-model-invocation: true`
- Keep skills under 5,000 tokens
- Files under `agents/` define subagent-types with a fixed model/effort
