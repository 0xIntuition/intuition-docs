import assert from 'node:assert/strict';
import type { EnrichmentPlugin } from '@0xintuition/atom-enrichment/plugin-api';

// An injected, bounded local transport: this never contacts MusicBrainz.
const fixtureMbid = 'b1a9c0e9-d987-4042-ae91-78d6a3267d69';
const fixtureProvider: EnrichmentPlugin = {
  id: 'fixture-recording',
  version: '1.0.0',
  runtime: 'universal',
  artifactTypes: ['musicbrainz'],
  supports: (request) => request.input.hints?.identifiers?.mbid === fixtureMbid,
  async enrich(_request, context) {
    context.signal.throwIfAborted();
    return [
      {
        artifact_type: 'musicbrainz',
        data: {
          mbid: fixtureMbid,
          name: 'One More Time',
          type: 'Recording',
          artistCredit: 'Daft Punk',
        },
        meta: {
          pluginId: 'fixture-recording',
          provider: 'local-synthetic-fixture',
          fetchedAt: context.now(),
          sourceUrl: 'https://example.org/fixtures/recording',
        },
      },
    ];
  },
};

// #region parse-classify-plan
import { parseAtom } from '@0xintuition/atom-parser';
import {
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import {
  classificationForIid,
  identifierHintsForIid,
  providersForIid,
} from '@0xintuition/iid-registry';

const rawInput = 'int:mbid:recording:b1a9c0e9-d987-4042-ae91-78d6a3267d69';
// Apply transport byte/count limits before passing external input to parsers.
if (Buffer.byteLength(rawInput, 'utf8') > 4_096)
  throw new Error('Input too large');
const parsed = await parseAtom(rawInput, { remoteFetch: false });
if (parsed.kind !== 'iid' || !parsed.valid || !parsed.canonicalIid) {
  throw new Error('Expected a valid recording IID');
}
const iid = parsed.canonicalIid;
const classification = classificationForIid(iid);
const plan = providersForIid(iid);

const classifier = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
});
const ambiguous = await classifier.classify({
  input: 'One More Time',
  mode: 'client-only',
  classificationSessionId: 'catalog-text',
});
console.log({
  classification,
  plan,
  nameOnly: ambiguous.resolved?.classifications,
});
// #endregion

// #region enrich-fixture
import {
  createEnrichmentEngine,
  type ClassifiedAtomInput,
} from '@0xintuition/atom-enrichment';
import { extractClassificationFields } from '@0xintuition/atom-enrichment/extraction';

// fixtureProvider is the local adapter defined in the full source.
// The registry's plan does not automatically install or execute providers.
const input: ClassifiedAtomInput = {
  atomType: 'song',
  jsonLd: { '@context': 'https://schema.org/', '@type': 'MusicRecording' },
  hints: { identifiers: identifierHintsForIid(iid) },
  source: {
    classificationEngine: 'docs-fixture',
    classifiedAt: '2026-01-01T00:00:00.000Z',
  },
};
const engine = createEnrichmentEngine({
  plugins: [fixtureProvider],
  now: () => '2026-01-01T00:00:00.000Z',
});
const enriched = await engine.enrich({
  runtime: 'server',
  input,
  concurrency: 1,
  timeoutMs: 1_000,
});
const fields = await extractClassificationFields({
  classification: 'music-recording',
  artifacts: enriched.artifacts,
  fetcher: async () => {
    throw new Error('Remote extraction disabled for this fixture');
  },
});
console.log({
  status: enriched.status,
  artifacts: enriched.artifacts,
  errors: enriched.errors,
  skipped: enriched.skipped,
  values: fields.values,
  provenance: fields.fields,
  missingRequired: fields.missingRequired,
});
// #endregion

assert.equal(enriched.errors.length, 0);
assert.equal(enriched.artifacts.length, 1);
assert.equal(enriched.artifacts[0].meta.provider, 'local-synthetic-fixture');
// The pinned extractor does not map this artifact into recording fields.
assert.deepEqual(fields.values, {});
assert.deepEqual(fields.missingRequired, ['name']);
const noMatch = await engine.enrich({
  runtime: 'server',
  input: { ...input, hints: { identifiers: {} } },
});
assert.equal(noMatch.artifacts.length, 0);
assert.ok(noMatch.skipped.length > 0);
console.log('Fixture enrichment: 1 artifact; unmatched input: 0 artifacts');
