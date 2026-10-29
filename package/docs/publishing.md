# Publishing from GitHub Actions

Repository: `jaainil/auto-linker`. Package: `@imjp/auto-linker`. Workflow file: `.github/workflows/publish.yml`.

## Authentication setup

The initial `0.1.0` release was submitted locally using the npm account `imjp`. npm accepted the upload and may take time to expose a new package in public registry lookups. A trusted publisher was then created and verified for repository `jaainil/auto-linker`, workflow `publish.yml`, allowing direct publishing. The workflow uses Node 24, npm 11 and `id-token: write`; no npm token secret is required.

To inspect the trust configuration from an authenticated maintainer session:

```sh
npm trust list @imjp/auto-linker
```

If trust needs to be recreated, authenticate with `npm login`, enable account-level 2FA, then use npm CLI 11.15+:

```sh
npm trust github @imjp/auto-linker --repo jaainil/auto-linker --file publish.yml --allow-publish
```

Or use npm package Settings → Trusted Publisher, provider GitHub Actions, owner `jaainil`, repository `auto-linker`, filename `publish.yml`, no environment, and allow direct publishing. Values must match exactly. npm documents that a new trust configuration expires unless it completes its first successful publish within two days; if that happens, recreate the configuration before the next release.

## Later releases

Update `package/package.json` and its lockfile in a reviewed commit, for example with `npm version patch --no-git-tag-version` inside `package/`. Push the commit to `main`, then either dispatch the workflow with the exact committed version and dry run disabled, or push a matching version tag:

```sh
git tag v0.1.1
git push origin v0.1.1
```

Only tag the intended release commit. The workflow refuses a version/tag mismatch and manual publication from branches other than `main`. It does not mutate versions, commits or tags. Do not trigger both manual and tag publication for the same version: npm versions are immutable. Publication is serialized to prevent simultaneous releases, and a GitHub Release event is deliberately not a second publishing trigger.

The old local `scripts/release.mjs` directly publishes and is not the supported route. Use Actions for this project's releases.

References: [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), [npm trust prerequisites](https://docs.npmjs.com/cli/v11/commands/npm-trust/).
