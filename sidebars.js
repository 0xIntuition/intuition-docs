module.exports = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Welcome',
      items: [
        'guides/introduction/overview',
        'guides/introduction/index',
        'guides/introduction/why-intuition',
        'guides/introduction/key-terms',
        'guides/introduction/the-economics',
        'guides/introduction/the-primitives',
      ],
    },
    {
      type: 'category',
      label: 'Quick Start',
      items: [
        'guides/quickstart/index',
        'guides/quickstart/speed-run-intuition',
        'guides/quickstart/official-intuition-kits',
        'guides/quickstart/community-built-kits',
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
      label: 'Developer Tools',
      items: [
        'guides/developer-tools/deep-dive',
        {
          type: 'category',
          label: 'Architecture',
          items: [
            'guides/developer-tools/contracts/contract-architecture',
          ],
        },
        {
          type: 'category',
          label: 'Primitives',
          items: [
            {
              type: 'category',
              label: 'Fundamentals',
              items: [
                'guides/developer-tools/deep-dive/primitives/fundamentals/atoms',
                'guides/developer-tools/deep-dive/primitives/fundamentals/triples',
                'guides/developer-tools/deep-dive/primitives/fundamentals/signal',
              ],
            },
            'guides/developer-tools/deep-dive/primitives',
          ],
        },
        {
          type: 'category',
          label: 'Contracts',
          items: [
            'guides/developer-tools/contracts/ethmultivault',
            'guides/developer-tools/contracts/atomwallet',
            'guides/developer-tools/contracts/errors',
            'guides/developer-tools/audit-reports',
          ],
        },
        'guides/developer-tools/graphql-api',
        'guides/developer-tools/sdks',
      ],
    },

    {
      type: 'category',
      label: 'Bonding Curves',
      items: [
        'guides/bonding-curves/index',
      ],
    },

    {
      type: 'category',
      label: 'Intuition Hub',
      items: [
        'guides/hub/index',
        'guides/hub/explorer',
        'guides/hub/bridge',
        'guides/hub/portal',
        'guides/hub/browser-extension',
        'guides/hub/rpc',
        // 'guides/hub/network-health', // Hidden for now - can be uncommented to restore
      ],
    },
    {
      type: 'category',
      label: 'Intuition Node',
      items: [
        'guides/run-node/index',
        'guides/run-node/run-an-intuition-node',
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
      label: 'Contribute',
      items: [
        'guides/contribute/contribution-guidelines',
        'guides/contribute/intuition-call-for-action',
      ],
    },
    {
      type: 'category',
      label: 'Partners',
      items: [
        'guides/partners/index',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'guides/resources/index',
        'guides/resources/faq',
        'guides/resources/community-and-support',
        'guides/resources/utilities',
        'guides/resources/audits',
      ],
    },
  ],
}; 