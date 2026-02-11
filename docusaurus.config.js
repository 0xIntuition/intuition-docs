const { themes } = require('prism-react-renderer');

const code_themes = {
  light: themes.github,
  dark: themes.dracula,
};

/** @type {import('@docusaurus/types').Config} */
const meta = {
  title: 'Intuition Docs',
  tagline:
    'Explore comprehensive documentation for Intuition, including guides, references, and best practices.',
  url: 'https://docs.intuition.systems',
  baseUrl: '/',
  favicon: '/img/intuitionLogoGithub.png',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  onBrokenLinks: 'warn',
};

/** @type {import('@docusaurus/plugin-content-docs').Options} */
const defaultSettings = {
  breadcrumbs: true,
  editUrl: 'https://github.com/0xIntuition/intuition-docs/tree/main/',
  showLastUpdateTime: false,
  sidebarCollapsible: true,
  remarkPlugins: [
    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
  ],
  sidebarPath: require.resolve('./sidebars.js'),
};

/** @type {import('@docusaurus/plugin-content-docs').Options[]} */
const docs = [];

/**
 * Create a section
 * @param {import('@docusaurus/plugin-content-docs').Options} options
 */
function create_doc_plugin({
  sidebarPath = require.resolve('./sidebars.js'),
  ...options
}) {
  return [
    '@docusaurus/plugin-content-docs',
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      ...defaultSettings,
      sidebarPath,
      ...options,
    }),
  ];
}

const { webpackPlugin } = require('./plugins/webpack-plugin.cjs');
const tailwindPlugin = require('./plugins/tailwind-plugin.cjs');
const docs_plugins = docs.map((doc) => create_doc_plugin(doc));

const plugins = [
  tailwindPlugin,
  ...docs_plugins,
  webpackPlugin,
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects: [
        // ===== GETTING STARTED REDIRECTS =====
        // Only include redirects for pages that exist
        {
          from: '/docs/introduction/overview',
          to: '/docs',
        },
        {
          from: '/docs/introduction/why-intuition',
          to: '/docs/getting-started/why-intuition',
        },
        // Quickstart page doesn't exist yet
        /*
        {
          from: '/docs/quickstart/getting-started',
          to: '/docs/getting-started/quickstart',
        },
        */
        {
          from: '/docs/quickstart/intuition-kits',
          to: '/docs/getting-started/intuition-kits',
        },

        // Commented out redirects to pages that don't exist yet (will be added in future weeks)
        /*
        // ===== ECONOMICS REDIRECTS =====
        {
          from: '/docs/introduction/the-economics',
          to: '/docs/concepts/economics/overview',
        },
        {
          from: '/docs/introduction/the-economics/the-economics',
          to: '/docs/concepts/economics/overview',
        },
        {
          from: '/docs/economics/overview',
          to: '/docs/concepts/economics/tokenomics',
        },
        {
          from: '/docs/core-concepts/economics/bonding-curves',
          to: '/docs/concepts/economics/bonding-curves',
        },
        {
          from: '/docs/core-concepts/economics/fees-rewards',
          to: '/docs/concepts/economics/fees-and-rewards',
        },
        {
          from: '/docs/developer-tools/protocol/core-concepts/bonding-curves',
          to: '/docs/concepts/economics/bonding-curves',
        },

        // ===== PRIMITIVES REDIRECTS =====
        {
          from: '/docs/core-concepts/primitives/:path*',
          to: '/docs/concepts/primitives/:path*',
        },
        {
          from: '/docs/developer-tools/protocol/core-concepts/atoms',
          to: '/docs/developer-tools/protocol/working-with-primitives',
        },
        {
          from: '/docs/developer-tools/protocol/core-concepts/triples',
          to: '/docs/developer-tools/protocol/working-with-primitives',
        },

        // ===== TUTORIALS REDIRECTS =====
        {
          from: '/docs/use-cases',
          to: '/docs/tutorials/overview',
        },
        {
          from: '/docs/use-cases/use-cases',
          to: '/docs/tutorials/overview',
        },
        {
          from: '/docs/developer-tools/graphql-api/use-cases/overview',
          to: '/docs/tutorials/queries/overview',
        },
        {
          from: '/docs/developer-tools/graphql-api/use-cases/finding-top-dapps-on-coinbase',
          to: '/docs/tutorials/queries/top-dapps',
        },
        {
          from: '/docs/developer-tools/graphql-api/use-cases/discovering-most-trusted-accounts',
          to: '/docs/tutorials/queries/trusted-accounts',
        },
        {
          from: '/docs/developer-tools/graphql-api/use-cases/building-user-activity-feeds',
          to: '/docs/tutorials/queries/activity-feeds',
        },
        {
          from: '/docs/developer-tools/graphql-api/use-cases/finding-related-claims',
          to: '/docs/tutorials/queries/related-claims',
        },

        // ===== SDK REDIRECTS =====
        {
          from: '/docs/developer-tools/sdk/atoms/create-from-string',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/create-from-thing',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/create-from-ethereum-account',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/create-from-smart-contract',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/create-from-ipfs',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/batch-creation',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/atoms/querying',
          to: '/docs/developer-tools/sdk/atoms-guide',
        },
        {
          from: '/docs/developer-tools/sdk/triples/:path',
          to: '/docs/developer-tools/sdk/triples-guide',
        },
        {
          from: '/docs/developer-tools/sdk/vaults/:path',
          to: '/docs/developer-tools/sdk/vaults-guide',
        },
        {
          from: '/docs/developer-tools/sdk/search/:path',
          to: '/docs/developer-tools/sdk/search-guide',
        },

        // ===== RESOURCES REDIRECTS =====
        {
          from: '/docs/resources/key-terms',
          to: '/docs/resources/glossary',
        },
        */

        // ===== NETWORK REDIRECTS =====
        // Redirect from old /docs/network/node/* paths to new /docs/intuition-node/* paths
        {
          from: '/docs/network/node/overview',
          to: '/docs/intuition-node/overview',
        },
        {
          from: '/docs/network/node/rust-backend',
          to: '/docs/intuition-node/rust-backend',
        },
        {
          from: '/docs/network/node/local-setup',
          to: '/docs/intuition-node/local-setup',
        },
        {
          from: '/docs/network/node/kubernetes',
          to: '/docs/intuition-node/kubernetes',
        },

        // ===== INTEGRATIONS REDIRECTS =====
        // Redirect old paths to experimental-applications/mcp-server which exists
        {
          from: '/docs/intuition-ai/index',
          to: '/docs/experimental-applications/mcp-server',
        },
        {
          from: '/docs/intuition-ai/mcp-server',
          to: '/docs/experimental-applications/mcp-server',
        },
        {
          from: '/docs/integrations/ai/overview',
          to: '/docs/experimental-applications/mcp-server',
        },
        {
          from: '/docs/integrations/ai/mcp-server',
          to: '/docs/experimental-applications/mcp-server',
        },
      ],
      createRedirects: (path) => {
        if (path.startsWith('/docs/capabilities/chat/export-chat-dump')) {
          return ['/capabilities/export-chat-dump'];
        }

        if (path.startsWith('/docs/capabilities/misc/embed')) {
          return ['/docs/capabilities/embed'];
        }
        return undefined; // Return a falsy value: no redirect created
      },
    },
  ],
];

