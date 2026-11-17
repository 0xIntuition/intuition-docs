'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  syncSource,
  readRegion,
  isDeclarationOnly,
  MIGRATION,
} = require('./sync-example-snippets');
const { parseMarkdownCode, readFrontMatter } = require('./lib/markdown-fences');

const code = 'export const value: number = 1;\n';
const reference = 'examples/v2/sample/src/example.ts#value';
const fenced = (body = code, language = 'ts') =>
  `\`\`\`${language}\n${body}\`\`\``;
const synced = (body = code, ref = reference) =>
  `{/* example:start ${ref} */}\n\n${fenced(body)}\n\n{/* example:end */}`;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'snippet-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'examples/v2/sample/src'), { recursive: true });
  fs.mkdirSync(path.join(root, 'docs/_data'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'examples/v2/sample/src/example.ts'),
    `// #region value\n${code}// #endregion\n`,
  );
  return root;
}
function cli(root, source, name = 'tutorial.md', mode = '--check') {
  const file = `docs/_data/${name}`;
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), source);
  const program = `try { require(${JSON.stringify(require.resolve('./sync-example-snippets'))}).main([${JSON.stringify(mode)}, '--file', ${JSON.stringify(file)}], ${JSON.stringify(root)}); } catch (error) { console.error(error.message); process.exitCode = 1; }`;
  return spawnSync(process.execPath, ['-e', program], { encoding: 'utf8' });
}

test('sync is byte exact and write touches only the fenced body, including containers', (t) => {
  const root = fixture(t);
  for (const prefix of ['', '> ', '  ']) {
    const source =
      prefix === '  '
        ? `- Example\n\n${synced()
            .split('\n')
            .map((line) => prefix + line)
            .join('\n')}`
        : synced()
            .split('\n')
            .map((line) => prefix + line)
            .join('\n');
    const authored = `Prose with two  spaces.\n\n${source}\n\nUnrelated text.\n`;
    assert.equal(
      syncSource('docs/_data/example.md', authored, { root }).count,
      1,
    );
    const drift = authored.replace('number = 1', 'number = 2');
    assert.throws(
      () => syncSource('docs/_data/example.md', drift, { root }),
      /snippet drift/,
    );
    assert.equal(
      syncSource('docs/_data/example.md', drift, { root, write: true }).output,
      authored,
    );
  }
  assert.throws(
    () =>
      syncSource('docs/_data/example.md', synced().replace(/\n/g, '\r\n'), {
        root,
      }),
    /snippet drift/,
  );
  const result = cli(
    root,
    synced(code.replace('1;', '2;')),
    'tutorial.md',
    '--write',
  );
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    fs.readFileSync(path.join(root, 'docs/_data/tutorial.md'), 'utf8'),
    synced(),
  );
});

test('CLI rejects unsynced authored executable code on every page kind and language', (t) => {
  const root = fixture(t);
  for (const kind of ['tutorial', 'reference', 'concept', 'how-to']) {
    for (const language of [
      'ts',
      'typescript',
      'tsx',
      'js',
      'javascript',
      'jsx',
    ]) {
      const result = cli(
        root,
        `---\nkind: ${kind}\n---\n\n${fenced('const value = 1;\n', language)}`,
      );
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Unsynced executable/);
    }
  }
  for (const language of ['sh', 'json', 'text', 'output'])
    assert.equal(cli(root, fenced('example\n', language)).status, 0);
  assert.match(
    cli(root, synced().replace('```ts', '```js')).stderr,
    /typed TypeScript/,
  );
});

test('CLI rejects drift, invalid paths and invalid regions', (t) => {
  const root = fixture(t);
  const cases = [
    [synced(code.replace('1;', '2;')), /drift/],
    [synced(code, 'examples/v2/../outside.ts#value'), /Unsafe/],
    [
      synced(code, 'examples/v2/sample/node_modules/example.ts#value'),
      /Unsafe/,
    ],
    [synced(code, 'examples/v2/sample/src/missing.ts#value'), /Missing/],
    [synced(code, reference.replace('#value', '#missing')), /Missing region/],
    [synced(code, '/tmp/example.ts#value'), /Invalid example source/],
  ];
  for (const [source, message] of cases) {
    const result = cli(root, source);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  }
  const file = path.join(root, 'examples/v2/sample/src/example.ts');
  for (const source of [
    '// #region value\nconst x = 1;\n',
    '// #region value\n// #region nested\n// #endregion\n// #endregion\n',
    '// #region value\nx\n// #endregion\n// #region value\nx\n// #endregion\n',
    '// #endregion\n',
    '// #region bad name\n// #endregion\n',
    'const value = `\n// #region value\nconst invalid: string = 1;\n// #endregion\n`;\n',
    '/*\n// #region value\nconst invalid: string = 1;\n// #endregion\n*/\n',
  ]) {
    fs.writeFileSync(file, source);
    assert.throws(() => readRegion(root, reference), /region/i);
  }
  fs.rmSync(file);
  fs.symlinkSync(path.join(__dirname, 'validate-sdk-examples.js'), file);
  assert.throws(() => readRegion(root, reference), /escapes|Symlink/);
});

