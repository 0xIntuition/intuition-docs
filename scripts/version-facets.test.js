'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ac20 = require('./__fixtures__/version-facets/ac20.json');

test('AC-20 replaces the V1 tag while preserving the exact nested filter shape', async () => {
  const { versionFacetFilters } = await import(
    '../src/theme/SearchBar/versionFacets.mjs'
  );
  const input = structuredClone(ac20.input);
  assert.deepEqual(versionFacetFilters(input), ac20.expected);
  assert.deepEqual(input, ac20.input, 'must not mutate caller-owned filters');
});

test('nested OR groups and every non-V1 filter stay unchanged', async () => {
  const { versionFacetFilters } = await import(
    '../src/theme/SearchBar/versionFacets.mjs'
  );
  const input = [
    'language:en',
    ['version:v1', ['docusaurus_tag:docs-_data-v1']],
    'docusaurus_tag:docs-other-v1',
    'docusaurus_tag:docs-_data-v10',
    '-docusaurus_tag:docs-_data-v1',
    'docusaurus_tag:docs-_data-current',
  ];
  const expected = structuredClone(input);
  expected[1][1][0] = 'docusaurus_tag:docs-_data-current';
  assert.deepEqual(versionFacetFilters(input), expected);
  for (const unchanged of [undefined, null, '', [], 'language:en']) {
    assert.deepEqual(versionFacetFilters(unchanged), unchanged);
  }
  assert.equal(
    versionFacetFilters('docusaurus_tag:docs-_data-v1'),
    'docusaurus_tag:docs-_data-current',
  );
});

test('SearchBar applies the pure filter and labels only V1 search while retaining ChefAI', async () => {
  const { versionFacetFilters } = await import(
    '../src/theme/SearchBar/versionFacets.mjs'
  );
  const source = fs.readFileSync(
    path.join(__dirname, '../src/theme/SearchBar/index.jsx'),
    'utf8',
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  });
  for (const version of ['v1', 'current', undefined]) {
    for (const contextualSearch of [true, false]) {
      let passedFilters;
      const filters = [
        'language:en',
        ['docusaurus_tag:docs-_data-v1', 'docusaurus_tag:default'],
      ];
      const mocks = {
        react: React,
        'react-dom': { createPortal: () => null },
        '@docsearch/react': {
          DocSearchButton: ({ translations }) =>
            React.createElement(
              'button',
              { 'aria-label': translations.buttonAriaLabel },
              translations.buttonText,
            ),
          useDocSearchKeyboardEvents: () => {},
        },
        '@docusaurus/ExecutionEnvironment': { canUseDOM: false },
        '@docusaurus/Head': ({ children }) =>
          React.createElement(React.Fragment, null, children),
        '@docusaurus/Link': () => null,
        '@docusaurus/router': { useHistory: () => ({ push() {} }) },
        '@docusaurus/plugin-content-docs/client': {
          useActiveDocContext: () => ({
            activeVersion: version ? { name: version } : undefined,
          }),
        },
        '@docusaurus/theme-common': {
          isRegexpStringMatch: () => false,
          useSearchLinkCreator: () => () => '',
        },
        '@docusaurus/theme-search-algolia/client': {
          useAlgoliaContextualFacetFilters: () => filters,
          useSearchResultUrlProcessor: () => (url) => url,
        },
        '@docusaurus/Translate': () => null,
        '@docusaurus/useDocusaurusContext': () => ({
          siteMetadata: { docusaurusVersion: '3.9.2' },
          siteConfig: {
            themeConfig: {
              algolia: {
                appId: 'fixture',
                contextualSearch,
                searchParameters: { facetFilters: ['version:v1'] },
              },
            },
          },
        }),
        '@theme/SearchTranslations': {
          button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
        },
        '../../components/ChefAI': {
          ChefAI: () => React.createElement('div', { 'data-chef-ai': true }),
        },
        './versionFacets.mjs': {
          versionFacetFilters: (input) => {
            passedFilters = versionFacetFilters(input);
            return passedFilters;
          },
        },
      };
      const result = {};
      new Function('exports', 'require', outputText)(result, (id) => {
        if (Object.hasOwn(mocks, id)) return mocks[id];
        throw new Error(`Unexpected runtime import: ${id}`);
      });
      const html = renderToStaticMarkup(React.createElement(result.default));
      const label = version === 'v1' ? 'Search V2 docs' : 'Search';
      assert.ok(
        html.includes(`<button aria-label="${label}">${label}</button>`),
      );
      assert.match(html, /data-chef-ai="true"/);
      assert.deepEqual(
        passedFilters,
        contextualSearch
          ? [
              'language:en',
              ['docusaurus_tag:docs-_data-current', 'docusaurus_tag:default'],
              'version:v1',
            ]
          : ['version:v1'],
      );
    }
  }
});
