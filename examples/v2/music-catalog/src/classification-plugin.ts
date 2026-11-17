// #region classification-plugin
import {
  createClientEngine,
  createTypeProfilesPlugin,
  validatePluginManifest,
  type AtomClassificationPlugin,
} from '@0xintuition/atom-classification';

export const ideaPlugin: AtomClassificationPlugin = {
  manifest: {
    id: 'example-idea',
    version: '1.0.0',
    engineRange: '^0.1.0',
    runtime: 'universal',
    priority: 30,
    capabilities: ['classifier:text:idea', 'resolver:lexical:defined-term'],
    permissions: [],
    dependsOn: ['type-profiles'],
    provides: ['example:idea'],
  },
  classifiers: [
    {
      id: 'idea-classifier',
      classify(input) {
        const name = input.startsWith('idea:') ? input.slice(5).trim() : '';
        return name
          ? {
              type: 'text',
              domain: 'lexical',
              subtype: 'idea',
              confidence: 1,
              meta: { name },
            }
          : null;
      },
    },
  ],
  resolvers: [
    {
      id: 'idea-resolver',
      executionMode: 'deterministic',
      canResolve: (classification) =>
        classification.domain === 'lexical' &&
        classification.subtype === 'idea',
      resolve: ({ request }) => ({
        classifications: [
          {
            type: 'DefinedTerm',
            data: {
              '@context': 'https://schema.org/',
              '@type': 'DefinedTerm',
              name: request.input.slice(5).trim(),
            },
          },
        ],
      }),
    },
  ],
};
validatePluginManifest(ideaPlugin.manifest);
const engine = createClientEngine({
  plugins: [createTypeProfilesPlugin(), ideaPlugin],
});
const input = 'idea: semantic grounding';
if (Buffer.byteLength(input, 'utf8') > 4_096)
  throw new Error('Input too large');
export const result = await engine.classify({
  input,
  mode: 'client-only',
  classificationSessionId: 'docs-plugin',
});
console.log(result.resolved?.publishable);
// #endregion
