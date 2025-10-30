module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Introduction',
      items: [
        'introduction/overview',
        'introduction/why-intuition',
        'introduction/the-economics/the-economics',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'developer-tools/deep-dive/architecture/overview',
        'developer-tools/deep-dive/architecture/network',
        'developer-tools/deep-dive/architecture/protocol',
        'developer-tools/deep-dive/architecture/subnet',
        'developer-tools/deep-dive/architecture/data-flow',
        'developer-tools/deep-dive/architecture/performance',
        'developer-tools/deep-dive/architecture/development-patterns',
        'developer-tools/deep-dive/architecture/deployment',
      ],
    },
    {
      type: 'category',
      label: 'Primitives',
      items: [
        'primitives/overview',
        {
          type: 'category',
          label: 'Atoms',
          items: [
            'primitives/atoms/overview',
            'primitives/atoms/problem-atoms-solve',
            'primitives/atoms/design-principles',
            'primitives/atoms/best-practices',
            'primitives/atoms/practical-examples',
          ],
        },
        {
          type: 'category',
          label: 'Triples',
          items: [
            'primitives/triples/overview',
            'primitives/triples/core-benefits',
            'primitives/triples/querying-triples',
            {
              type: 'category',
              label: 'Create Triples',
              items: [
                'primitives/triples/how-to-create',
              ],
            },
            'primitives/triples/positive-negative-claims',
            'primitives/triples/use-cases',
            {
              type: 'category',
              label: 'Nested Triples',
              items: [
                {
                  type: 'category',
                  label: 'Overview',
                  link: {
                    type: 'doc',
                    id: 'primitives/triples/nested-triples',
                  },
                  items: [],
                },
                'primitives/triples/nested-triples-practical-implementation',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Signals',
          items: [
            'primitives/signals/overview',
            'primitives/signals/strategies-best-practices',
            'primitives/signals/practical-implementation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Quick Start',
      items: [
        'quickstart/getting-started',
        'quickstart/intuition-kits',
      ],
    },
    {
      type: 'category',
      label: 'SDK',
      items: [
        'developer-tools/sdks/overview',
        'developer-tools/sdks/migration-guide',
      ],
    },
    {
      type: 'category',
      label: 'GraphQL API',
      items: [
        'developer-tools/graphql-api/overview',
        'developer-tools/graphql-api/npm-package',
        'developer-tools/graphql-api/custom-queries',
        'developer-tools/graphql-api/reads',
        'developer-tools/graphql-api/writes',
        {
          type: 'category',
          label: 'Use Cases',
          items: [
            'developer-tools/graphql-api/use-cases/overview',
            'developer-tools/graphql-api/use-cases/finding-top-dapps-on-coinbase',
            'developer-tools/graphql-api/use-cases/discovering-most-trusted-accounts',
            'developer-tools/graphql-api/use-cases/building-user-activity-feeds',
            'developer-tools/graphql-api/use-cases/finding-related-claims',
          ],
        },
        'developer-tools/graphql-api/migration-guide',
      ],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'developer-tools/contracts/contract-architecture',
        'developer-tools/contracts/multivault',
        'developer-tools/contracts/trust-bonding',
        'developer-tools/contracts/deployments',
        'developer-tools/deep-dive/smart-contract/security',
        {
          type: 'link',
          label: 'Deep Dive',
          href: 'https://deepwiki.com/0xIntuition/intuition-contracts-v2/',
        },
      ],
    },
    {
      type: 'category',
      label: 'Economics',
      items: [
        'economics/overview',
      ],
    },
    {
      type: 'category',
      label: 'Rust Backend',
      items: [
        'run-node/run-an-intuition-node',
      ],
    },
    {
      type: 'category',
      label: 'Intuition Network',
      items: [
        'network/network',
        'network/testnet/bridge',
        'network/testnet/portal',
        'network/testnet/explorer',
      ],
    },
    {
      type: 'category',
      label: 'AI',
      items: ['intuition-ai/index', 'intuition-ai/mcp-server'],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/index',
        'resources/community-and-support',
        'developer-tools/audit-reports',
        'contribute/contribution-guidelines',
      ],
    },
    'use-cases/use-cases',
  ],
};
