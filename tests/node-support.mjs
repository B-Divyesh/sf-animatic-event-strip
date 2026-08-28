import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

// @claim:node-support — the declared minimum Node runtime builds the production artifact.

assert.match(process.version, /^v20\.19\./, `expected Node 20.19.x, received ${process.version}`);
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
assert.equal(manifest.engines?.node, '^20.19.0 || >=22.12.0');

const result = spawnSync('npm', ['run', 'build'], {
  cwd: new URL('../', import.meta.url),
  env: process.env,
  encoding: 'utf8',
});
if (result.status !== 0) process.stderr.write(`${result.stdout}${result.stderr}`);
assert.equal(result.status, 0, 'the production build failed on Node 20.19');
console.log(`PASS node=${process.version} engine=${manifest.engines.node} production-build=ok`);
