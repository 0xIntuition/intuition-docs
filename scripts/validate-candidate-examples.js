#!/usr/bin/env node
// Typecheck the guidebook against pinned source builds or installed npm artifacts.
// Execute only the explicitly offline identity and profile recipes, with fetch disabled.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = process.argv[2] && path.resolve(process.argv[2]);
if (!source)
  throw new Error(
    'Usage: node scripts/validate-candidate-examples.js /path/to/packages',
  );
const manifest = require('../static/intuition-release.json');
const installed = process.argv.includes('--installed');
if (!installed) {
  const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {
    encoding: 'utf8',
  }).trim();
  if (revision !== manifest.source.commit)
    throw new Error('Candidate source does not match manifest');
  if (
    execFileSync('git', ['-C', source, 'status', '--porcelain'], {
      encoding: 'utf8',
    }).trim()
  )
    throw new Error('Candidate validation requires a clean source checkout');
}
const fixtureIndex = process.argv.indexOf('--fixture');
const fixture = fixtureIndex >= 0 && process.argv[fixtureIndex + 1];
if (fixtureIndex >= 0 && !fixture) throw new Error('--fixture requires a file');
const temp = fs.mkdtempSync(
  path.join(os.tmpdir(), 'intuition-docs-candidate-'),
);
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
try {
  fs.mkdirSync(path.join(temp, 'node_modules/@0xintuition'), {
    recursive: true,
  });
  for (const pkg of manifest.packages) {
    const name = pkg.name.split('/')[1];
    const pkgPath = installed
      ? path.join(source, 'node_modules', pkg.name)
      : path.join(source, 'packages', name);
    const actual = JSON.parse(
      fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8'),
    );
    if (actual.version !== pkg.version)
      throw new Error(`Version mismatch: ${pkg.name}`);
    fs.symlinkSync(
      pkgPath,
      path.join(temp, 'node_modules/@0xintuition', name),
      'dir',
    );
  }
  for (const name of ['viem', 'typescript'])
    fs.symlinkSync(
      path.dirname(
        require.resolve(name + '/package.json', {
          paths: installed
            ? [source]
            : [path.join(source, 'packages/sdk'), source],
        }),
      ),
      path.join(temp, 'node_modules', name),
      'dir',
    );
  let count = 0;
  const mapping = [];
  const offline = [];
  const offlineFences = {
    'guides/processing.md': [1, 2],
    'guides/processing-plugins.md': [1],
    'guides/action-envelopes.md': [1],
    'packages/atom-runtime.md': [1],
    'packages/pipeline-runtime.md': [1],
  };
  for (const file of walk(path.join(root, 'docs/_data/build'))) {
    if (!/\.mdx?$/.test(file) || file.includes('/sdk-reference/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    let ordinal = 0;
    for (const match of text.matchAll(/```(?:ts|typescript)\n([\s\S]*?)```/g)) {
      ordinal++;
      const name = `example-${++count}.mts`;
      fs.writeFileSync(path.join(temp, name), match[1]);
      mapping.push(
        `${name}: ${path.relative(root, file)}:${text.slice(0, match.index).split('\n').length}`,
      );
      const relative = path
        .relative(path.join(root, 'docs/_data/build'), file)
        .split(path.sep)
        .join('/');
      if (offlineFences[relative]?.includes(ordinal)) {
        const executable = path.join(temp, name.replace('.mts', '.mjs'));
        fs.writeFileSync(
          executable,
          ts.transpileModule(match[1], {
            compilerOptions: {
              target: ts.ScriptTarget.ES2022,
              module: ts.ModuleKind.ESNext,
            },
          }).outputText,
        );
        offline.push({ executable, relative, ordinal });
      }
    }
  }
  if (fixture)
    fs.copyFileSync(
      path.resolve(fixture),
      path.join(temp, 'negative-fixture.mts'),
    );
  if (count === 0) throw new Error('No candidate TypeScript snippets found');
  fs.writeFileSync(
    path.join(temp, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'NodeNext',
        moduleResolution: 'NodeNext',
        strict: true,
        skipLibCheck: true,
        noEmit: true,
        lib: ['ES2022', 'DOM'],
      },
      include: ['*.mts'],
    }),
  );
  try {
    execFileSync(
      process.execPath,
      [
        path.join(root, 'node_modules/typescript/bin/tsc'),
        '-p',
        path.join(temp, 'tsconfig.json'),
      ],
      { stdio: 'pipe' },
    );
  } catch (error) {
    console.error(mapping.join('\n'));
    console.error(error.stdout?.toString());
    throw new Error('Candidate examples failed typechecking');
  }
  const guard = path.join(temp, 'offline-guard.mjs');
  fs.writeFileSync(
    guard,
    "globalThis.fetch = () => { throw new Error('Offline recipe attempted HTTP'); };\n",
  );
  for (const { executable, relative, ordinal } of offline) {
    try {
      execFileSync(process.execPath, ['--import', guard, executable], {
        stdio: 'pipe',
        timeout: 30_000,
      });
      console.log(`Offline recipe passed: ${relative} (fence ${ordinal})`);
    } catch (error) {
      console.error(error.stderr?.toString());
      throw new Error(`Offline recipe failed: ${relative} (fence ${ordinal})`);
    }
  }
  const first = fs
    .readFileSync(
      path.join(root, 'docs/_data/build/guides/first-atom.md'),
      'utf8',
    )
    .match(/```js\n([\s\S]*?)```/)[1];
  fs.writeFileSync(
    path.join(temp, 'first-atom.mjs'),
    "globalThis.fetch = () => { throw new Error('Offline recipe attempted HTTP'); };\n" +
      first,
  );
  execFileSync(process.execPath, [path.join(temp, 'first-atom.mjs')], {
    stdio: 'inherit',
  });
  const profiles = fs
    .readFileSync(
      path.join(root, 'docs/_data/build/packages/primitives.md'),
      'utf8',
    )
    .match(/```js\n([\s\S]*?)```/)[1];
  fs.writeFileSync(
    path.join(temp, 'profiles.mjs'),
    "globalThis.fetch = () => { throw new Error('Offline recipe attempted HTTP'); };\n" +
      profiles,
  );
  execFileSync(process.execPath, [path.join(temp, 'profiles.mjs')], {
    stdio: 'inherit',
  });
  console.log(
    `Passed ${count} TypeScript snippets against ${installed ? 'installed npm artifacts' : 'local built exports'}; offline identity/context and derived/candidate profile assertions passed. No live-service verification is implied.`,
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
