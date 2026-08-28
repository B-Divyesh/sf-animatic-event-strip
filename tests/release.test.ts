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
});
