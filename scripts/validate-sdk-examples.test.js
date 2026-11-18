'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const {
  validateImports,
  intuitionImports,
  discoverProjects,
  typecheckProjects,
  extractExamplesFromSource,
} = require('./validate-sdk-examples');
const { MIGRATION } = require('./sync-example-snippets');
const ROOT = path.resolve(__dirname, '..');
const manifest = {
  packages: [
    { name: '@0xintuition/primitives', entrypoints: ['.'] },
    {
      name: '@0xintuition/classifications',
      entrypoints: ['.', './creation/*', './*'],
    },
  ],
};
function fixture(t, source = 'export const value: number = 1;\n') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-project-fixture-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const base = path.join(root, 'examples/v2');
  fs.mkdirSync(path.join(base, 'sample/src'), { recursive: true });
  fs.mkdirSync(path.join(base, 'node_modules/@types'), { recursive: true });
  fs.symlinkSync(
    path.join(ROOT, 'node_modules/typescript'),
    path.join(base, 'node_modules/typescript'),
    'dir',
  );
  fs.symlinkSync(
    path.join(ROOT, 'node_modules/@types/node'),
    path.join(base, 'node_modules/@types/node'),
    'dir',
  );
  fs.writeFileSync(
    path.join(base, 'package.json'),
    '{"private":true,"type":"module"}',
  );
  fs.writeFileSync(
    path.join(base, 'tsconfig.base.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        noEmit: true,
        strict: true,
        skipLibCheck: true,
        types: ['node'],
        typeRoots: ['./node_modules/@types'],
      },
    }),
  );
  fs.writeFileSync(
    path.join(base, 'sample/tsconfig.json'),
    JSON.stringify({
      extends: '../tsconfig.base.json',
      include: ['src/**/*.ts'],
    }),
  );
  fs.writeFileSync(path.join(base, 'sample/src/example.ts'), source);
  return { root, base };
}
function compileCli(base) {
  return spawnSync(
    process.execPath,
    [
      '-e',
      `try { require(${JSON.stringify(require.resolve('./validate-sdk-examples'))}).typecheckProjects(${JSON.stringify(base)}, ${JSON.stringify(manifest)}); } catch (error) { console.error(error.message); process.exitCode = 1; }`,
    ],
    { encoding: 'utf8' },
  );
}

