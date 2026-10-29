#!/usr/bin/env node
import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageDir = resolve(__dirname, '..');
const packageJsonPath = resolve(packageDir, 'package.json');

// Parse CLI flags and bump argument
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const noGit = args.includes('--no-git');
const noBump = args.includes('--no-bump');
const skipLogin = args.includes('--skip-login');
const bumpType = args.find((arg) => !arg.startsWith('--')) || 'patch';

const validBumps = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];

function run(command, options = {}) {
  return execSync(command, {
    cwd: packageDir,
    stdio: 'inherit',
    encoding: 'utf-8',
    ...options
  });
}

function runQuiet(command, options = {}) {
  try {
    return execSync(command, {
      cwd: packageDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf-8',
      ...options
    }).trim();
  } catch (err) {
    return null;
  }
}

console.log('\n📦 \x1b[1m\x1b[36m@imjp/auto-linker Release Pipeline\x1b[0m');
if (isDryRun) {
  console.log('   \x1b[33m[DRY RUN MODE ENABLED - No changes will be published to npm]\x1b[0m');
}

// Step 1: Check npm authentication
console.log('\n🔑 Checking npm authentication status...');
let currentUser = runQuiet('npm whoami');

if (!currentUser && process.env.NPM_TOKEN) {
  currentUser = runQuiet(`npm whoami --//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);
}

if (!currentUser) {
  if (isDryRun) {
    console.log('   ⚠️  No active npm session detected. Continuing because --dry-run is active.');
    currentUser = 'dry-run-user';
  } else {
    console.log('   ⚠️  No active npm session detected.');
    
    if (process.stdin.isTTY && !skipLogin) {
      console.log('   Starting npm login in interactive terminal...');
      try {
        spawnSync('npm', ['login'], {
          cwd: packageDir,
          stdio: 'inherit'
        });
        currentUser = runQuiet('npm whoami');
      } catch (err) {
        // handled below
      }
    }

    if (!currentUser) {
      console.error('\n\x1b[31m✖ Error: You are not currently logged into npm.\x1b[0m');
      console.error('\nPlease authenticate using one of the following methods:');
      console.error('  1. Run \x1b[1m\x1b[33mnpm login\x1b[0m in your terminal.');
      console.error('  2. Or set the \x1b[1m\x1b[33mNPM_TOKEN\x1b[0m environment variable: export NPM_TOKEN="npm_..."');
      console.error('\nOnce logged in, run \x1b[32mnpm run release\x1b[0m to proceed with publishing.');
      process.exit(1);
    }
  }
}

console.log(`   \x1b[32m✔ Logged in as: \x1b[1m${currentUser}\x1b[0m`);

// Step 2: Read current package.json
const pkgRaw = readFileSync(packageJsonPath, 'utf-8');
const pkg = JSON.parse(pkgRaw);
const oldVersion = pkg.version;
let targetVersion = oldVersion;

// Step 3: Bump version
if (!noBump) {
  console.log(`\n🏷️  Determining version bump (${bumpType})...`);
  try {
    if (!validBumps.includes(bumpType) && !/^\d+\.\d+\.\d+/.test(bumpType)) {
      throw new Error(`Invalid bump type "${bumpType}". Must be one of: ${validBumps.join(', ')} or a semver string like 0.2.0`);
    }

    // Run npm version without git tagging
    run(`npm version ${bumpType} --no-git-tag-version`);
    const updatedPkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    targetVersion = updatedPkg.version;
    console.log(`   \x1b[32m✔ Version updated: \x1b[33m${oldVersion}\x1b[0m ➜ \x1b[1m\x1b[32mv${targetVersion}\x1b[0m`);
  } catch (err) {
    console.error(`\n\x1b[31m✖ Failed to bump version:\x1b[0m`, err.message);
    process.exit(1);
  }
} else {
  console.log(`\n🏷️  Using existing version \x1b[1m\x1b[32mv${targetVersion}\x1b[0m (--no-bump)`);
}

// Step 4: Verification and build (prepack)
console.log('\n🛠️  Running prepack checks (typecheck, vitest tests, tsup build)...');
try {
  run('npm run prepack');
  console.log('   \x1b[32m✔ All checks passed and build completed successfully.\x1b[0m');
} catch (err) {
  console.error('\n\x1b[31m✖ Prepack verification failed.\x1b[0m');
  if (!noBump && targetVersion !== oldVersion) {
    console.log('   Rolling back version in package.json...');
    pkg.version = oldVersion;
    writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  }
  process.exit(1);
}

// Step 5: Publish to npm
console.log(`\n🚀 Publishing \x1b[1m${pkg.name}@${targetVersion}\x1b[0m to npmjs.org...`);
try {
  const publishArgs = ['publish', '--access', 'public'];
  if (isDryRun) {
    publishArgs.push('--dry-run');
  }
  if (process.env.NPM_TOKEN) {
    publishArgs.push(`--//registry.npmjs.org/:_authToken=${process.env.NPM_TOKEN}`);
  }
  run(`npm ${publishArgs.join(' ')}`);
  console.log(`\n\x1b[32m✔ Successfully published \x1b[1m${pkg.name}@${targetVersion}\x1b[0m!\x1b[0m`);
} catch (err) {
  console.error('\n\x1b[31m✖ npm publish failed.\x1b[0m');
  process.exit(1);
}

// Step 6: Git commit and tag
if (!noGit && !isDryRun) {
  console.log('\n📌 Git tag & release commit...');
  try {
    const isGitRepo = runQuiet('git rev-parse --is-inside-work-tree') === 'true';
    if (isGitRepo) {
      run(`git add package.json package-lock.json`);
      run(`git commit -m "chore(release): ${pkg.name} v${targetVersion}"`);
      const tagName = `v${targetVersion}`;
      run(`git tag -a ${tagName} -m "Release ${tagName}"`);
      console.log(`   \x1b[32m✔ Created git commit and tag: \x1b[1m${tagName}\x1b[0m`);
      console.log('   \x1b[36m💡 Run "git push && git push --tags" to push changes to your remote repository.\x1b[0m');
    }
  } catch (err) {
    console.warn('   ⚠️  Git commit or tagging encountered an error or working directory was unchanged:', err.message);
  }
}

console.log('\n✨ Release finished successfully!\n');
