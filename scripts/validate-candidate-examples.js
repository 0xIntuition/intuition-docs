#!/usr/bin/env node
// Typecheck the new guidebook against a selected candidate's built public exports.
// Execute only the explicitly offline first-atom recipe, with fetch disabled.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = process.argv[2] && path.resolve(process.argv[2]);
if (!source)
  throw new Error(
    'Usage: node scripts/validate-candidate-examples.js /path/to/packages',
  );
const manifest = require('../static/intuition-release.json');
const revision = execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
if (revision !== manifest.source.commit)
  throw new Error('Candidate source does not match manifest');
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
    const pkgPath = path.join(source, 'packages', name);
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
          paths: [path.join(source, 'packages/sdk'), source],
        }),
      ),
      path.join(temp, 'node_modules', name),
      'dir',
    );
  let count = 0;
  const mapping = [];
  for (const file of walk(path.join(root, 'docs/_data/build'))) {
    if (!file.endsWith('.md') || file.includes('/sdk-reference/')) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(/```(?:ts|typescript)\n([\s\S]*?)```/g)) {
      const name = `example-${++count}.mts`;
      fs.writeFileSync(path.join(temp, name), match[1]);
      mapping.push(
        `${name}: ${path.relative(root, file)}:${text.slice(0, match.index).split('\n').length}`,
      );
    }
  }
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
  console.log(
    `Passed ${count} TypeScript snippets against local built candidate exports; offline identity/context assertions passed. No npm-publication or live-service verification is implied.`,
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
