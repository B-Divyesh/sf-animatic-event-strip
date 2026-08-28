import assert from 'node:assert/strict';

// @claim:studio-checkout — the hosted checkout, price path, and live deployment are reachable.

const site = process.env.LIVE_URL ?? 'https://animatic-event-strip.sociobot.in';
const api = 'https://api.sociobot.in/api/v1/products/animatic-event-strip';

const checkout = await fetch(`${api}/checkout`, { redirect: 'manual' });
assert.ok([302, 303, 307, 308].includes(checkout.status), `checkout returned HTTP ${checkout.status}`);
assert.match(checkout.headers.get('location') ?? '', /^https:\/\/checkout\.dodopayments\.com\/session\//, 'checkout did not redirect to the hosted payment page');

const token = `qa-rate-limit-${Date.now()}`;
let limited;
for (let wave = 0; wave < 20 && !limited; wave += 1) {
  const responses = await Promise.all(Array.from({ length: 10 }, () => fetch(`${api}/verify?license=${token}`)));
  limited = responses.find((response) => response.status === 429);
}
assert.ok(limited, 'license verification accepted 200 requests without returning HTTP 429');
assert.match(limited.headers.get('retry-after') ?? '', /^\d+$/, 'rate-limit response omitted a numeric Retry-After');

const page = await fetch(site);
assert.equal(page.status, 200, `live product returned HTTP ${page.status}`);
const policies = {
  'content-security-policy': /frame-ancestors 'none'/,
  'x-frame-options': /^DENY$/,
  'permissions-policy': /camera=\(\)/,
};
for (const [name, expected] of Object.entries(policies)) {
  assert.match(page.headers.get(name) ?? '', expected, `live response is missing ${name}`);
}
const html = await page.text();
assert.match(html, /<title>Animatic Event Strip/, 'live product identity title is wrong');
assert.match(html, /<h1[^>]*id="product-title"/, 'live product identity heading is wrong');
assert.match(html, /Studio Pack costs \$12 once/, 'live product does not state the tested one-time price');
assert.match(html, /href="https:\/\/api\.sociobot\.in\/api\/v1\/products\/animatic-event-strip\/checkout"/, 'live buy link does not use Sociobot checkout');

const assetPath = html.match(/(?:src|href)="(\/assets\/[^"?#]+\.[a-f0-9]{8}\.[^"?#]+)"/)?.[1];
assert.ok(assetPath, 'live page did not reference a content-addressed asset');
const asset = await fetch(new URL(assetPath, site));
assert.match(asset.headers.get('cache-control') ?? '', /max-age=31536000/, 'hashed asset is not long-lived');
assert.match(asset.headers.get('cache-control') ?? '', /immutable/, 'hashed asset is not immutable');

console.log(`PASS checkout=${checkout.status} rate-limit=429 retry-after=${limited.headers.get('retry-after')} live=${page.status} asset=${assetPath}`);
