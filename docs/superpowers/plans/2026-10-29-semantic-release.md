# Semantic-release migration

Goal: replace manual npm version/tag publishing with tested Conventional Commit releases on main.

- Pin semantic-release in the standalone library's devDependencies; runtime dependencies remain unchanged.
- Run the CLI from package/ with a local release.config.mjs, main-only releases, and auto-linker-v${version} tags.
- Register the already published 0.1.0 baseline at f39bb46 (scope-renaming commit). The auto-linker-v prefix avoids triggering the old v* workflow from the historical tag.
- Run Node 22/24/26 verification before the Node 24 release job. Keep publish.yml to retain the existing npm OIDC trust identity; grant contents:write for tags/releases and id-token:write for npm.
- Use default fix/feat/breaking release analysis, excluding site-scoped changes. Disable GitHub issue comments/labels; publish release notes only.
- Let semantic-release update the package version in the CI checkout; do not make release commits or commit generated package version changes back to main. Tags and npm are authoritative.
- Replace legacy direct npm-publish scripts with semantic-release scripts; docs explain main releases and manual dry-run.
- Verify release analysis against real plugins (patch, minor, breaking, docs, site), run all tests and builds, inspect workflow, register baseline, push config, inspect Actions.

Verification record:
- Pinned semantic-release 25.0.9 and conventional-changelog-conventionalcommits 9.3.1 after a real notes-generation test reproduced preset 10 / writer 8 incompatibility.
- 68 tests pass, including release policy cases and an isolated local Git dry-run using a 0.1.0 baseline and a feature commit (computed 0.2.0; no tag/publish).
- Typecheck, ESM/CJS/declaration builds, quickstart and synthetic evaluation pass.
- Workflow parsed and inspected: main-only trigger, release depends on matrix, full release history, GitHub contents write, OIDC token permission, no setup-node registry-url or npm secret.
- Independent read-only review found no correctness blockers; baseline must be pushed before enabling the main trigger.
- GitHub issue/PR comments and failure issues are disabled using the installed plugin's condition options.
