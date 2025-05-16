module.exports = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Quickstart',
      items: ['guides/quickstart/index'],
    },
    {
      type: 'category',
      label: 'Overview',
      items: [
        'guides/overview/index',
        'guides/overview/the-problem',
        'guides/overview/why-intuition',
      ],
    },
    {
      type: 'category',
      label: 'SDKs',
      items: [
        'guides/sdks/index',
        'guides/sdks/protocol',
        'guides/sdks/graphql',
        'guides/sdks/1ui',
      ],
    },
    {
      type: 'category',
      label: 'GraphQL API',
      items: ['graphql/index'],
    },
    {
      type: 'category',
      label: 'Templates',
      items: ['guides/templates/index'],
    },
    {
      type: 'category',
      label: 'Run an Intuition Node',
      items: [
        'guides/run-node/index',
        'guides/run-node/intuition-rs'
      ],
    },
    {
      type: 'category',
      label: 'Intuition AI',
      items: ['guides/intuition-ai/index'],
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      items: [
        'guides/smart-contracts/index',
        'guides/smart-contracts/attestor',
        'guides/smart-contracts/atom-warden',
        'guides/smart-contracts/trust-bonding',
        'guides/smart-contracts/trust-multi-vault',
        'guides/smart-contracts/bonding-curve-registry',
        'guides/smart-contracts/eth-multi-vault'
      ],
    },
    {
      type: 'separator',
    },
    {
      type: 'category',
      label: 'Using the Primitives',
      items: [
        'guides/primitives/atoms',
        'guides/primitives/triples',
        'guides/primitives/signals',
        'guides/primitives/bonding-curves'
      ],
    },
    {
      type: 'category',
      label: 'Use Cases',
      items: [
        'guides/use-cases/index',
        'guides/use-cases/decentralized-stack-overflow',
        'guides/use-cases/decentralized-social-media'
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'guides/architecture/index',
        'guides/architecture/frontend',
        {
          type: 'link',
          label: 'Back-End',
          href: 'https://deepwiki.com/0xIntuition/intuition-rs',
          customProps: {
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        },
        'guides/architecture/smart-contracts',
      ],
      sidebar_position: 999,
    },
  ],
}; 