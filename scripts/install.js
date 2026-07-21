const fs = require('fs');
const path = require('path');

const pluginRoot = path.dirname(__dirname);
const targetProjectDir = process.cwd();

console.log('--- Sixth Sense Installer ---');
console.log(`Plugin path: ${pluginRoot}`);
console.log(`Target project path: ${targetProjectDir}`);

// Determine if we are installing to a project
if (pluginRoot === targetProjectDir) {
  console.log('\nWarning: Running installer inside the plugin repository.');
  console.log('To link these skills to a project, run this script from your project directory:');
  console.log(`node "${path.join(pluginRoot, 'scripts', 'install.js')}"`);
  console.log('\nTo install as a Claude Code plugin globally, run:');
  console.log(`claude plugin marketplace add "${pluginRoot}"`);
  console.log('claude plugin install sixth-sense@sixth-sense');
  process.exit(0);
}

// 1. Setup .agents/skills/ directory
const agentsDir = path.join(targetProjectDir, '.agents');
const skillsTargetDir = path.join(agentsDir, 'skills');

try {
  if (!fs.existsSync(agentsDir)) {
    fs.mkdirSync(agentsDir);
  }
  if (!fs.existsSync(skillsTargetDir)) {
    fs.mkdirSync(skillsTargetDir);
  }

  const skillsSourceDir = path.join(pluginRoot, 'skills');
  const skills = fs.readdirSync(skillsSourceDir);

  console.log('\nLinking skills for Antigravity / Gemini CLI...');
  for (const skill of skills) {
    const src = path.join(skillsSourceDir, skill);
    const dest = path.join(skillsTargetDir, skill);

    if (fs.statSync(src).isDirectory()) {
      // Clean target if exists
      if (fs.existsSync(dest)) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      
      // Try to create symlink (junction on Windows), fallback to copy
      try {
        fs.symlinkSync(src, dest, 'junction');
        console.log(`[Link] Linked skill: ${skill}`);
      } catch (err) {
        // Fallback to recursive copy
        fs.cpSync(src, dest, { recursive: true });
        console.log(`[Copy] Copied skill: ${skill}`);
      }
    }
  }

  // 2. Setup .agents/skills.json
  const skillsJsonPath = path.join(agentsDir, 'skills.json');
  if (!fs.existsSync(skillsJsonPath)) {
    fs.writeFileSync(skillsJsonPath, JSON.stringify({ entries: [] }, null, 2));
  }

  console.log('\nSetup completed successfully for Antigravity!');
  console.log('You can now use Sixth Sense skills in Antigravity.');

  // 3. Inform about Claude Code
  console.log('\nTo register this plugin in Claude Code, run:');
  console.log(`claude plugin marketplace add "${pluginRoot}"`);
  console.log('claude plugin install sixth-sense@sixth-sense');

} catch (err) {
  console.error('\nError during installation:', err.message);
  process.exit(1);
}
