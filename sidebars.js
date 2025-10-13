module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Welcome',
      items: [
        'introduction/overview',
        'introduction/why-intuition',
        'introduction/the-economics/the-economics',
        'developer-tools/deep-dive/architecture',
      ],
    },
    {
      type: 'category',
      label: 'Primitives',
      items: [
        'primitives/overview',
        'primitives/atoms',
        'primitives/triples',
        'primitives/signals',
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
