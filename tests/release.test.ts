import { readFile, readdir } from 'node:fs/promises';
import { describe, expect, test } from 'vitest';

const root = new URL('../', import.meta.url);

describe('release policy', () => {
  test('declares browser hardening and immutable hashed asset routes', async () => {
    const config = JSON.parse(await readFile(new URL('public/staticwebapp.config.json', root), 'utf8')) as {
      routes: Array<{ route: string; headers: Record<string, string> }>;
      globalHeaders: Record<string, string>;
    };
    const headers = config.globalHeaders;
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'");
    expect(headers['Content-Security-Policy']).toContain("connect-src 'self' https://api.sociobot.in");
    expect(headers['X-Frame-Options']).toBe('DENY');
    expect(headers['Permissions-Policy']).toContain('camera=()');
    for (const route of ['/assets/*', '/icons/*']) {
      expect(config.routes.find((entry) => entry.route === route)?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    }
  });

  test('uses content-addressed names for every immutable public asset', async () => {
    for (const directory of ['assets', 'icons']) {
      const files = await readdir(new URL(`public/${directory}/`, root));
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) expect(file).toMatch(/\.[a-f0-9]{8}\.[a-z0-9]+$/);
    }
  });

  test('declares every executable product claim exactly once', async () => {
    const claims = JSON.parse(await readFile(new URL('.factory/claims.json', root), 'utf8')) as Array<{ id: string; test: string }>;
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
    const sources = [
      await readFile(new URL('tests/e2e/app.spec.ts', root), 'utf8'),
      await readFile(new URL('tests/live-policy.mjs', root), 'utf8'),
    ].join('\n');
    for (const claim of claims) {
      const tag = `@claim:${claim.id}`;
      expect(claim.test).toContain(tag);
      expect(sources.split(tag)).toHaveLength(2);
    }
  });

  test('repairs AES-QA-401 by building before Playwright starts the production preview', async () => {
    const config = await readFile(new URL('playwright.config.ts', root), 'utf8');
    const serverCommand = config.match(/command:\s*'([^']+)'/)?.[1];
    expect(serverCommand).toBe('npm run build && npm run preview -- --host 127.0.0.1');
    expect(serverCommand?.indexOf('npm run build')).toBeLessThan(serverCommand?.indexOf('npm run preview') ?? -1);
  });

  test('documents the isolated demo entry point and storage namespace', async () => {
    const demo = await readFile(new URL('.factory/demo.md', root), 'utf8');
    const storage = await readFile(new URL('src/storage.ts', root), 'utf8');
    expect(demo).toContain('https://animatic-event-strip.sociobot.in/demo');
    expect(demo).toContain('demo:animatic-event-strip');
    expect(storage).toContain("demo: 'demo:animatic-event-strip'");
  });

  test('repairs AES-QA-304 with a designed 404 and an HTTP 404 catch-all', async () => {
    const page = await readFile(new URL('public/404.html', root), 'utf8');
    const config = JSON.parse(await readFile(new URL('public/staticwebapp.config.json', root), 'utf8')) as {
      routes: Array<{ route: string; rewrite?: string; statusCode?: number }>;
      responseOverrides: Record<string, { rewrite: string }>;
    };
    expect(page).toContain('<title>Page not found — Animatic Event Strip</title>');
    expect(page).toContain('That frame is <i>not on this strip.</i>');
    expect(page).toContain('href="/"');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
  });

  test('repairs AES-QA-305 with route metadata and the shared site skeleton', async () => {
    const pages = await Promise.all(['index.html', 'public/privacy/index.html', 'public/terms/index.html'].map((path) => readFile(new URL(path, root), 'utf8')));
    for (const page of pages) {
      expect(page).toContain('rel="canonical"');
      expect(page).toContain('property="og:title"');
      expect(page).toContain('name="twitter:card"');
      expect(page).toContain('rel="apple-touch-icon"');
      expect(page).toContain('class="skip-link"');
      expect(page).toContain('Animatic Event Strip home');
      expect(page).toContain('Built by Param Factory');
      expect(page).toContain('Version 1.0.0, repair 4');
      expect(page.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(page).toContain('<main');
    }
    const home = pages[0];
    expect(home).toContain('og:image:width" content="1200"');
    expect(home).toContain('og:image:height" content="630"');
    expect(await readFile(new URL('public/assets/social-preview.db2b289c.jpg', root))).not.toHaveLength(0);
    expect(await readFile(new URL('public/icons/apple-touch.af9970c1.png', root))).not.toHaveLength(0);
  });
});
