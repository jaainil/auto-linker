import { expect, it } from 'vitest';
import { analyzeCommits } from '@semantic-release/commit-analyzer';
import { generateNotes } from '@semantic-release/release-notes-generator';
import config from '../release.config.mjs';

const analyzer = config.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === '@semantic-release/commit-analyzer')[1];
const notes = config.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === '@semantic-release/release-notes-generator')[1];
const logger = { log() {}, error() {} };
it.each([
  ['fix: handle entities safely', 'patch'],
  ['feat: support additional anchor metadata', 'minor'],
  ['feat!: replace the public API', 'major'],
  ['fix: change options\n\nBREAKING CHANGE: removed old options', 'major'],
  ['docs: improve examples', null],
  ['ci: update release tooling', null],
  ['fix(site): correct the hero layout', null],
  ['feat(site): add a landing page section', null],
])('classifies %s as %s', async (message, expected) => {
  expect(await analyzeCommits(analyzer, { commits: [{ hash: 'abc123', message }], logger, cwd: process.cwd() })).toBe(expected);
});
it('generates release notes for an actual bug fix', async () => {
  const result = await generateNotes(notes, {
    commits: [{ hash: 'a'.repeat(40), message: 'fix: preserve entity source offsets' }],
    logger, cwd: process.cwd(), options: { repositoryUrl: config.repositoryUrl },
    lastRelease: { version: '0.1.0', gitTag: 'auto-linker-v0.1.0' },
    nextRelease: { version: '0.1.1', gitTag: 'auto-linker-v0.1.1' },
  });
  expect(result).toContain('preserve entity source offsets');
  expect(result).toContain('0.1.1');
});