const fs = require('fs');
const sdksHTML = fs.readFileSync('./src/snippets/sdks.html', 'utf-8');
const resourcesHTML = fs.readFileSync('./src/snippets/resources.html', 'utf-8');

/** @type {import('@docusaurus/types').Config} */
const config = {
  ...meta,
  plugins,
  future: {
    experimental_faster: true,
    v4: true,
  },

  trailingSlash: false,
  themes: ['@docusaurus/theme-live-codeblock', '@docusaurus/theme-mermaid'],
  clientModules: [
    require.resolve('./src/client/set-framework.js'),
  ],
  scripts: [{ src: 'https://cdn.statuspage.io/se-v2.js', async: true }],
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs/_data',
          id: '_data',
          routeBasePath: '/docs',
          ...defaultSettings,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/api-reference.css'),
          ],
        },
        sitemap: {
          ignorePatterns: ['**/tags/**', '/api/*'],
        },
        googleTagManager: {
          containerId: 'GTM-5FDFFSS',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Intuition Documentation',
          height: '40px',
          width: '101px',
        },
        hideOnScroll: false,
        items: [
          {
            label: 'Documentation',
            to: 'docs',
            className: 'guides-top-header',
            position: 'left',
          },
          {
            label: 'Status',
            href: 'https://stats.intuition.sh/',
            position: 'left',
          },
          {
            label: 'Protocol Explorer',
            href: 'https://portal.intuition.systems',
            position: 'right',
          },
          {
            label: 'Network Hub',
            href: 'https://testnet.hub.intuition.systems/',
            position: 'right',
          },
          {
            label: 'Website',
            href: 'https://intuition.systems',
            position: 'right',
          },
          {
            label: 'GitHub',
            href: 'https://github.com/0xIntuition',
            position: 'right',
          },
          {
            label: 'Forum',
            href: 'https://atlas.discourse.group',
            position: 'right',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Intuition Documentation',
          height: '36px',
        },
        copyright: 'Copyright © Intuition Systems Inc. since 2023. All rights reserved.',
      },
      prism: {
        theme: code_themes.light,
        darkTheme: code_themes.dark,
        additionalLanguages: [
          'dart',
          'ruby',
          'groovy',
          'kotlin',
          'java',
          'swift',
          'objectivec',
          'json',
          'bash',
          'solidity',
          'typescript',
          'javascript',
          'cpp',
        ],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-error-line',
            line: 'highlight-next-line-error',
          },
        ],
      },
      algolia: {
        appId: '02BM8VR1N5',
        apiKey: 'a57ea0ddc696d1891962958f22cc7525',
        indexName: 'Intuition Docs',
        contextualSearch: true,
        searchParameters: {},
      },
    }),


};

module.exports = config;
