import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import { readGraph } from './query-client.ts';

const emptyPage = { data: [], pagination: { limit: 10, offset: 0, count: 0 } };
const emptyCatalog = { data: [] };
const routes = [
  'http://localhost:3000/api/atoms?limit=10&offset=0',
  'http://localhost:3000/api/triples?limit=10&offset=0',
  'http://localhost:3000/api/predicates',
];

function useResponses(t: TestContext, responses: Response[]) {
  let i = 0;
  return t.mock.method(
    globalThis,
    'fetch',
    (input: string, options: RequestInit) => {
      assert.equal(input, routes[i]);
      assert.equal(options.method, 'GET');
      assert.equal(options.redirect, 'error');
      assert.ok(options.signal instanceof AbortSignal);
      options.signal.throwIfAborted();
      const response = responses[i++];
      assert.ok(response, 'Unexpected request');
      return Promise.resolve(response);
    },
  );
}

test('accepts empty pages and an unpaginated catalog', async (t) => {
  const requests = useResponses(
    t,
    [emptyPage, emptyPage, emptyCatalog].map((value) => Response.json(value)),
  );
  assert.deepEqual(await readGraph(), {
    atoms: emptyPage,
    triples: emptyPage,
    predicates: [],
  });
  assert.equal(requests.mock.callCount(), 3);
});

test('returns typed atom, triple and predicate fields', async (t) => {
  const atom = { id: 'a', isOnchain: false, parseStatus: 'pending' };
  const triple = { id: 't', subjectId: 'a', predicateId: 'p', objectId: 'b' };
  const predicate = {
    id: 'p',
    slug: 'example',
    label: 'Example',
    description: null,
  };
  const pagination = { limit: 10, offset: 0, count: 1 };
  useResponses(t, [
    Response.json({ data: [{ ...atom, extra: true }], pagination }),
    Response.json({ data: [triple], pagination }),
    Response.json({ data: [predicate] }),
  ]);
  assert.deepEqual(await readGraph(), {
    atoms: { data: [atom], pagination },
    triples: { data: [triple], pagination },
    predicates: [predicate],
  });
});

test('rejects a total count in place of the current page size', async (t) => {
  useResponses(t, [
    Response.json({
      data: [],
      pagination: { limit: 10, offset: 0, count: 12 },
    }),
  ]);
  await assert.rejects(readGraph(), /Pagination/);
});

for (const predicate of [
  { id: 'p', slug: null, label: 'Example', description: null },
  { id: 'p', slug: 'example', description: null },
  { id: 'p', slug: 'example', label: 'Example' },
]) {
  test(
    'rejects incomplete predicate ' + JSON.stringify(predicate),
    async (t) => {
      useResponses(t, [
        Response.json(emptyPage),
        Response.json(emptyPage),
        Response.json({ data: [predicate] }),
      ]);
      await assert.rejects(readGraph(), /Invalid or oversized text/);
    },
  );
}

test('reports HTTP failures before attempting JSON parsing', async (t) => {
  useResponses(t, [new Response('Access denied', { status: 401 })]);
  await assert.rejects(readGraph(), /HTTP 401/);
});

test('rejects malformed JSON', async (t) => {
  useResponses(t, [new Response('{')]);
  await assert.rejects(readGraph(), SyntaxError);
});

test('limits streamed response bytes without a Content-Length header', async (t) => {
  useResponses(t, [new Response(new Uint8Array(1024 * 1024 + 1))]);
  await assert.rejects(readGraph(), /exceeds 1 MiB/);
});

test('passes the five-second deadline through to fetch', async (t) => {
  t.mock.method(AbortSignal, 'timeout', (ms: number) => {
    assert.equal(ms, 5000);
    return AbortSignal.abort(
      new DOMException('Deadline expired', 'TimeoutError'),
    );
  });
  useResponses(t, []);
  await assert.rejects(readGraph(), { name: 'TimeoutError' });
});
