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
        'quickstart/index',
        'quickstart/speed-run-intuition',
        'quickstart/official-intuition-kits',
        'quickstart/community-built-kits',
      ],
    },
    {
      type: 'category',
      label: 'SDK',
      items: [
        'developer-tools/sdks/overview',
        'developer-tools/sdks/boilerplate-project',
        'developer-tools/sdks/migration-guide',
      ],
    },
    {
      type: 'category',
      label: 'GraphQL API',
      items: [
        'developer-tools/graphql-api/overview',
        'developer-tools/graphql-api/reads',
        'developer-tools/graphql-api/writes',
        'developer-tools/graphql-api/query-examples',
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
        'economics/bonding-curves',
        'economics/write-monetization',
        'economics/read-monetization',
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
        'partners/index',
        'contribute/contribution-guidelines',
      ],
    },
    'use-cases/use-cases',
  ],
};
