# JUHENZA Auto-Linker

The framework-independent TypeScript linking package is in [`package/`](package/README.md). It provides synchronous `autoLink()`, `suggestLinks()` and audit-based exact reversal, without external services.

```sh
cd package
npm ci
npm test
npm run build
node examples/basic.mjs
npm run evaluate
```

The repository root also contains the Astro product website and its separate browser demo:

```sh
npm ci
npm run dev
npm run build
```

The library is an experimental local v0.1 implementation. Real-article evaluation and release checks remain; see the [package documentation](package/README.md).

## Publishing to npm via GitHub Actions

The repository includes an automated release workflow in [`.github/workflows/publish.yml`](.github/workflows/publish.yml):

1. **Add your npm token**: In GitHub repository settings, go to `Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`, name it `NPM_TOKEN`, and paste an npm automation/granular access token with write access to `@juhenza`.
2. **Trigger release with auto-version update**:
   - Go to the **Actions** tab on GitHub.
   - Select **Release & Publish to npm**.
   - Click **Run workflow**, choose the version bump (`patch`, `minor`, `major`), and run.
   - The workflow automatically bumps the version in `package.json`, commits and tags it (`v*`), creates a GitHub Release, runs tests, and publishes to npmjs.org with `--access public --provenance`.
