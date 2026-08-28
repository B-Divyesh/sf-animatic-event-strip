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

  test('documents the isolated demo entry point and storage namespace', async () => {
    const demo = await readFile(new URL('.factory/demo.md', root), 'utf8');
    const storage = await readFile(new URL('src/storage.ts', root), 'utf8');
    expect(demo).toContain('https://animatic-event-strip.sociobot.in/demo');
    expect(demo).toContain('demo:animatic-event-strip');
    expect(storage).toContain("demo: 'demo:animatic-event-strip'");
  });
});
