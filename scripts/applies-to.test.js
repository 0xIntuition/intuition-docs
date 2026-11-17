'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const manifest = require('../static/intuition-release.json');
const { parseHtml, nodes, visibleText } = require('./validate-built-docs');

function loadComponent(packages) {
  const file = path.resolve(__dirname, '../src/components/AppliesTo.tsx');
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
    fileName: file,
  }).outputText;
  const module = { exports: {} };
  const localRequire = (name) => {
    if (name === '@docusaurus/plugin-content-docs/client')
      return { useDoc: () => ({ frontMatter: { packages } }) };
    if (name === '@site/static/intuition-release.json') return manifest;
    if (name === './AppliesTo.module.css')
      return { appliesTo: 'appliesTo', package: 'package', version: 'version' };
    return require(name);
  };
  new Function('require', 'module', 'exports', compiled)(
    localRequire,
    module,
    module.exports,
  );
  return module.exports;
}

test('AppliesTo reads document package metadata and exact stable manifest versions', () => {
  const packages = ['@0xintuition/iid', '@0xintuition/sdk'];
  const Component = loadComponent(packages).default;
  const html = renderToStaticMarkup(React.createElement(Component));
  const tree = parseHtml(html);
  assert.equal(
    visibleText(tree),
    'Applies to V2 · @0xintuition/iid 0.1.0 · @0xintuition/sdk 4.0.0',
  );
  assert.equal(
    nodes(tree, (node) => node.attrs?.['data-applies-to'] === 'V2').length,
    1,
  );
  assert.doesNotMatch(html, /pre-release|tabindex|aria-hidden/);
});

test('AppliesTo handles absent/empty metadata and alpha status without hiding packages', () => {
  for (const packages of [undefined, []]) {
    const Component = loadComponent(packages).default;
    assert.equal(renderToStaticMarkup(React.createElement(Component)), '');
  }
  const { AppliesToLine } = loadComponent([]);
  const packages = manifest.packages.map((pkg) => pkg.name);
  const html = renderToStaticMarkup(
    React.createElement(AppliesToLine, {
      packages,
      release: { ...manifest, status: 'published-alpha' },
    }),
  );
  assert.equal(
    visibleText(parseHtml(html)),
    `Applies to V2${manifest.packages.map((pkg) => ` · ${pkg.name} ${pkg.version}`).join('')} · pre-release`,
  );
  assert.equal(
    nodes(parseHtml(html), (node) => node.tag === 'code').length,
    21,
  );
  assert.throws(
    () =>
      renderToStaticMarkup(
        React.createElement(AppliesToLine, {
          packages: ['@0xintuition/missing'],
          release: manifest,
        }),
      ),
    /Unknown AppliesTo package/,
  );
});
