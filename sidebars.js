const category = (label, items, docId) => ({
  type: 'category',
  label,
  ...(docId ? { link: { type: 'doc', id: docId } } : {}),
  items,
});
const packages = (names) => names.map((name) => `reference/packages/${name}`);

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    'index',
    category(
      'Get started',
      [
        'get-started/quickstart',
        'get-started/versions',
        'get-started/migrate-from-v1',
      ],
      'get-started/how-it-fits',
    ),
    category('AI agents', ['agents/skills'], 'agents/index'),
    category(
      'Concepts',
      [
        category('Identity', ['concepts/representation-profiles']),
        category('Data flow', ['concepts/protocol-writes']),
      ],
      'concepts/index',
    ),
    category('Build', [
      category('Set up', ['build/install']),
      category('Model data', ['build/creation-profiles']),
      category('Process atoms', ['build/classify-enrich']),
      category('Write on-chain', ['build/action-plans']),
      category('Read the graph', ['build/read-with-sdk', 'build/query-core']),
    ]),
    category('Examples', ['examples/music-catalog'], 'examples/index'),
    category('Reference', [
      category(
        'Packages by layer',
        [
          category(
            'Semantic layer',
            packages(['schema-org', 'classifications', 'predicates']),
          ),
          category(
            'Identity layer',
            packages(['iid-spec', 'iid', 'iid-registry', 'iid-ladder', 'ids']),
          ),
          category('Builder helpers', packages(['primitives'])),
          category('Pipeline runtime', packages(['pipeline-runtime'])),
          category(
            'Atom processing',
            packages([
              'atom-parser',
              'atom-classification',
              'atom-enrichment',
              'atom-runtime',
            ]),
          ),
          category('Application integration', packages(['sdk', 'cli'])),
          category(
            'Protocol plumbing',
            packages([
              'protocol',
              'deployments',
              'periphery',
              'curves',
              'react',
            ]),
          ),
        ],
        'reference/packages/index',
      ),
      category(
        'SDK API reference',
        [
          'reference/sdk/api',
          'reference/sdk/multivault',
          'reference/sdk/dynamic-fee-curve',
          'reference/sdk/fee-proxy',
          'reference/sdk/fee-proxy-builders',
          'reference/sdk/fee-proxy-affiliate-profile',
          'reference/sdk/fee-proxy-claim-refund-if-any',
          'reference/sdk/trust-bonding',
          'reference/sdk/portfolio',
          'reference/sdk/plans-multivault',
          'reference/sdk/plans-base',
          'reference/sdk/plans-dynamic-fee-curve',
          'reference/sdk/plans-fee-proxy',
          'reference/sdk/plans-trust-bonding',
          'reference/sdk/schema-create-agent-action-envelope',
          'reference/sdk/schema-resolve-agent-action-target',
          'reference/sdk/schema-types',
        ],
        'reference/sdk/index',
      ),
      'reference/compatibility',
    ]),
    category('Intuition Core', ['core/classification-plugin']),
    category('Community', [], 'community/index'),
  ],
};
