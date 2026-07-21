const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const pluginRoot = path.dirname(__dirname);
const tempDir = path.join(pluginRoot, 'temp-superpowers');

console.log('Cloning obra/superpowers to run empirical benchmark...');
try {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  execSync(`git clone https://github.com/obra/superpowers.git "${tempDir}"`, { stdio: 'ignore' });
} catch (err) {
  console.error('Error cloning superpowers repository. Please check your internet connection.', err.message);
  process.exit(1);
}

const getWeight = (filePath) => {
  if (!fs.existsSync(filePath)) return { bytes: 0, chars: 0, tokens: 0 };
  const content = fs.readFileSync(filePath, 'utf8');
  const bytes = fs.statSync(filePath).size;
  const chars = content.length;
  // Estimate tokens (roughly 1 token per 3.8 characters for markdown)
  const tokens = Math.round(chars / 3.8);
  return { bytes, chars, tokens };
};

// Superpowers' skill-writing capability (skills/writing-skills/) has no Sixth Sense
// equivalent -- writing-great-skills was removed as out of scope (see CLAUDE.md), not
// replaced with something lighter -- so it's excluded from this table rather than
// counted as "100% saved" against files that no longer exist.
// Define the comparison mappings
const comparisons = [
  {
    name: 'Bootstrap & Main Skill',
    superpowers: ['skills/using-superpowers/SKILL.md'],
    sixSense: ['skills/using-sixth-sense/SKILL.md']
  },
  {
    name: 'Task Implementation',
    superpowers: ['skills/subagent-driven-development/SKILL.md', 'skills/executing-plans/SKILL.md'],
    sixSense: ['skills/implementing-work/SKILL.md']
  },
  {
    name: 'Brainstorming & Grilling',
    superpowers: ['skills/brainstorming/SKILL.md'],
    sixSense: ['skills/grilling/SKILL.md', 'skills/domain-modeling/SKILL.md']
  },
  {
    name: 'TDD (Test-Driven Development)',
    superpowers: ['skills/test-driven-development/SKILL.md'],
    sixSense: ['skills/test-driven-development/SKILL.md', 'skills/test-driven-development/references/java.md', 'skills/test-driven-development/references/angular.md', 'skills/test-driven-development/references/react.md', 'skills/test-driven-development/references/python.md']
  },
  {
    name: 'Systematic Debugging',
    superpowers: ['skills/systematic-debugging/SKILL.md'],
    sixSense: ['skills/diagnosing-bugs/SKILL.md']
  },
  {
    name: 'Specification / Plans',
    superpowers: ['skills/writing-plans/SKILL.md'],
    sixSense: ['skills/synthesizing-spec/SKILL.md']
  },
  {
    name: 'Code Review',
    superpowers: ['skills/requesting-code-review/SKILL.md', 'skills/receiving-code-review/SKILL.md'],
    sixSense: ['skills/requesting-code-review/SKILL.md']
  },
  {
    name: 'Git Worktrees (Invariate)',
    superpowers: ['skills/using-git-worktrees/SKILL.md'],
    sixSense: ['skills/using-git-worktrees/SKILL.md']
  },
  {
    name: 'Finishing Branch (Invariate)',
    superpowers: ['skills/finishing-a-development-branch/SKILL.md'],
    sixSense: ['skills/finishing-a-development-branch/SKILL.md']
  },
  {
    name: 'Completion Verification (Invariate)',
    superpowers: ['skills/verification-before-completion/SKILL.md'],
    sixSense: ['skills/verification-before-completion/SKILL.md']
  },
  {
    name: 'Parallel Subagents Dispatch',
    superpowers: ['skills/dispatching-parallel-agents/SKILL.md'],
    sixSense: ['skills/dispatching-parallel-agents/SKILL.md']
  }
];

const results = [];
let totalSPTokens = 0;
let totalSSTokens = 0;

