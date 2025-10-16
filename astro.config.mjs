import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// GitHub Pages repo info
const repo = 'research-website';
const user = 'FrankShih0807';
const base = `/${repo}`;

export default defineConfig({
  site: `https://${user}.github.io${base}`,
  base,
  integrations: [sitemap()],
  vite: {
    plugins: [
      // ensure public assets are copied; Astro handles /public by default
      viteStaticCopy({ targets: [] })
    ]
  }
});

