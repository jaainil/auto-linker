import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { Writable } from 'node:stream';
import semanticRelease from 'semantic-release';
import config from '../release.config.mjs';

it('previews the next release from the existing 0.1.0 tag without publishing or tagging', async () => {
  const root = mkdtempSync(join(tmpdir(), 'auto-linker-release-'));
  const work = join(root, 'work');
  const remote = join(root, 'remote.git');
  mkdirSync(work);
  const git = (...args) => execFileSync('git', args, { cwd: work, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  let output = '';
  const sink = new Writable({ write(chunk, _encoding, done) { output += chunk.toString(); done(); } });
  try {
    git('init', '--bare', '--initial-branch=main', remote);
    git('init', '--initial-branch=main');
    git('config', 'user.name', 'Release test');
    git('config', 'user.email', 'release-test@example.invalid');
    git('commit', '--allow-empty', '-m', 'chore: baseline');
    git('tag', 'auto-linker-v0.1.0');
    git('commit', '--allow-empty', '-m', 'feat: add another matching signal');
    git('remote', 'add', 'origin', remote);
    git('push', '--quiet', '--tags', 'origin', 'main');
    const resolve = createRequire(import.meta.url).resolve;
    const plugins = config.plugins.slice(0, 2).map(([name, options]) => [resolve(name), options]);
    const result = await semanticRelease({ ...config, plugins, repositoryUrl: pathToFileURL(remote).href, dryRun: true, ci: false }, {
      cwd: work,
      env: {
        PATH: process.env.PATH, HOME: process.env.HOME,
        GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main', GITHUB_EVENT_NAME: 'push',
      },
      stdout: sink, stderr: sink,
    });
    expect(result, output).toBeTruthy();
    expect(result.lastRelease.version).toBe('0.1.0');
    expect(result.nextRelease.version).toBe('0.2.0');
    expect(result.nextRelease.gitTag).toBe('auto-linker-v0.2.0');
    expect(git('tag', '--list')).toBe('auto-linker-v0.1.0');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}, 20000);
