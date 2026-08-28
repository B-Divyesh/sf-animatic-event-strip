/* Animatic Event Strip service worker — app shell v6 */
const VERSION = 'aes-shell-v6';
const SHELL = ['/', '/index.html', '/mode.js', '/offline.html', '/404.html', '/manifest.webmanifest', '/icons/icon.d996dad9.svg', '/icons/icon-192.d8a89c52.png', '/icons/icon-512.50176303.png', '/icons/icon-maskable-512.50176303.png', '/icons/apple-touch.af9970c1.png', '/assets/cutting-room-960.c6872b74.webp', '/assets/cutting-room-1536.2f79d519.webp', '/assets/cutting-room-960.641304ed.jpg', '/assets/social-preview.db2b289c.jpg', '/privacy/', '/terms/', '/assets/legal.a276ee27.css'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    const response = await fetch('/index.html');
    const html = await response.text();
    const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)/g)].map((match) => match[1]);
    await Promise.all(assetPaths.map((path) => cache.add(path).catch(() => undefined)));
  })());
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') void self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('aes-shell-') && key !== VERSION).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(VERSION);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(request, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || (await caches.match('/offline.html', { ignoreVary: true }));
      }
    })());
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request, { ignoreVary: true });
      if (cached) return cached;
      const fresh = await fetch(request);
      const cache = await caches.open(VERSION);
      cache.put(request, fresh.clone());
      return fresh;
    })());
    return;
  }
  event.respondWith(fetch(request).catch(() => caches.match(request, { ignoreVary: true })));
});
