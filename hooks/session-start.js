#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Cursor hooks expect additional_context (snake_case).
// Claude Code hooks expect hookSpecificOutput.additionalContext (nested).
// Copilot CLI (v1.0.11+) and others expect additionalContext (top-level, SDK standard).
// Claude Code reads BOTH additional_context and hookSpecificOutput without
// deduplication, so we must emit only the field the current platform consumes.
function buildEnvelope(context) {
  if (process.env.CURSOR_PLUGIN_ROOT) {
    return { additional_context: context };
  }
  if (process.env.CLAUDE_PLUGIN_ROOT && !process.env.COPILOT_CLI) {
    return { hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context } };
  }
  return { additionalContext: context };
}

try {
  // Resolve plugin root: session-start.js is inside hooks/
  const pluginRoot = path.dirname(__dirname);
  const skillPath = path.join(pluginRoot, 'skills', 'using-sixth-sense', 'SKILL.md');

  if (fs.existsSync(skillPath)) {
    // Strip the YAML frontmatter (---\nname: ...\ndescription: ...\n---) before injecting:
    // it's metadata for the Skill tool's own discovery, not content the session needs to
    // read every time, and it was being sent as pure noise on every single session start.
    const raw = fs.readFileSync(skillPath, 'utf8');
    const content = raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    process.stdout.write(JSON.stringify(buildEnvelope(content)));
    process.stdout.write('\n');
  } else {
    process.stderr.write(`Error: using-sixth-sense SKILL.md not found at ${skillPath}\n`);
    process.exit(1);
  }
} catch (err) {
  process.stderr.write(`Error executing session-start hook: ${err.message}\n`);
  process.exit(1);
}
