import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');
const configuredUrl = SITE_URL && SITE_URL !== 'https://example.org' ? new URL(SITE_URL) : undefined;

export default defineConfig({
  output: 'static',
  site: configuredUrl?.origin,
  base: configuredUrl?.pathname || '/'
});
