import assert from 'node:assert/strict';

// Fail if an example accidentally reaches a remote Fetch transport.
globalThis.fetch = async () => {
  throw new Error('Network disabled in offline verification');
};
await import('./catalog.ts');
await import('./processing.ts');
const { ideaPlugin, result } = await import('./classification-plugin.ts');
const classify = ideaPlugin.classifiers?.[0].classify;
assert.ok(classify);
assert.equal(
  await classify('unrelated text', {
    input: 'unrelated text',
    mode: 'client-only',
    inputIntent: 'generic',
  }),
  null,
);
assert.equal(
  await classify('idea:   ', {
    input: 'idea:   ',
    mode: 'client-only',
    inputIntent: 'generic',
  }),
  null,
);
assert.equal(result.resolved?.publishable?.[0]?.type, 'DefinedTerm');
assert.equal(
  result.resolved?.publishable?.[0]?.data.name,
  'semantic grounding',
);
console.log('Offline catalog, processing, and plugin checks passed');
