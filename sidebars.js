module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Welcome',
      items: [
        'introduction/overview',
        'introduction/why-intuition',
        'introduction/the-economics',
        'introduction/the-primitives',
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
    'use-cases/index',
    {
      type: 'category',
      label: 'Developer Tools',
      items: [
        { type: 'doc', id: 'developer-tools/deep-dive/architecture', label: 'Architecture' },
        { type: 'doc', id: 'developer-tools/interactions/overview', label: 'Interactions' },
        {
          type: 'category',
          label: 'Contracts',
          link: { type: 'doc', id: 'developer-tools/contracts/contract-architecture' },
          items: [
            'developer-tools/contracts/ethmultivault',
            'developer-tools/contracts/atomwallet',
            'developer-tools/contracts/errors',
          ],
        },
        { type: 'doc', id: 'developer-tools/sdks/overview', label: 'SDKs' },
        { type: 'doc', id: 'developer-tools/graphql-api/overview', label: 'GraphQL API' },
        { type: 'doc', id: 'developer-tools/audit-reports', label: 'Audit Reports' },
      ],
    },
    {
      type: 'category',
      label: 'Bonding Curves',
      items: [
        'bonding-curves/index',
      ],
    },
    {
      type: 'category',
      label: 'Node',
      items: [
        'run-node/index',
        'run-node/run-an-intuition-node',
        'run-node/intuition-rs'
      ],
    },
    {
      type: 'category',
      label: 'Hub',
      items: [
        'hub/index',
        'hub/bridge',
        'hub/portal',
        'hub/explorer',
        'hub/rpc',
        'hub/browser-extension',
      ],
    },
    {
      type: 'category',
      label: 'AI',
      items: ['intuition-ai/index'],
    },
    {
      type: 'category',
      label: 'Contribute',
      items: [
        'contribute/contribution-guidelines',
        'contribute/intuition-call-for-action',
      ],
    },
    {
      type: 'category',
      label: 'Partners',
      items: [
        'partners/index',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/index',
        'resources/key-terms',
        'resources/faq',
        'resources/network-health',
        'resources/community-and-support',
        'resources/utilities',
        'resources/audits',
      ],
    },
  ],
}; 
