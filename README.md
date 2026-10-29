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

See the [release guide](package/docs/publishing.md). The [Publish to npm workflow](.github/workflows/publish.yml) checks Node 22/24/26, validates the committed version, and publishes publicly with provenance. Run it manually for version `0.1.0` with `dry_run` enabled to preview; disable `dry_run` to publish. Version tags (`v0.1.0`) also publish, and must match `package/package.json`.

The first release needs a temporary `NPM_TOKEN` repository secret. After the package exists, configure npm trusted publishing for `jaainil/auto-linker`, workflow `publish.yml`, and remove the secret. No version bump, commit, tag or release is created by the workflow.
