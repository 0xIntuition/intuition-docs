const { themes } = require('prism-react-renderer');
const { versions, lastVersion, includeCurrentVersion } = require('./docs-versions.config');
const { redirects, createRedirects } = require('./redirects.config');

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
  onBrokenLinks: 'throw',
};

/** @type {import('@docusaurus/plugin-content-docs').Options} */
const defaultSettings = {
  breadcrumbs: true,
  editUrl: ({ version, versionDocsDirPath, docPath }) => version === versions.v1.name
    ? undefined
    : `https://github.com/0xIntuition/intuition-docs/tree/main/${versionDocsDirPath}/${docPath}`,
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
  require.resolve('./plugins/markdown-export-plugin.cjs'),
  tailwindPlugin,
  ...docs_plugins,
  webpackPlugin,
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects,
      createRedirects,
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
    hooks: { onBrokenMarkdownLinks: 'throw' },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: versions.current.docsDir,
          id: '_data',
          routeBasePath: versions.current.routeBase,
          ...defaultSettings,
          lastVersion,
          includeCurrentVersion,
          versions: Object.fromEntries(Object.values(versions).map(
            ({ name, label, path, banner, badge, noIndex }) =>
              [name, { label, path, banner, badge, noIndex }],
          )),
          ...(process.env.NODE_ENV === 'development' && process.env.DOCS_VERSIONS
            ? { onlyIncludeVersions: process.env.DOCS_VERSIONS.split(',').map((name) => name.trim()).filter(Boolean) }
            : {}),
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/api-reference.css'),
          ],
        },
        sitemap: {
          ignorePatterns: ['**/tags/**', '/api/*', `${versions.v1.routeBase}/**`],
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
            type: 'custom-versionSwitcher',
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
