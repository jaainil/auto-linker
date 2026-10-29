import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://auto-linker.juhenza.dev',
  compressHTML: true,
  devToolbar: { enabled: false },
  build: {
    inlineStylesheets: 'auto',
  },
});
