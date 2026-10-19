'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const {
  cleanContent,
  parseSections,
  serializeMdxComponents,
} = require('./generate-llms-full');

test('serializes tab labels and preserves fenced code blocks', () => {
  const input = [
    '## Installation',
    '',
    '<Tabs>',
    '<TabItem value="npm" label="npm" default>',
    '',
    '```bash',
    'npm install package',
    '```',
    '',
    '</TabItem>',
    '<TabItem value="pnpm" label="pnpm">',
    '',
    '```bash',
    'pnpm add package',
    '```',
    '',
    '</TabItem>',
    '</Tabs>',
  ].join('\n');

  const output = cleanContent(input, 'Example');

  assert.match(output, /^### npm$/m);
  assert.match(output, /^### pnpm$/m);
  assert.match(output, /npm install package/);
  assert.match(output, /pnpm add package/);
  assert.doesNotMatch(output, /<\/?(?:Tabs|TabItem)\b/);
});

test('unwraps fragments and unknown containers without losing their children', () => {
  const input = [
    '<>',
    'Fragment content',
    '</>',
    '<Callout>',
    'Important content',
    '</Callout>',
    '<DecorativeWidget />',
  ].join('\n');

  const output = serializeMdxComponents(input);

  assert.match(output, /Fragment content/);
  assert.match(output, /Important content/);
  assert.doesNotMatch(output, /<\/?(?:Fragment|Callout)\b|<DecorativeWidget/);
});

test('drops BrowserOnly executable diagram blocks', () => {
  const input = [
    'Before diagram',
    '<BrowserOnly fallback={<p>Loading diagram...</p>}>',
    '  {() => <ExcalidrawViewer src="/diagram.json" />}',
    '</BrowserOnly>',
    'After diagram',
  ].join('\n');

  const output = serializeMdxComponents(input);

  assert.equal(output, 'Before diagram\n\nAfter diagram');
});

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tabItemLabels(source) {
  return [...source.matchAll(/<TabItem\b([^>]*)>/g)]
    .map((match) => {
      const attributes = match[1];
      const label =
        attributes.match(/\blabel\s*=\s*(?:"([^"]*)"|'([^']*)')/) ||
        attributes.match(/\bvalue\s*=\s*(?:"([^"]*)"|'([^']*)')/);
      return label ? (label[1] ?? label[2]) : null;
    })
    .filter(Boolean);
}

test('serializes every TabItem from the docs sources into a heading', () => {
  const sections = parseSections();

  assert.ok(sections.length > 0, 'Expected generated sections');

  let checkedTabItems = 0;

  for (const section of sections) {
    assert.doesNotMatch(
      section.contentFull,
      /<\/?(?:Tabs|TabItem)\b/,
      `Expected ${section.route} to drop Tabs/TabItem tags`,
    );

    const source = fs.readFileSync(section.sourceFile, 'utf-8');

    for (const label of tabItemLabels(source)) {
      checkedTabItems += 1;
      assert.match(
        section.contentFull,
        new RegExp(`^#{1,6} ${escapeRegExp(label)}$`, 'm'),
        `Expected ${section.route} to turn TabItem "${label}" into a heading`,
      );
    }
  }

  assert.ok(
    checkedTabItems > 0,
    'Expected the docs sources to contain at least one TabItem',
  );
});
