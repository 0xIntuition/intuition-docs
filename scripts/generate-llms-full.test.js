'use strict';

const assert = require('node:assert/strict');
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

test('preserves every tabbed command from the current documentation pages', () => {
  const sectionsByRoute = new Map(
    parseSections().map((section) => [section.route, section.contentFull])
  );

  const expectedCommands = {
    '/docs/quick-start/using-the-sdk': [
      'npm install @0xintuition/sdk@latest',
      'pnpm add @0xintuition/sdk@latest',
      'yarn add @0xintuition/sdk@latest',
      'bun add @0xintuition/sdk@latest',
      'npm install @0xintuition/sdk@latest viem@latest',
      'pnpm add @0xintuition/sdk@latest viem@latest',
      'yarn add @0xintuition/sdk@latest viem@latest',
      'bun add @0xintuition/sdk@latest viem@latest',
      'npm install @0xintuition/protocol@latest @0xintuition/graphql@latest',
      'pnpm add @0xintuition/protocol@latest @0xintuition/graphql@latest',
      'yarn add @0xintuition/protocol@latest @0xintuition/graphql@latest',
      'bun add @0xintuition/protocol@latest @0xintuition/graphql@latest',
    ],
    '/docs/graphql-api/npm-package': [
      'npm install @0xintuition/graphql',
      'pnpm install @0xintuition/graphql',
      'yarn add @0xintuition/graphql',
      'bun install @0xintuition/graphql',
    ],
    '/docs/protocol/getting-started/overview': [
      'npm install viem @0xintuition/protocol',
      'pnpm install viem @0xintuition/protocol',
      'yarn add viem @0xintuition/protocol',
      'bun install viem @0xintuition/protocol',
    ],
    '/docs/intuition-sdk/installation-and-setup': [
      'npm install @0xintuition/sdk viem@^2.0.0',
      'pnpm add @0xintuition/sdk viem@^2.0.0',
      'bun add @0xintuition/sdk viem@^2.0.0',
      'npm link @0xintuition/sdk',
      'pnpm link --global @0xintuition/sdk',
      'bun link @0xintuition/sdk',
    ],
  };

  for (const [route, commands] of Object.entries(expectedCommands)) {
    const content = sectionsByRoute.get(route);
    assert.ok(content, `Expected generated section for ${route}`);

    for (const command of commands) {
      assert.ok(
        content.includes(command),
        `Expected ${route} to preserve: ${command}`
      );
    }

    assert.doesNotMatch(content, /<\/?(?:Tabs|TabItem)\b/);
  }
});
