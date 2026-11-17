import assert from 'node:assert/strict';

// #region local-runtime
import {
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import { createProcessingRuntime } from '@0xintuition/atom-runtime';
import { forEachBounded } from '@0xintuition/pipeline-runtime/concurrency';

export async function classifyBatch(labels: string[]) {
  const runtime = createProcessingRuntime({
    config: {
      env: {},
      defaultPreset: 'custom',
      cache: { provider: 'memory', memoryMaxEntries: 100 },
      enrichment: { concurrency: 1, timeoutMs: 1_000 },
    },
    overrides: {
      classification: [createTypeProfilesPlugin(), createPlainTextPlugin()],
      enrichment: { custom: [] },
    },
  });
  try {
    const classifier = runtime.classification.engine();
    const outcomes = await forEachBounded(
      labels,
      async (label, signal) => {
        signal.throwIfAborted();
        if (!label.trim()) throw new Error('Enter a label');
        const result = await classifier.classify({
          input: label,
          mode: 'client-only',
        });
        return result.resolved?.publishable[0]?.type ?? 'unmatched';
      },
      { concurrency: 2 },
    );
    return {
      cache: runtime.cacheProvider,
      sameEngine: classifier === runtime.classification.engine(),
      plugins: runtime.enrichment.engine().listPlugins().length,
      outcomes: outcomes.map((item) =>
        item.kind === 'success' ? item.value : item.kind,
      ),
    };
  } finally {
    runtime.dispose();
  }
}
// #endregion

if (import.meta.main) {
  const result = await classifyBatch(['Catalog note', '', 'Another note']);
  assert.equal(result.cache, 'memory');
  assert.equal(result.sameEngine, true);
  assert.equal(result.plugins, 0);
  assert.equal(result.outcomes[1], 'failure');
  assert.deepEqual((await classifyBatch([])).outcomes, []);
  console.log(result);
}
