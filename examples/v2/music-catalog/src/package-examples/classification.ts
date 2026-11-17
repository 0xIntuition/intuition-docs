// #region local-classification
import {
  classifyOutcome,
  createClientEngine,
  createPlainTextPlugin,
  createTypeProfilesPlugin,
} from '@0xintuition/atom-classification';

const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), createPlainTextPlugin()],
  now: () => new Date('2026-01-01T00:00:00.000Z'),
});
export const classified = await engine.classify({
  input: 'A synthetic catalog idea',
  mode: 'client-only',
  classificationSessionId: 'package-reference',
});
console.log(classified.resolved?.publishable[0]?.type);

// Unmatched text remains a candidate Thing, not a verified identity.
export const unmatched = await createClientEngine({ plugins: [] }).classify({
  input: 'Unmatched synthetic catalog label',
  mode: 'client-only',
  classificationSessionId: 'unmatched-fixture',
});
console.log(unmatched.resolved?.fallbackUsed);

export const invalidRequest = await classifyOutcome(engine, {
  input: '',
  mode: 'client-only',
  classificationSessionId: 'invalid-fixture',
});
console.log(invalidRequest.kind);
// #endregion
