// #region fixture-enrichment
import {
  createEnrichmentEngine,
  type EnrichmentPlugin,
} from '@0xintuition/atom-enrichment';

// Synthetic fixtures: no HTTP provider, credentials, or fetched page.
const fixture: EnrichmentPlugin = {
  id: 'catalog-fixture',
  version: '1.0.0',
  runtime: 'universal',
  artifactTypes: ['opengraph'],
  supports: (request) => request.input.atomType === 'thing',
  enrich: async (_request, { now }) => [
    {
      artifact_type: 'opengraph',
      data: { title: 'Synthetic catalog' },
      meta: {
        pluginId: 'catalog-fixture',
        provider: 'offline-fixture',
        fetchedAt: now(),
      },
    },
  ],
};
const unavailable: EnrichmentPlugin = {
  ...fixture,
  id: 'unavailable-fixture',
  enrich: async () => {
    throw new Error('Fixture provider unavailable');
  },
};

const engine = createEnrichmentEngine({
  plugins: [fixture, unavailable],
  now: () => '2026-01-01T00:00:00.000Z',
});
export const enriched = await engine.enrich({
  runtime: 'server',
  input: {
    atomType: 'thing',
    jsonLd: { '@context': 'https://schema.org/', '@type': 'Thing' },
    source: {
      classificationEngine: 'offline-fixture',
      classifiedAt: '2026-01-01T00:00:00.000Z',
    },
  },
});
console.log(enriched.status, enriched.artifacts.length, enriched.errors.length);
// #endregion
