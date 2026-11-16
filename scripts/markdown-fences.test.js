'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  createProcessorUncached,
} = require('@docusaurus/mdx-loader/lib/processor');
const {
  DEFAULT_MARKDOWN_CONFIG,
} = require('@docusaurus/core/lib/server/configValidation');
const {
  extractExamplesFromSource,
  typecheckExamples,
} = require('./validate-sdk-examples');
const { validateDocs, loadLaunchRoutes } = require('./validate-v2-structure');
const { docMetadata } = require('./lib/docs-tree');
const { versions } = require('../docs-versions.config');
const site = require('../docusaurus.config');

const ROOT = path.resolve(__dirname, '..');
const skip = '<!-- docs-typecheck: skip -->';
const fixture = fs.readFileSync(
  path.join(__dirname, '__fixtures__/markdown-fences/containers.mdx'),
  'utf8',
);
const file = `${versions.current.docsDir}/index.mdx`;
const rows = loadLaunchRoutes(
  fs.readFileSync(path.join(__dirname, 'v2-launch-routes.txt'), 'utf8'),
);
const home = fs.readFileSync(
  path.join(ROOT, versions.current.docsDir, 'index.md'),
  'utf8',
);
const extract = (source) =>
  extractExamplesFromSource(file, source, skip, { version: 'v2' });
const structure = (source) =>
  validateDocs(
    [docMetadata('index.md', `${home}\n${source}`, versions.current)],
    {
      launchRows: rows,
    },
  );

// This oracle uses the installed site's complete MDX processor, independently
// of our scanner, and captures nodes before Docusaurus turns code into JSX.
async function siteCodeNodes(source, format = 'mdx') {
  const nodes = [];
  const processor = await createProcessorUncached({
    format,
    options: {
      ...site.presets[0][1].docs,
      markdownConfig: {
        ...DEFAULT_MARKDOWN_CONFIG,
        ...site.markdown,
        mdx1Compat: {
          ...DEFAULT_MARKDOWN_CONFIG.mdx1Compat,
          ...site.markdown?.mdx1Compat,
        },
      },
      staticDirs: [path.join(ROOT, 'static')],
      siteDir: ROOT,
      removeContentTitle: false,
      remarkPlugins: [
        ...(site.presets[0][1].docs.remarkPlugins || []),
        function captureCode() {
          return (tree) => {
            function visit(node) {
              if (node.type === 'code') nodes.push(node);
              for (const child of node.children || []) visit(child);
            }
            visit(tree);
          };
        },
      ],
    },
  });
  await processor.process({
    content: source,
    filePath: path.join(ROOT, file),
    frontMatter: {},
    compilerName: 'server',
  });
  return nodes;
}