test('all TypeScript module forms are checked against exact and Node wildcard exports', () => {
  const code = [
    'import { x } from "@0xintuition/primitives";',
    'export { y } from "@0xintuition/classifications/creation/music-recording";',
    'const z = import("@0xintuition/classifications/music/recording");',
    'type T = import("@0xintuition/classifications/types").T;',
    'const q = require("@0xintuition/classifications/constants");',
    'import p = require("@0xintuition/classifications/creation/person");',
  ].join('\n');
  assert.equal(intuitionImports(code).length, 6);
  assert.doesNotThrow(() => validateImports(code, 'source.ts', manifest));
  for (const specifier of [
    '@0xintuition/primitives/nope',
    '@0xintuition/unknown',
    '@0xintuition/classifications/../secret',
    '@0xintuition/classifications/node_modules/foo',
  ]) {
    assert.throws(
      () => validateImports(`import '${specifier}';`, 'source.ts', manifest),
      new RegExp(specifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
  assert.deepEqual(
    intuitionImports(
      '// import "@0xintuition/nope"\nconst text = "@0xintuition/nope";',
    ),
    [],
  );
});

test('new projects cannot disappear by lacking a config or excluding source files', (t) => {
  const { base } = fixture(t);
  assert.equal(discoverProjects(base).projects.size, 1);
  fs.mkdirSync(path.join(base, 'new-project/src'), { recursive: true });
  fs.writeFileSync(
    path.join(base, 'new-project/src/example.ts'),
    'export const value = 1;',
  );
  assert.throws(
    () => discoverProjects(base),
    /Missing or invalid project tsconfig/,
  );
  fs.writeFileSync(
    path.join(base, 'new-project/tsconfig.json'),
    '{"extends":"../tsconfig.base.json","include":["src/**/*.ts"]}',
  );
  assert.equal(discoverProjects(base).projects.size, 2);
  fs.writeFileSync(
    path.join(base, 'new-project/src/hidden.ts'),
    'const hidden: string = 123;',
  );
  fs.writeFileSync(
    path.join(base, 'new-project/tsconfig.json'),
    '{"extends":"../tsconfig.base.json","files":["src/example.ts"],"include":[]}',
  );
  assert.throws(() => discoverProjects(base), /silently excludes source/);
  fs.writeFileSync(
    path.join(base, 'new-project/tsconfig.json'),
    '{"extends":"../../../../tsconfig.json"}',
  );
  assert.throws(() => discoverProjects(base), /must extend/);
});

test('CLI reaches the real compiler and fails unsupported real-project imports', (t) => {
  const { base } = fixture(t);
  const good = compileCli(base);
  assert.equal(good.status, 0, good.stderr);
  const file = path.join(base, 'sample/src/example.ts');
  fs.writeFileSync(file, 'export const value: string = 123;');
  const bad = compileCli(base);
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /TS2322/);
  fs.writeFileSync(file, 'import "@0xintuition/primitives/nope";');
  const unsupported = compileCli(base);
  assert.notEqual(unsupported.status, 0);
  assert.match(
    unsupported.stderr,
    /Unsupported Intuition import @0xintuition\/primitives\/nope/,
  );
});

test('V2 compilation cannot fall back to an ancestor package or type root', (t) => {
  const { base, root } = fixture(
    t,
    'import { rootOnly } from "root-only";\nvoid rootOnly;',
  );
  const packageRoot = path.join(root, 'node_modules/root-only');
  fs.mkdirSync(packageRoot, { recursive: true });
  fs.writeFileSync(
    path.join(packageRoot, 'package.json'),
    '{"name":"root-only","types":"index.d.ts"}',
  );
  fs.writeFileSync(
    path.join(packageRoot, 'index.d.ts'),
    'export const rootOnly: number;',
  );
  assert.throws(() => typecheckProjects(base, manifest), /TS2307/);
  fs.writeFileSync(
    path.join(base, 'sample/tsconfig.json'),
    '{"extends":"../tsconfig.base.json","compilerOptions":{"typeRoots":["../../../node_modules/@types"]}}',
  );
  assert.throws(() => discoverProjects(base), /override isolated/);
});

test('source cannot bypass compilation through hidden files, suppression or external imports', (t) => {
  const { base, root } = fixture(t);
  const file = path.join(base, 'sample/src/example.ts');
  fs.writeFileSync(file, '// @ts-nocheck\nexport const value: string = 1;');
  assert.throws(() => typecheckProjects(base, manifest), /must not suppress/);
  fs.writeFileSync(file, 'export const value = 1;');
  fs.writeFileSync(
    path.join(base, 'sample/src/.hidden.ts'),
    'const hidden: string = 1;',
  );
  assert.throws(() => discoverProjects(base), /silently excludes source/);
  fs.rmSync(path.join(base, 'sample/src/.hidden.ts'));
  fs.writeFileSync(
    path.join(base, 'sample/tsconfig.json'),
    '{"extends":"../tsconfig.base.json","compilerOptions":{"noCheck":true}}',
  );
  assert.throws(() => discoverProjects(base), /disable TypeScript/);
  fs.writeFileSync(
    path.join(base, 'sample/tsconfig.json'),
    '{"extends":"../tsconfig.base.json"}',
  );
  fs.writeFileSync(
    file,
    `import ${JSON.stringify(path.join(root, 'outside.ts'))};`,
  );
  assert.throws(() => typecheckProjects(base, manifest), /external file/);
});

test('the real V2 CLI enforces sync, export checks and the compiler together', (t) => {
  const { root, base } = fixture(t);
  fs.mkdirSync(path.join(root, 'scripts/lib'), { recursive: true });
  fs.mkdirSync(path.join(root, 'static'));
  fs.mkdirSync(path.join(root, 'docs/_data'), { recursive: true });
  for (const file of [
    'scripts/validate-sdk-examples.js',
    'scripts/sync-example-snippets.js',
    'scripts/lib/markdown-fences.js',
    'scripts/sdk-examples.config.json',
    'docs-versions.config.js',
  ]) {
    fs.copyFileSync(path.join(ROOT, file), path.join(root, file));
  }
  // The full installed-site parser parity is covered in markdown-fences.test.js.
  fs.writeFileSync(
    path.join(root, 'docusaurus.config.js'),
    'module.exports = {markdown: {mdx1Compat: {comments: true}}, presets: [["classic", {docs: {}}]]};',
  );
  fs.symlinkSync(
    path.join(ROOT, 'node_modules'),
    path.join(root, 'node_modules'),
    'dir',
  );
  fs.writeFileSync(
    path.join(root, 'static/intuition-release.json'),
    JSON.stringify(manifest),
  );
  const sourceFile = path.join(base, 'sample/src/example.ts');
  const page = path.join(root, 'docs/_data/example.md');
  const publish = (code, synced = true) => {
    fs.writeFileSync(sourceFile, `// #region value\n${code}\n// #endregion\n`);
    const fence = `\`\`\`ts\n${code}\n\`\`\``;
    fs.writeFileSync(
      page,
      synced
        ? `{/* example:start examples/v2/sample/src/example.ts#value */}\n${fence}\n{/* example:end */}`
        : fence,
    );
  };
  const run = () =>
    spawnSync(
      process.execPath,
      [
        path.join(root, 'scripts/validate-sdk-examples.js'),
        '--version',
        'v2',
        '--real-only',
      ],
      { encoding: 'utf8', cwd: root },
    );
  publish('export const value: number = 1;');
  const good = run();
  assert.equal(good.status, 0, good.stderr);
  assert.match(good.stdout, /1 synced V2 fences; 1 isolated projects/);
  publish('export const value: string = 1;');
  const bad = run();
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /TS2322/);
  publish('import "@0xintuition/primitives/nope";');
  const unsupported = run();
  assert.notEqual(unsupported.status, 0);
  assert.match(
    unsupported.stderr,
    /Unsupported Intuition import @0xintuition\/primitives\/nope/,
  );
  publish('export const value = 1;', false);
  const unsynced = run();
  assert.notEqual(unsynced.status, 0);
  assert.match(unsynced.stderr, /Unsynced executable/);
});

test('migration V1 imports and import-less code are isolated from V2 extraction', () => {
  const source =
    '<!-- docs-typecheck: v1 -->\n```ts\nconst oldValue: number = 1;\n```\n\n{/* example:start examples/v2/sample/src/example.ts#v2 */}\n```ts\nconst newValue: number = 2;\n```\n{/* example:end */}';
  const v1 = extractExamplesFromSource(
    MIGRATION,
    source,
    '<!-- docs-typecheck: skip -->',
    { version: 'v1' },
  );
  const v2 = extractExamplesFromSource(
    MIGRATION,
    source,
    '<!-- docs-typecheck: skip -->',
    { version: 'v2' },
  );
  assert.equal(v1.examples.length, 1);
  assert.equal(v2.examples.length, 1);
  assert.match(v1.examples[0].code, /oldValue/);
  assert.match(v2.examples[0].code, /newValue/);
});
