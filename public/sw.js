/* Animatic Event Strip service worker — app shell v1 */
const VERSION = 'aes-shell-v1';
const SHELL = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon.svg', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/assets/cutting-room-960.webp', '/assets/cutting-room-1536.webp', '/assets/cutting-room-960.jpg', '/privacy/', '/terms/', '/legal.css'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    const response = await fetch('/index.html');
    const html = await response.text();
    const assetPaths = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)/g)].map((match) => match[1]);
    await Promise.all(assetPaths.map((path) => cache.add(path).catch(() => undefined)));
    await self.skipWaiting();
  })());
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
        return (await caches.match(request)) || (await caches.match('/index.html')) || (await caches.match('/offline.html'));
      }
    })());
    return;
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const fresh = await fetch(request);
      const cache = await caches.open(VERSION);
      cache.put(request, fresh.clone());
      return fresh;
    })());
    return;
  }
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
