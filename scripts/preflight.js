const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pluginRoot = path.dirname(__dirname);
let failures = 0;

function fail(msg) {
  console.error(`✘ ${msg}`);
  failures++;
}

function ok(msg) {
  console.log(`✔ ${msg}`);
}

// 1. No file in the repo may start with a UTF-8 BOM.
// A BOM before a JSON manifest breaks JSON.parse (e.g. hooks.json -> 0 hooks
// detected); a BOM before a SKILL.md breaks the frontmatter delimiter, which
// silently drops the skill from live discovery even though it still shows up
// in static tooling. Caught the hard way once already — see git history.
function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
}

const files = [];
walk(pluginRoot, files);
const bomFiles = files.filter((f) => {
  const buf = fs.readFileSync(f);
  return buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf;
});

if (bomFiles.length > 0) {
  fail(`${bomFiles.length} file(s) start with a UTF-8 BOM:`);
  for (const f of bomFiles) console.error(`    ${path.relative(pluginRoot, f)}`);
} else {
  ok('No BOM-prefixed files.');
}

// 2. hooks.json, if present, must be valid JSON (a BOM or trailing comma
// silently zeroes out every hook with no error shown to the plugin author).
const hooksJsonPath = path.join(pluginRoot, 'hooks', 'hooks.json');
if (fs.existsSync(hooksJsonPath)) {
  try {
    JSON.parse(fs.readFileSync(hooksJsonPath, 'utf8'));
    ok('hooks/hooks.json parses as valid JSON.');
  } catch (err) {
    fail(`hooks/hooks.json does not parse: ${err.message}`);
  }
}

// 3. Every SKILL.md must start with a YAML frontmatter block.
const skillsDir = path.join(pluginRoot, 'skills');
if (fs.existsSync(skillsDir)) {
  let badSkills = 0;
  for (const name of fs.readdirSync(skillsDir)) {
    const skillFile = path.join(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) continue;
    const text = fs.readFileSync(skillFile, 'utf8');
    if (!text.startsWith('---')) {
      fail(`skills/${name}/SKILL.md does not start with '---' frontmatter delimiter.`);
      badSkills++;
    }
  }
  if (badSkills === 0) ok('All SKILL.md files start with a valid frontmatter delimiter.');
}

// 4. hooks/session-start.js must emit the correct JSON envelope per platform
// (a raw-stdout regression here silently breaks skill injection with no
// error surfaced anywhere — see sixth-sense-spec.md §12).
const sessionStartPath = path.join(pluginRoot, 'hooks', 'session-start.js');
if (fs.existsSync(sessionStartPath)) {
  const cases = [
    { env: { CLAUDE_PLUGIN_ROOT: pluginRoot }, key: 'hookSpecificOutput' },
    { env: { CURSOR_PLUGIN_ROOT: pluginRoot }, key: 'additional_context' },
    { env: { COPILOT_CLI: '1' }, key: 'additionalContext' },
  ];
  let envelopeFailures = 0;
  for (const { env, key } of cases) {
    try {
      const cleanEnv = { ...process.env };
      delete cleanEnv.CLAUDE_PLUGIN_ROOT;
      delete cleanEnv.CURSOR_PLUGIN_ROOT;
      delete cleanEnv.COPILOT_CLI;
      const out = execSync(`node "${sessionStartPath}"`, { env: { ...cleanEnv, ...env } }).toString();
      const parsed = JSON.parse(out);
      if (!(key in parsed)) {
        fail(`hooks/session-start.js with ${Object.keys(env)[0]} set did not emit "${key}".`);
        envelopeFailures++;
      }
    } catch (err) {
      fail(`hooks/session-start.js with ${Object.keys(env)[0]} set failed: ${err.message}`);
      envelopeFailures++;
    }
  }
  if (envelopeFailures === 0) ok('hooks/session-start.js emits the correct envelope for Claude Code, Cursor, and Copilot CLI.');
}

// 5. The version line at the top of using-sixth-sense/SKILL.md — the one
// thing SessionStart injects into every session — must match plugin.json.
// This is the only on-screen way to tell which plugin version an already-
// running session actually loaded (running `claude plugin details` only
// tells you what's installed, not what a given session picked up).
const pluginJsonPath = path.join(pluginRoot, '.claude-plugin', 'plugin.json');
const usingSkillPath = path.join(pluginRoot, 'skills', 'using-sixth-sense', 'SKILL.md');
if (fs.existsSync(pluginJsonPath) && fs.existsSync(usingSkillPath)) {
  const declaredVersion = JSON.parse(fs.readFileSync(pluginJsonPath, 'utf8')).version;
  const usingSkillText = fs.readFileSync(usingSkillPath, 'utf8');
  const match = usingSkillText.match(/Sixth Sense v([\d.]+)/);
  if (!match) {
    fail('skills/using-sixth-sense/SKILL.md has no "Sixth Sense vX.Y.Z" version line.');
  } else if (match[1] !== declaredVersion) {
    fail(`skills/using-sixth-sense/SKILL.md says v${match[1]}, but plugin.json says v${declaredVersion}.`);
  } else {
    ok(`using-sixth-sense/SKILL.md version line matches plugin.json (v${declaredVersion}).`);
  }
}

// 6. Delegate the rest to Claude Code's own validator, if available.
try {
  execSync(`claude plugin validate "${pluginRoot}"`, { stdio: 'inherit' });
} catch (err) {
  fail('claude plugin validate reported errors (see output above).');
}

console.log('---');
if (failures > 0) {
  console.error(`preflight failed: ${failures} check(s) did not pass.`);
  process.exit(1);
} else {
  console.log('preflight passed.');
}
