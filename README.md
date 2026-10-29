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

The library is an experimental local v0.1 implementation. It has not been published. Real-article evaluation and release checks remain; see the [package documentation](package/README.md).
