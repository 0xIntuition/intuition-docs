// #region shared-runtime
import {
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';
import { createProcessingRuntime } from '@0xintuition/atom-runtime';

export const runtime = createProcessingRuntime({
  config: { env: {}, cache: { provider: 'memory', memoryMaxEntries: 100 } },
  runtime: { now: () => '2026-01-01T00:00:00.000Z' },
  overrides: {
    classification: [createTypeProfilesPlugin(), createPlainTextPlugin()],
    enrichment: { default: [] },
  },
});
try {
  const engine = runtime.classification.engine();
  const result = await engine.classify({
    input: 'A synthetic catalog idea',
    mode: 'client-only',
    classificationSessionId: 'runtime-reference',
  });
  console.log(engine === runtime.classification.engine());
  console.log(result.resolved?.publishable[0]?.type);
  console.log(runtime.cacheProvider, runtime.warnings);
} finally {
  runtime.dispose();
}
// #endregion