test('AST marker groups reject nesting, crossing containers, unmatched markers and extra content', (t) => {
  const root = fixture(t);
  for (const source of [
    synced().replace(fenced(), synced()),
    synced().replace('{/* example:end */}', ''),
    '{/* example:end */}',
    synced().replace(fenced(), fenced() + '\n\n' + fenced()),
    synced().replace(fenced(), 'Prose\n\n' + fenced()),
    synced().replace(
      fenced(),
      fenced()
        .split('\n')
        .map((line) => '> ' + line)
        .join('\n'),
    ),
    synced().replace('example:start ', 'example:start  '),
  ])
    assert.throws(
      () => syncSource('docs/_data/example.md', source, { root }),
      /marker|contain|fence/,
    );
  // A marker illustrated inside a Markdown fence is not an executable marker.
  assert.equal(
    syncSource('docs/_data/example.md', '````md\n' + synced() + '\n````', {
      root,
    }).count,
    0,
  );
});

test('migration markers require immediate same-container V1 fences, isolated from synced neighbors', (t) => {
  const root = fixture(t);
  const marked =
    '<!-- docs-typecheck: v1 -->\n' + fenced('const version = 1;\n');
  const source = marked + '\n\n' + synced();
  assert.equal(syncSource(MIGRATION, source, { root }).count, 1);
  assert.equal(
    syncSource(
      MIGRATION,
      source
        .split('\n')
        .map((line) => '> ' + line)
        .join('\n'),
      { root },
    ).count,
    1,
  );
  assert.match(
    cli(root, source, 'other.md').stderr,
    /only in the migration guide/,
  );
  assert.match(
    cli(
      root,
      source.replace('-->\n', '-->\n\n'),
      'get-started/migrate-from-v1.md',
    ).stderr,
    /immediately precede/,
  );
  assert.match(
    cli(
      root,
      source.replace('```ts', '```text'),
      'get-started/migrate-from-v1.md',
    ).stderr,
    /isolated TypeScript/,
  );
  assert.match(
    cli(
      root,
      synced().replace('```ts', '<!-- docs-typecheck: v1 -->\n```ts'),
      'get-started/migrate-from-v1.md',
    ).stderr,
    /only one fence/,
  );
});

test('generated artifacts permit signatures and literal constants, never actual usage', (t) => {
  const root = fixture(t);
  const sourceFaithful = [
    'function getIntuitionApiUrl(network: IntuitionApiNetwork): string;',
    "export const INTUITION_API_URL_LOCAL = 'http://localhost:8080/v1/graphql';",
    "export const agentActionSchemaVersion = '1.0.0' as const;",
    'export const supportedAgentActionChainIds = [1155, 13579, 8453, 84532] as const;',
    'export type JsonPrimitive = boolean | number | string | null;',
  ];
  for (const declaration of sourceFaithful)
    assert.equal(isDeclarationOnly(declaration), true, declaration);
  const {
    SDK_REFERENCE_FILES,
    SDK_REFERENCE_GENERATOR,
  } = require('./generate-package-reference');
  const generated = `---\ngenerated_by: ${SDK_REFERENCE_GENERATOR}\n---\n\n${fenced(sourceFaithful.join('\n') + '\n')}`;
  for (const file of SDK_REFERENCE_FILES)
    assert.equal(syncSource(file, generated, { root }).count, 0);
  assert.throws(
    () =>
      syncSource('docs/_data/reference/packages/sdk.md', generated, { root }),
    /Unsynced executable/,
  );
  assert.throws(
    () =>
      syncSource(SDK_REFERENCE_FILES[0], fenced(sourceFaithful[0] + '\n'), {
        root,
      }),
    /Unsynced executable/,
  );

  for (const usage of [
    'const client = createIntuitionApiClient();',
    'getIntuitionApiUrl("local");',
    'function bad(value = doWork()): void;',
    'export const value = doWork();',
    'export function bad() { return 1; }',
    'import { createIntuitionApiClient } from "@0xintuition/sdk/api";',
    'export let value = 1;',
  ])
    assert.equal(isDeclarationOnly(usage), false, usage);
  const result = cli(
    root,
    '---\ngenerated_by: scripts/generate-package-reference.js\n---\n\n' +
      fenced('createIntuitionApiClient();\n'),
    'reference/sdk/api.md',
  );
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unsynced executable/);
});

test('front matter is non-executing and normal YAML format selection is retained', () => {
  for (const engine of ['js', 'javascript']) {
    delete globalThis.docsFrontMatterExecuted;
    const source = `---${engine}\nglobalThis.docsFrontMatterExecuted = true;\n---\n\n${fenced()}`;
    assert.throws(() => readFrontMatter(source), /Only YAML/);
    assert.throws(() => parseMarkdownCode(source), /Only YAML/);
    assert.equal(globalThis.docsFrontMatterExecuted, undefined);
  }
  const source =
    '---\nmdx:\n  format: md\n---\n\nLiteral { brace\n\n' + fenced();
  assert.equal(readFrontMatter(source).mdx.format, 'md');
  assert.equal(parseMarkdownCode(source).fences.length, 1);
});
