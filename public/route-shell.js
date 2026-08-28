(() => {
  const heading = document.getElementById('route-title');
  const status = document.getElementById('route-status');
  if (!heading || !status) return;

  history.scrollRestoration = 'manual';
  let announced = false;

  const restoreRoute = () => {
    const state = history.state;
    if (typeof state?.scrollX === 'number' && typeof state?.scrollY === 'number') {
      window.scrollTo(state.scrollX, state.scrollY);
    }
    status.textContent = '';
    requestAnimationFrame(() => {
      heading.focus({ preventScroll: true });
      status.textContent = document.body.dataset.routeMessage || `${document.title} loaded.`;
    });
    announced = true;
  };

  window.addEventListener('pagehide', () => {
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    history.replaceState({ ...state, scrollX: window.scrollX, scrollY: window.scrollY }, '', location.href);
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || !announced) restoreRoute();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', restoreRoute, { once: true });
  else restoreRoute();
})();