for (const comp of comparisons) {
  let sp = { bytes: 0, chars: 0, tokens: 0 };
  for (const file of comp.superpowers) {
    const w = getWeight(path.join(tempDir, file));
    sp.bytes += w.bytes;
    sp.chars += w.chars;
    sp.tokens += w.tokens;
  }

  let ss = { bytes: 0, chars: 0, tokens: 0 };
  for (const file of comp.sixSense) {
    const w = getWeight(path.join(pluginRoot, file));
    ss.bytes += w.bytes;
    ss.chars += w.chars;
    ss.tokens += w.tokens;
  }

  const diff = sp.tokens - ss.tokens;
  const pct = sp.tokens > 0 ? Math.round((diff / sp.tokens) * 100) : 0;

  results.push({
    name: comp.name,
    spTokens: sp.tokens,
    ssTokens: ss.tokens,
    saving: diff,
    pct: pct
  });

  totalSPTokens += sp.tokens;
  totalSSTokens += ss.tokens;
}

// Files Sixth Sense introduces with no Superpowers counterpart at all, grouped so each
// group's weight is visible on its own line instead of one opaque total -- Dylan Dog in
// particular is the most publicized feature, so folding it into an unlabeled bucket (or
// missing it via a stale file list, as the previous version of this script did with the
// now-nonexistent agents/code-reviewer.md) misrepresents what's actually being measured.
const newSSFileGroups = [
  {
    name: 'Dylan Dog (edge-case review: skill + checklist + triage/hunter agents)',
    files: ['skills/dylan-dog/SKILL.md', 'skills/dylan-dog/checklist.md', 'agents/dylan-dog-triage.md', 'agents/dylan-dog-hunter.md']
  },
  {
    name: 'Model/effort routing agents (opus-review, sonnet-research, sonnet tiers, haiku-batch)',
    files: ['agents/opus-review.md', 'agents/sonnet-research.md', 'agents/sonnet-low.md', 'agents/sonnet-medium.md', 'agents/sonnet-high.md', 'agents/haiku-batch.md']
  },
  {
    name: 'Stack routing & setup (crossroad-stack, configuring-sixth-sense)',
    files: ['skills/crossroad-stack/SKILL.md', 'skills/configuring-sixth-sense/SKILL.md']
  },
  {
    name: 'Hooks',
    files: ['hooks/session-start.js', 'hooks/hooks.json']
  }
];

let newSSTokens = 0;
for (const group of newSSFileGroups) {
  group.tokens = group.files.reduce((sum, file) => sum + getWeight(path.join(pluginRoot, file)).tokens, 0);
  newSSTokens += group.tokens;
}

// Clean up temporary clone
try {
  fs.rmSync(tempDir, { recursive: true, force: true });
} catch (err) {
  // Ignore
}

// Generate the output report
console.log('\n========================================================================');
console.log('                      BENCHMARK REPORT: TOKEN FOOTPRINT');
console.log('========================================================================\n');

console.log(String('Skill Area').padEnd(35) + ' | ' + String('Superpowers').padStart(11) + ' | ' + String('Sixth Sense').padStart(9) + ' | ' + String('Saving').padStart(8) + ' | ' + String('%').padStart(4));
console.log('-'.repeat(76));

for (const res of results) {
  console.log(res.name.padEnd(35) + ' | ' + String(res.spTokens).padStart(11) + ' | ' + String(res.ssTokens).padStart(9) + ' | ' + String(res.saving).padStart(8) + ' | ' + (res.pct >= 0 ? '' : '-') + String(Math.abs(res.pct)).padStart(3) + '%');
}

console.log('-'.repeat(76));
console.log(String('Total of Compared Skills').padEnd(35) + ' | ' + String(totalSPTokens).padStart(11) + ' | ' + String(totalSSTokens).padStart(9) + ' | ' + String(totalSPTokens - totalSSTokens).padStart(8) + ' | ' + String(Math.round(((totalSPTokens - totalSSTokens) / totalSPTokens) * 100)).padStart(3) + '%');
console.log('\nFiles Sixth Sense introduces with no Superpowers counterpart:');
for (const group of newSSFileGroups) {
  console.log('  ' + group.name.padEnd(70) + ' +' + group.tokens + ' tokens');
}
console.log('  ' + 'Total'.padEnd(70) + ' +' + newSSTokens + ' tokens');
console.log('\nFinal net weight:');
console.log(`- Superpowers total compared: ${totalSPTokens} tokens`);
console.log(`- Sixth Sense total net weight: ${totalSSTokens + newSSTokens} tokens`);
const netSaving = totalSPTokens - (totalSSTokens + newSSTokens);
console.log(`- NET SAVINGS: ${netSaving} tokens (${Math.round((netSaving / totalSPTokens) * 100)}%)`);
console.log('\n========================================================================');
