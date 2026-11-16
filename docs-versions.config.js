'use strict';

// The documentation generation is independent of individual package versions.
const versions = {
  current: {
    name: 'current',
    label: 'V2',
    docsDir: 'docs/_data',
    routeBase: '/docs',
    llmsDir: 'static',
    llmsIndexSource: 'scripts/llms-index-source.v2.md',
    isDefault: true,
    searchTag: 'docs-_data-current',
    path: '',
    banner: 'none',
    badge: true,
    noIndex: false,
  },
  v1: {
    name: 'v1',
    label: 'V1',
    docsDir: '_data_versioned_docs/version-v1',
    routeBase: '/docs/v1',
    llmsDir: 'static/docs/v1',
    llmsIndexSource: 'scripts/llms-index-source.v1.md',
    isDefault: false,
    searchTag: 'docs-_data-v1',
    sourceCommit: 'a27f3fc807438584c5a425517132e4326481d914',
    path: 'v1',
    banner: 'unmaintained',
    badge: true,
    noIndex: true,
  },
};

function getVersion(name) {
  const key = name === 'v2' ? 'current' : name;
  const version = Object.hasOwn(versions, key) ? versions[key] : undefined;
  if (!version) throw new Error(`Unknown documentation version: ${name}`);
  return version;
}

module.exports = { versions, lastVersion: 'current', includeCurrentVersion: true, getVersion };
