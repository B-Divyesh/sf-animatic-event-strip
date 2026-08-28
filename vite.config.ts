import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [{
    name: 'preview-real-404',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://preview.local').pathname.replace(/\/$/, '') || '/';
        if (['/', '/demo', '/privacy', '/terms', '/404.html'].includes(pathname) || /\.[a-z0-9]+$/i.test(pathname)) return next();
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve('dist/404.html')));
      });
    },
  }],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
