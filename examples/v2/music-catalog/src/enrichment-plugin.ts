import assert from 'node:assert/strict';
import {
  createEnrichmentEngine,
  type EnrichmentRequestInput,
} from '@0xintuition/atom-enrichment';
import { ProviderHttpError } from '@0xintuition/atom-enrichment/providers';

// #region catalog-page-plugin
import {
  defineEnrichmentPlugin,
  type EnrichmentPlugin,
} from '@0xintuition/atom-enrichment';
import { opengraphDataSchema } from '@0xintuition/atom-enrichment/provider-data';

type ReadPage = (url: string, signal: AbortSignal) => Promise<unknown>;
const albumPage = 'https://catalog.example/albums/night-train';

export function createCatalogPlugin(readPage: ReadPage): EnrichmentPlugin {
  return defineEnrichmentPlugin({
    id: 'catalog-page',
    version: '1.0.0',
    runtime: 'server',
    artifactTypes: ['opengraph'],
    priority: 40,
    TTL: 3_600,
    supports: (request) => request.input.hints?.url === albumPage,
    async enrich(request, ctx) {
      const url = request.input.hints?.url;
      if (url !== albumPage) return [];
      const payload = await readPage(url, ctx.signal);
      const parsed = opengraphDataSchema.safeParse(payload);
      if (!parsed.success || !parsed.data.title?.trim()) {
        throw new Error('Catalog page has no valid title.');
      }
      return [
        {
          artifact_type: 'opengraph',
          data: { title: parsed.data.title.trim() },
          meta: {
            pluginId: 'catalog-page',
            provider: 'music-catalog',
            sourceUrl: url,
            fetchedAt: ctx.now(),
          },
        },
      ];
    },
  });
}
// #endregion

// #region catalog-preset
import {
  createAtomServicesProcessingRuntime,
  createEnrichmentPresetFactories,
  type AtomServicesProcessingRuntimeOptions,
} from '@0xintuition/atom-runtime';

export function createCatalogRuntime(
  options: AtomServicesProcessingRuntimeOptions,
  plugin: EnrichmentPlugin,
) {
  const presets = createEnrichmentPresetFactories(options.env);
  return createAtomServicesProcessingRuntime({
    ...options,
    pluginOverrides: {
      ...options.pluginOverrides,
      enrichment: {
        ...options.pluginOverrides?.enrichment,
        default: () => [...presets.default(), plugin],
      },
    },
  });
}
// #endregion

const observedAt = '2026-01-01T00:00:00.000Z';
const request: EnrichmentRequestInput = {
  runtime: 'server',
  input: {
    atomType: 'thing',
    jsonLd: { '@type': 'MusicAlbum' },
    source: {
      classificationEngine: 'catalog-fixture',
      classifiedAt: observedAt,
    },
    hints: { url: albumPage },
  },
};

async function checkCatalogPlugin() {
  let reads = 0;
  const plugin = createCatalogPlugin(async (url, signal) => {
    assert.equal(url, albumPage);
    signal.throwIfAborted();
    reads++;
    return { title: 'Night Train', privateNote: 'fixture-only' };
  });
  const engine = createEnrichmentEngine({
    plugins: [plugin],
    now: () => observedAt,
  });
  const success = await engine.enrich(request);
  assert.equal(success.status, 'success');
  assert.deepEqual(success.errors, []);
  assert.deepEqual(success.artifacts, [
    {
      artifact_type: 'opengraph',
      data: { title: 'Night Train' },
      meta: {
        pluginId: plugin.id,
        provider: 'music-catalog',
        sourceUrl: albumPage,
        fetchedAt: observedAt,
      },
    },
  ]);
  console.log('match: success, Night Train');

  const unrelated = await engine.enrich({
    ...request,
    input: {
      ...request.input,
      hints: { url: 'https://catalog.example/about' },
    },
  });
  assert.equal(unrelated.status, 'success');
  assert.deepEqual(unrelated.artifacts, []);
  assert.deepEqual(unrelated.skipped, [
    { pluginId: plugin.id, reason: 'not_applicable' },
  ]);
  assert.equal(reads, 1);
  console.log('unrelated: not_applicable, no extra read');

  const invalid = createCatalogPlugin(async () => ({
    title: 42,
    privateNote: 'fixture-only',
  }));
  const rejected = await createEnrichmentEngine({ plugins: [invalid] }).enrich(
    request,
  );
  assert.equal(rejected.status, 'failed');
  assert.deepEqual(rejected.artifacts, []);
  assert.deepEqual(rejected.errors, [
    {
      pluginId: plugin.id,
      code: 'internal_error',
      message: 'Catalog page has no valid title.',
      retriable: false,
    },
  ]);
  console.log('invalid payload: failed, no artifact');

  const unavailable = createCatalogPlugin(async () => {
    throw new ProviderHttpError({ status: 503 });
  });
  const outage = await createEnrichmentEngine({
    plugins: [unavailable],
  }).enrich(request);
  assert.equal(outage.status, 'failed');
  assert.deepEqual(outage.artifacts, []);
  assert.equal(outage.errors[0]?.code, 'upstream_error');
  assert.equal(outage.errors[0]?.retriable, true);
  const details = outage.errors[0]?.details;
  assert.ok(details && 'status' in details);
  assert.equal(details.status, 503);
  console.log('upstream: failed, retryable HTTP 503');

  const caller = new AbortController();
  let observedAbort = false;
  const waiting = createCatalogPlugin(
    (_url, signal) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            observedAbort = true;
            reject(signal.reason);
          },
          { once: true },
        );
        caller.abort(new Error('Catalog read cancelled.'));
      }),
  );
  const cancelled = await createEnrichmentEngine({ plugins: [waiting] }).enrich(
    request,
    { signal: caller.signal },
  );
  assert.ok(observedAbort);
  assert.equal(cancelled.status, 'failed');
  assert.deepEqual(cancelled.artifacts, []);
  assert.equal(cancelled.errors[0]?.message, 'Catalog read cancelled.');
  console.log('cancellation: transport observed abort, no artifact');

  const runtime = createCatalogRuntime(
    { env: {}, cacheProvider: 'none' },
    plugin,
  );
  try {
    const expected = [...createEnrichmentPresetFactories({}).default(), plugin];
    const composed = runtime.enrichment.engine('default');
    assert.deepEqual(
      composed
        .listPlugins()
        .map((p) => p.id)
        .sort(),
      expected.map((p) => p.id).sort(),
    );
    const result = await composed.enrich({ ...request, plugins: [plugin.id] });
    assert.equal(result.status, 'success');
    assert.deepEqual(
      result.artifacts.map((record) => record.data.title),
      ['Night Train'],
    );
    assert.equal(reads, 2);
    console.log(
      'preset: built-ins retained, catalog-page produced the requested artifact',
    );
  } finally {
    runtime.dispose();
  }
}

if (import.meta.main) await checkCatalogPlugin();
