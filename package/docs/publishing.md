# Publishing from GitHub Actions

Repository: `jaainil/auto-linker`. Package: `@juhenza/auto-linker`. Workflow file: `.github/workflows/publish.yml`.

## First release

1. Authenticate locally with `npm login --registry=https://registry.npmjs.org/` and complete npm's browser flow. `npm whoami` identifies the account; it must have permission to publish under the `@juhenza` scope. Login on a laptop does not authenticate GitHub's runner.
2. Create a short-lived granular npm token on npmjs.com with the package/scope write permissions needed for the first release and CI publishing permitted under the account's 2FA settings. Store it directly as the repository Actions secret `NPM_TOKEN` at https://github.com/jaainil/auto-linker/settings/secrets/actions . Never paste it into a commit, issue or chat. If the account cannot create a CI-capable token, complete the account's npm settings before dispatching publication.
3. Open https://github.com/jaainil/auto-linker/actions/workflows/publish.yml . Select **Run workflow**, branch `main`, version `0.1.0`, and leave `dry_run` checked. Verify all jobs pass.
4. Run the same committed version with `dry_run` unchecked. This publishes the first real package directly from GitHub Actions; there is no local bootstrap publish.
5. Verify `npm view @juhenza/auto-linker@0.1.0 version` and the workflow's publish result.

## Configure trusted publishing after the first release

npm requires the package to exist before configuring trust. Using npm CLI 11.15+ with account-level 2FA enabled and an authenticated session:

```sh
npm trust github @juhenza/auto-linker --repo jaainil/auto-linker --file publish.yml --allow-publish
npm trust list @juhenza/auto-linker
```

Or use npm package Settings → Trusted Publisher, provider GitHub Actions, owner `jaainil`, repository `auto-linker`, filename `publish.yml`, no environment, and allow direct publishing. These values must match exactly. Remove the temporary `NPM_TOKEN` repository secret after trust setup. The workflow's npm 11 CLI detects GitHub's OIDC identity using `id-token: write`. Account login and scope permissions remain prerequisites for configuring this trust.

## Later releases

Update `package/package.json` and its lockfile in a reviewed commit, for example with `npm version patch --no-git-tag-version` inside `package/`. Push the commit to `main`, then either dispatch the workflow with the exact committed version and dry run disabled, or push a matching version tag:

```sh
git tag v0.1.1
git push origin v0.1.1
```

Only tag the intended release commit. The workflow refuses a version/tag mismatch and manual publication from branches other than `main`. It does not mutate versions, commits or tags. Do not trigger both manual and tag publication for the same version: npm versions are immutable. Publication is serialized to prevent simultaneous releases, and a GitHub Release event is deliberately not a second publishing trigger.

The old local `scripts/release.mjs` directly publishes and is not the supported route. Use Actions for this project's releases.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/).