test('V2 extracts every site-parsed TS fence in blockquotes, lists and MDX JSX containers', async () => {
  const native = (await siteCodeNodes(fixture)).filter((node) =>
    /^(?:typescript|tsx|ts)$/i.test(node.lang),
  );
  assert.equal(
    native.length,
    4,
    'the authored fixture has four executable fences',
  );
  for (const source of [fixture, fixture.replace(/\n/g, '\r\n')]) {
    const { examples, coverage } = extract(source);
    assert.equal(coverage.found, native.length);
    assert.equal(coverage.extracted, native.length);
    assert.deepEqual(
      examples.map((example) => example.code),
      native.map((node) => node.value),
    );
    assert.deepEqual(
      examples.map((example) => example.fenceLine),
      native.map((node) => node.position.start.line),
    );
    for (const example of examples) {
      assert.match(
        source.split(/\r?\n/)[example.sourceLines[0] - 1],
        /import \{ nonexistent/,
      );
    }
    assert.deepEqual(structure(source.replace(/^---[\s\S]*?---\n/, '')), []);
  }
});

test('container examples reach TypeScript and report original authored import lines', () => {
  const { examples } = extract(fixture);
  assert.equal(examples.length, 4);
  const result = typecheckExamples(examples, ROOT);
  assert.notEqual(result.status, 0);
  assert.deepEqual(result.unparsed, []);
  assert.equal(result.diagnostics.length, 4);
  for (const diagnostic of result.diagnostics) {
    assert.equal(diagnostic.code, 'TS2305');
    assert.equal(diagnostic.sourceLine, diagnostic.example.sourceLines[0]);
    assert.match(
      fixture.split('\n')[diagnostic.sourceLine - 1],
      /import \{ nonexistent/,
    );
  }
  const valid = extract(
    '> ~~~ts\n> import { createAtomFromString } from "@0xintuition/sdk";\n> void createAtomFromString;\n> ~~~',
  );
  assert.equal(valid.examples.length, 1);
  assert.equal(typecheckExamples(valid.examples, ROOT).status, 0);
});

test('container skip markers are associated with the adjacent fence and never bypass Intuition imports', () => {
  for (const body of [
    `> ${skip}\n> ~~~ts\n> import { x } from '@0xintuition/sdk';\n> ~~~`,
    `- Outer\n  - Inner\n\n    ${skip}\n    \`\`\`\`ts meta\n    import { x } from '@0xintuition/sdk';\n    \`\`\`\``,
    `<Tabs>\n<TabItem>\n${skip}\n~~~ts\nimport { x } from '@0xintuition/sdk';\n~~~\n</TabItem>\n</Tabs>`,
  ]) {
    assert.throws(() => extract(body), /Intuition import fence may not skip/);
    assert.match(
      structure(body).join('\n'),
      /Intuition import fence may not skip/,
    );
    const permitted = body.replace(
      "import { x } from '@0xintuition/sdk';",
      'const value = 1;',
    );
    assert.equal(extract(permitted).coverage.skippedByAnnotation, 1);
    assert.deepEqual(structure(permitted), []);
  }
  for (const body of [
    `${skip}\n\n~~~ts\nimport { x } from '@0xintuition/sdk';\n~~~`,
    `${skip}\n> ~~~ts\n> import { x } from '@0xintuition/sdk';\n> ~~~`,
    `- ${skip}\n- ~~~ts\n  import { x } from '@0xintuition/sdk';\n  ~~~`,
  ]) {
    assert.equal(
      extract(body).examples.length,
      1,
      'unassociated marker must not skip a fence',
    );
    assert.match(
      structure(body).join('\n'),
      /immediately precede.*same container/,
    );
  }
});

test('native compatibility wrappers preserve authored source positions', () => {
  const source = [
    '```mdx-code-block',
    '<TabItem>',
    '```',
    '',
    '> ~~~ts',
    '> import { x } from "@0xintuition/sdk";',
    '> ~~~',
    '',
    '```mdx-code-block',
    '</TabItem>',
    '```',
    '',
  ].join('\n');
  const { examples } = extract(source);
  assert.equal(examples.length, 1);
  assert.equal(examples[0].fenceLine, 5);
  assert.deepEqual(examples[0].sourceLines, [6]);
});

test('native admonition syntax and heading IDs preserve code and source lines', () => {
  const source =
    '## Example {#example}\n\n:::note Example title\n~~~ts\nimport { x } from "@0xintuition/sdk";\n~~~\n:::';
  const { examples } = extract(source);
  assert.equal(examples.length, 1);
  assert.equal(examples[0].fenceLine, 4);
  assert.deepEqual(examples[0].sourceLines, [5]);
  assert.deepEqual(structure(source), []);
});

test('nested V1 migration annotations retain version partitioning and the import criterion', () => {
  const source =
    '> <!-- docs-typecheck: v1 -->\n> ~~~ts\n> import { createAtomFromString } from "@0xintuition/sdk";\n> ~~~\n\n~~~ts\nconst partial = unknownValue;\n~~~';
  const v2 = extract(source);
  assert.equal(v2.coverage.found, 2);
  assert.equal(v2.coverage.excludedByCriterion, 2);
  assert.equal(v2.coverage.extracted, 0);
  const v1 = extractExamplesFromSource(
    `${versions.current.docsDir}/get-started/migrate-from-v1.md`,
    source,
    skip,
    { version: 'v1' },
  );
  assert.equal(v1.examples.length, 1);
  assert.match(v1.examples[0].code, /createAtomFromString/);
  assert.match(structure(source).join('\n'), /migration guide/);
  // Comment tokenization can normalize whitespace. Both consumers must apply
  // the same marker meaning so a noncanonical V1 marker cannot evade the gate.
  const multiline = source.replace(
    '> <!-- docs-typecheck: v1 -->',
    '> <!--\n> docs-typecheck: v1\n> -->',
  );
  assert.equal(extract(multiline).coverage.excludedByCriterion, 2);
  assert.match(structure(multiline).join('\n'), /migration guide/);
});

test('malformed MDX fails explicitly and native front-matter Markdown format is honored', async () => {
  const malformed =
    '<Tabs>\n~~~ts\nimport { x } from "@0xintuition/sdk";\n~~~\n</Wrong>';
  await assert.rejects(siteCodeNodes(malformed));
  assert.throws(() => extract(malformed), /Cannot parse MDX.*index.mdx/);
  assert.match(structure(malformed).join('\n'), /Cannot parse MDX/);
  const markdown =
    '---\nmdx:\n  format: md\n---\n\nLiteral { brace\n\n> ~~~ts\n> import { x } from "@0xintuition/sdk";\n> ~~~';
  assert.equal(
    (await siteCodeNodes(markdown, 'md')).filter((node) => node.type === 'code')
      .length,
    1,
  );
  assert.equal(extract(markdown).examples.length, 1);
  assert.throws(
    () => extract(markdown.replace('format: md', 'format: mdx')),
    /Cannot parse MDX/,
  );
  assert.throws(
    () => extract('> ~~~~ts\n> import { x } from "@0xintuition/sdk";\n> ~~~'),
    /Unclosed TypeScript fence/,
  );
});
