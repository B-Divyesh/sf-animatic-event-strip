(() => {
  const demo = location.pathname.replace(/\/$/, '') === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
  document.documentElement.classList.toggle('demo-route', demo);
  if (demo) {
    document.title = 'Demo — Animatic Event Strip';
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', 'https://animatic-event-strip.sociobot.in/demo');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Demo — Animatic Event Strip');
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://animatic-event-strip.sociobot.in/demo');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', 'Demo — Animatic Event Strip');
  }
})();
