# Automatic semantic releases

Package: `@imjp/auto-linker`. Repository: `jaainil/auto-linker`. Trusted workflow: `.github/workflows/publish.yml`.

Every push to `main` runs library checks on Node 22, 24 and 26. If they pass, semantic-release analyzes commits since the previous release. It chooses the next version, generates notes, updates the package version in the CI checkout, publishes to npm using OIDC, and creates a GitHub release and tag.

| Commit | Release |
| --- | --- |
| `fix: preserve entity offsets` | Patch, e.g. 0.1.0 → 0.1.1 |
| `feat: support additional metadata` | Minor, e.g. 0.1.0 → 0.2.0 |
| `feat!: replace the public API` | Major, e.g. 0.1.0 → 1.0.0 |
| A `BREAKING CHANGE:` footer | Major |
| `docs:`, `ci:`, `chore:` | No release by default |
| `fix(site): ...`, `feat(site): ...` | No library release |

Use the `site` scope for website-only changes. Use Conventional Commit titles for squashed pull requests. Multiple eligible changes produce one release with the highest required increment. Do not manually bump versions or push release tags.

## Version source and baseline

The existing npm release `0.1.0` is registered as `auto-linker-v0.1.0` at commit `f39bb46`, which renamed the published package to the imjp scope. Tags use `auto-linker-v${version}` to distinguish the library and avoid the former `v*` trigger.

Versions in the npm artifact and release tags are authoritative. The committed `package/package.json` may continue to say `0.1.0`: semantic-release writes the actual new version to the CI checkout during preparation. No generated version commit is pushed to `main`; no extra write token or release-commit loop is needed. Release notes are available in GitHub Releases rather than a committed changelog file.

## Authentication

npm trusted publishing is configured for owner `jaainil`, repository `auto-linker`, workflow filename `publish.yml`, no environment. The release job has `id-token: write` for npm and `contents: write` for GitHub tags/releases. It uses the built-in `GITHUB_TOKEN`; there is no npm token secret. Issue/PR comments and released-label changes are disabled.

The workflow uses Node 24 with the lockfile-pinned semantic-release toolchain. `setup-node` intentionally omits `registry-url`, allowing semantic-release's npm plugin to manage OIDC authentication.

Inspect trust from an authenticated maintainer session:

```sh
npm trust list @imjp/auto-linker
```

If trust expires before its first successful CI publication, recreate it using npm CLI 11.15+ and account-level 2FA:

```sh
npm trust github @imjp/auto-linker --repo jaainil/auto-linker --file publish.yml --allow-publish
```

npm documents a two-day validation window for new trust configurations. Publishing an eligible commit through Actions validates it.

## Preview and retry

In GitHub Actions, select **Semantic release** → **Run workflow**, choose `main`, and leave `dry_run` checked. This verifies authentication and calculates the next version/notes without publishing. It requires the normal repository/npm permissions even in dry-run mode. Uncheck dry run to retry a release manually; commit analysis still determines whether a new release is warranted.

`npm run release:dry-run` inside `package/` invokes the same CLI locally, but live plugin verification needs a maintainer GitHub token and suitable npm authentication. Prefer the Actions preview. The old direct-publish and patch/minor/major release scripts have been removed.

References: [semantic-release GitHub Actions](https://semantic-release.org/recipes/ci-configurations/github-actions/), [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
