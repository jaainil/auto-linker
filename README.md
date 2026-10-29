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

The library is an experimental v0.1 implementation. Real-article evaluation and release checks remain; see the [package documentation](package/README.md).

## Automatic releases

[`@imjp/auto-linker`](https://www.npmjs.com/package/@imjp/auto-linker) is released by [semantic-release](https://semantic-release.org/) through [GitHub Actions](.github/workflows/publish.yml). After tests pass on Node 22/24/26, commits on `main` determine the next version: `fix:` → patch, `feat:` → minor, breaking changes → major. Use the `site` scope for website-only changes; documentation and CI commits do not publish by default.

npm publishing uses the configured GitHub OIDC identity, with no npm token secret. The workflow creates version tags and GitHub release notes automatically. See the [release guide](package/docs/publishing.md) for previews and commit conventions.
