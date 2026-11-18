'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  operationsFrom,
  curlRequests,
  projectRequests,
  checkRequest,
  validateCoreApiExamples,
} = require('./validate-core-api-examples');
const schema = require('./__fixtures__/validate-core-api-examples/openapi.json');
const operations = operationsFrom(schema);
test('validates method, parameter paths and query strings without contacting Core', () => {
  for (const request of [
    { method: 'GET', url: 'http://localhost:3000/api/atoms?limit=1' },
    { method: 'GET', url: 'http://localhost:3000/api/atoms/{id}' },
    { method: 'POST', url: '/api/atoms' },
  ])
    assert.equal(
      checkRequest({ ...request, file: 'page', line: 1 }, operations),
      undefined,
    );
  for (const request of [
    { method: 'DELETE', url: '/api/atoms' },
    { method: 'GET', url: '/api/nope' },
    { method: 'GET', url: '/api/iids/int:isrc:USRC17607839/atoms' },
  ])
    assert.match(
      checkRequest({ ...request, file: 'page', line: 1 }, operations),
      /Unsupported Core operation/,
    );
});
test('reads multiline curl, explicit request, body POST and GET override', () => {
  const requests = curlRequests(
    'curl -fsS \\\n  "http://localhost:3000/api/atoms?limit=1"\ncurl --request=POST http://localhost:3000/api/atoms\ncurl -d \'{}\' http://localhost:3000/api/atoms\ncurl -G -d q=1 http://localhost:3000/api/atoms\ncurl -I http://localhost:3000/health',
    'page.md',
  );
  assert.equal(requests.length, 5);
  assert.deepEqual(
    requests.map((request) => request.method),
    ['GET', 'POST', 'POST', 'GET', 'HEAD'],
  );
});
test('extracts fetch templates, constant options and URL objects', () => {
  const result = projectRequests(
    'const base = process.env.CORE_URL; const options = { method: "GET" }; fetch(`${base}/api/atoms?limit=1`, options); const detail = new URL(`/api/atoms/${id}`, base); fetch(detail); fetch("http://localhost:3000/api/atoms", { method: "POST" });',
    'query.ts',
  );
  assert.deepEqual(result.errors, []);
  assert.equal(result.requests.length, 3);
  assert.deepEqual(
    result.requests.map((request) => checkRequest(request, operations)),
    [undefined, undefined, undefined],
  );
});
test('fails closed on dynamic URL, HTTP method, or option spreads', () => {
  for (const source of [
    'fetch(path);',
    'fetch("/api/atoms", {method: chosen});',
    'fetch("/api/atoms", {...options});',
  ])
    assert.ok(projectRequests(source, 'dynamic.ts').errors.length);
});
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'core-examples-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const commit = 'a'.repeat(40),
    write = (file, text) => {
      fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      fs.writeFileSync(
        path.join(root, file),
        typeof text === 'string' ? text : JSON.stringify(text),
      );
    };
  write('static/intuition-release.json', {
    core: { distribution: 'source', commit },
  });
  write(`scripts/core-openapi-${commit}.json`, schema);
  write(
    'docs/_data/build/query-core.md',
    'curl -fsS http://localhost:3000/api/atoms\n',
  );
  write(
    'examples/v2/core-query-api/src/index.ts',
    'fetch("http://localhost:3000/api/triples");',
  );
  return { root, write, commit };
}
test('validates both docs and project sources and rejects a new unsupported operation', (t) => {
  const { root, write } = fixture(t);
  const result = validateCoreApiExamples({ root });
  assert.deepEqual(result.errors, []);
  assert.equal(result.requests, 2);
  write(
    'examples/v2/core-query-api/src/index.ts',
    'fetch("http://localhost:3000/api/nope");',
  );
  assert.match(
    validateCoreApiExamples({ root }).errors.join('\n'),
    /GET \/api\/nope/,
  );
  write(
    'docs/_data/build/query-core.md',
    'GET /api/iids/{iid}/atoms is available.',
  );
  assert.match(validateCoreApiExamples({ root }).errors.join('\n'), /M-7/);
});
test('derives snapshot from full source commit and rejects missing snapshot', (t) => {
  const { root, write, commit } = fixture(t);
  assert.ok(validateCoreApiExamples({ root }).snapshot.includes(commit));
  write('static/intuition-release.json', {
    core: { distribution: 'source', commit: 'b'.repeat(40) },
  });
  assert.throws(
    () => validateCoreApiExamples({ root }),
    /Missing vendored Core OpenAPI/,
  );
  write('static/intuition-release.json', {
    core: { distribution: 'source', commit: 'main' },
  });
  assert.throws(() => validateCoreApiExamples({ root }), /full core.commit/);
});
