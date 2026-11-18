#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { walkFiles } = require('./lib/docs-tree');
const { versions } = require('../docs-versions.config');

const EXACT = /^\d+\.\d+\.\d+(?:-[\da-z.-]+)?(?:\+[\da-z.-]+)?$/i;
const SHA = /^[a-f0-9]{40}$/;
const EXAMPLE_PEER_PINS = {
  viem: '2.31.4',
  react: '19.1.0',
  '@types/react': '19.1.10',
  wagmi: '2.15.4',
  '@tanstack/react-query': '5.90.2',
  typescript: '5.9.3',
  'react-dom': '19.1.0',
  '@types/react-dom': '19.1.11',
  '@types/node': '22.20.5',
};
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function validateManifest(manifest) {
  const errors = [];
  if (manifest.schemaVersion !== 3 || manifest.generation !== 'V2')
    errors.push('Expected schemaVersion 3 and generation V2');
  if (
    !['published', 'published-alpha'].includes(manifest.status) ||
    manifest.registryPublicationVerified !== true ||
    !Number.isFinite(Date.parse(manifest.registryVerifiedAt))
  )
    errors.push('Missing release status or timestamped registry verification');
  if (
    manifest.source?.repository !== 'https://github.com/0xIntuition/packages' ||
    !SHA.test(manifest.source?.commit || '')
  )
    errors.push('Invalid packages source repository or full commit');
  const core = manifest.core || {};
  if (
    core.repository !== 'https://github.com/0xIntuition/intuition-core' ||
    core.distribution !== 'source' ||
    !SHA.test(core.commit || '') ||
    Object.keys(core).sort().join(',') !== 'commit,distribution,repository'
  )
    errors.push(
      'Core source mode requires only repository, distribution: source, and a full commit; release-only fields are forbidden',
    );
  if (
    !Array.isArray(manifest.specs) ||
    !manifest.specs.some(
      (spec) =>
        spec.name === 'intuition-identifier' &&
        spec.repository ===
          'https://github.com/0xIntuition/intuition-identifier' &&
        EXACT.test(spec.version) &&
        SHA.test(spec.commit),
    )
  )
    errors.push('Missing canonical identifier spec pin');
  if (
    !manifest.contracts ||
    !['@0xintuition/contracts-v2', '@0xintuition/contracts-v2-periphery'].every(
      (name) => EXACT.test(manifest.contracts[name] || ''),
    )
  )
    errors.push('Missing exact contract artifact versions');
  if (!Array.isArray(manifest.packages) || !manifest.packages.length)
    errors.push('Missing package inventory');
  const seen = new Set();
  for (const pkg of manifest.packages || []) {
    if (
      !/^@0xintuition\/[a-z0-9-]+$/.test(pkg.name) ||
      seen.has(pkg.name) ||
      !EXACT.test(pkg.version || '') ||
      !Array.isArray(pkg.entrypoints) ||
      !pkg.entrypoints.length ||
      pkg.entrypoints.some(
        (entry) =>
          typeof entry !== 'string' || !/^(\.|\.\/[^\s]+)$/.test(entry),
      ) ||
      new Set(pkg.entrypoints).size !== pkg.entrypoints.length ||
      !pkg.peers ||
      !pkg.engines
    )
      errors.push(`Malformed package record: ${pkg.name}`);
    seen.add(pkg.name);
    if (
      !pkg.source?.startsWith(
        `https://github.com/0xIntuition/packages/tree/${manifest.source?.commit}/packages/`,
      )
    )
      errors.push(`Invalid package source link: ${pkg.name}`);
    const registry = pkg.registry || {};
    if (
      !SHA.test(registry.gitHead || '') ||
      !registry.integrity?.startsWith('sha512-') ||
      !registry.distTags ||
      !Number.isFinite(Date.parse(registry.publishedAt)) ||
      !registry.url?.startsWith('https://registry.npmjs.org/') ||
      !registry.npm?.startsWith('https://www.npmjs.com/package/') ||
      !registry.tarball?.startsWith('https://registry.npmjs.org/')
    )
      errors.push(`Missing publication evidence: ${pkg.name}`);
  }
  return errors;
}

// Exceptions are tightly scoped to authored explanatory blocks, not whole files.
function exemptions(source, file) {
  const errors = [];
  const hazard = [];
  const generated = [];
  const legacy = [];
  for (const [open, close, ranges, allowed] of [
    [
      '<!-- release-pins: hazard -->',
      '<!-- /release-pins -->',
      hazard,
      /(?:^|\/)docs\/_data\/(?:get-started\/versions|build\/install)\.mdx?$/.test(
        file,
      ),
    ],
    ['{/* generated:start ', '{/* generated:end */}', generated, true],
  ]) {
    let cursor = 0;
    while (cursor < source.length) {
      const start = source.indexOf(open, cursor);
      if (start < 0) break;
      const end = source.indexOf(close, start + open.length);
      const nested = source.indexOf(open, start + open.length);
      if (end < 0 || (nested >= 0 && nested < end)) {
        errors.push('Malformed or nested release/generated block');
        break;
      }
      if (!allowed)
        errors.push(
          'Hazard block is allowed only on get-started/versions or build/install',
        );
      if (ranges === hazard) {
        const lineStart = source.lastIndexOf('\n', start - 1) + 1;
        const afterOpen = source.indexOf('\n', start);
        const closeStart = source.lastIndexOf('\n', end - 1) + 1;
        const afterClose = source.indexOf('\n', end);
        if (
          source
            .slice(lineStart, afterOpen < 0 ? source.length : afterOpen)
            .trim() !== open ||
          source
            .slice(closeStart, afterClose < 0 ? source.length : afterClose)
            .trim() !== close
        )
          errors.push('Hazard markers must be on their own lines');
      }
      ranges.push([start, end + close.length]);
      cursor = end + close.length;
    }
    for (const match of source.matchAll(new RegExp(escape(close), 'g')))
      if (
        !ranges.some(
          ([start, end]) => match.index >= start && match.index < end,
        )
      )
        errors.push('Unmatched release/generated block end');
  }
  const marker = '<!-- docs-typecheck: v1 -->';
  for (const match of source.matchAll(
    /<!-- docs-typecheck: v1 -->\r?\n([ \t]*)(`{3,}|~{3,})(?:ts|tsx|js|jsx)(?:[^\n]*)\r?\n/g,
  )) {
    const rest = source.slice(match.index + match[0].length);
    const closing = rest.match(
      new RegExp(
        `^${escape(match[1])}${escape(match[2][0])}{${match[2].length},}[ \\t]*$`,
        'm',
      ),
    );
    if (!/docs\/_data\/get-started\/migrate-from-v1\.mdx?$/.test(file))
      errors.push('V1 fences are allowed only on get-started/migrate-from-v1');
    if (!closing) {
      errors.push('Unclosed V1 fence');
      continue;
    }
    legacy.push([
      match.index,
      match.index + match[0].length + closing.index + closing[0].length,
    ]);
  }
  for (const match of source.matchAll(new RegExp(escape(marker), 'g')))
    if (!legacy.some(([start]) => start === match.index))
      errors.push('V1 marker must immediately precede a closed code fence');
  return { errors, hazard, generated, legacy };
}
const inside = (ranges, offset) =>
  ranges.some(([start, end]) => offset >= start && offset < end);

function inspectText(source, file, manifest, { write = false } = {}) {
  const exclusions = exemptions(source, file);
  const errors = [...exclusions.errors];
  const pins = new Map([
    ...manifest.packages.map((pkg) => [pkg.name, pkg.version]),
    ...Object.entries(manifest.contracts),
  ]);
  let offset = 0;
  let continuedInstall = false;
  const lines = source.split(/(?<=\n)/).map((original, index) => {
    const lineOffset = offset;
    offset += original.length;
    const exempt =
      inside(exclusions.hazard, lineOffset) ||
      inside(exclusions.legacy, lineOffset);
    let line = original;
    const report = (message) => errors.push(`${file}:${index + 1}: ${message}`);
    const install =
      continuedInstall ||
      /\b(?:npm\s+(?:i|install|exec)|pnpm\s+(?:add|dlx)|yarn\s+add|bun\s+add|npx|bunx)\s/.test(
        line,
      );
    continuedInstall = install && /\\\s*$/.test(line);
    if (!exempt)
      line = line.replace(
        /(@0xintuition\/[a-z0-9-]+)(?:@([^\s`"'<>()[\]{},;]+))?/g,
        (token, name, rawVersion, at) => {
          // A plain package import/name is not a version token or an install.
          if (!rawVersion && (!install || line[at + token.length] === '/'))
            return token;
          const trailing = rawVersion?.endsWith('.') ? '.' : '';
          const version = trailing ? rawVersion.slice(0, -1) : rawVersion;
          const expected = pins.get(name);
          if (!expected) {
            report(`Unknown package pin: ${name}`);
            return token;
          }
          if (version !== expected) {
            if (write) return `${name}@${expected}${trailing}`;
            report(
              `${name} must use exact ${expected}; found ${version || 'an unpinned install'}`,
            );
          }
          return token;
        },
      );
    line = line.replace(
      /(https?:\/\/github\.com\/0xIntuition\/(packages|intuition-core)\/(?:tree|blob)\/)([^\s/#?<>\])`"']+)/gi,
      (url, prefix, repository, ref) => {
        const expected =
          repository.toLowerCase() === 'packages'
            ? manifest.source.commit
            : manifest.core.commit;
        if (ref !== expected) {
          if (write && repository.toLowerCase() === 'packages')
            return prefix + expected;
          report(`${repository} source ref ${ref} must equal ${expected}`);
        }
        return url;
      },
    );
    if (
      /(?:\b(?:INTUITION_CORE_)?IMAGE_TAG\s*=|ghcr\.io\/0xintuition\/intuition-core-[\w-]+|\bmake\s+up-published\b|docker-compose\.published)/i.test(
        line,
      )
    )
      report(
        'Core is built from pinned source; published Core image/tag/digest instructions are forbidden',
      );
    if (
      !exempt &&
      /published-alpha|alpha (?:package|version|release|api|interface)s?\b/i.test(
        line,
      )
    )
      report('Superseded alpha wording outside a verified hazard block');
    if (
      !exempt &&
      !inside(exclusions.generated, lineOffset) &&
      manifest.packages.some((pkg) => line.includes(pkg.name))
    ) {
      const withoutTokens = line.replace(
        /@0xintuition\/[a-z0-9-]+@[^\s`"'<>()[\]{},;]+/g,
        '',
      );
      const versionsToCheck = [
        ...new Set(manifest.packages.map((pkg) => pkg.version)),
      ];
      for (const version of versionsToCheck)
        if (
          new RegExp(
            `(?<![a-zA-Z0-9.\\-^~<>=])${escape(version)}(?![a-zA-Z0-9-]|\\.\\d)`,
          ).test(withoutTokens)
        )
          report(
            `Package version ${version} must use a verified package@version token or generated block`,
          );
      for (const match of withoutTokens.matchAll(
        /\d+\.\d+\.\d+-alpha\.[a-z0-9.-]+/gi,
      ))
        if (!Object.values(manifest.contracts).includes(match[0]))
          report(`Unported alpha version ${match[0]}`);
    }
    return line;
  });
  return { text: lines.join(''), errors };
}

function trackedExamples(root) {
  return execFileSync(
    'git',
    ['-C', root, 'ls-files', '-z', '--', 'examples/v2'],
    { encoding: 'utf8' },
  )
    .split('\0')
    .filter(
      (file) =>
        file &&
        !file.split('/').includes('node_modules') &&
        /\.(?:mdx?|[cm]?[jt]sx?|json|ya?ml|sh|txt)$/.test(file) &&
        !file.endsWith('package-lock.json') &&
        !file.endsWith('package.json'),
    )
    .map((file) => path.join(root, file));
}
function checkReleasePins({
  root = path.resolve(__dirname, '..'),
  write = false,
} = {}) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'static/intuition-release.json'), 'utf8'),
  );
  const errors = validateManifest(manifest);
  if (errors.length) return { errors, checked: 0, changed: [] };
  const llmsFiles = ['llms.txt', 'llms-medium.txt', 'llms-full.txt'].map(
    (file) => path.join(root, versions.current.llmsDir, file),
  );
  const files = [
    ...walkFiles(path.join(root, versions.current.docsDir)).filter((file) =>
      /\.(?:mdx?|tsx?)$/.test(file),
    ),
    ...trackedExamples(root),
    path.join(root, versions.current.llmsIndexSource),
    ...llmsFiles,
  ].filter((file) => fs.existsSync(file));
  const changed = [];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const relative = path.relative(root, file).split(path.sep).join('/');
    // The generated full/medium bundles contain cleaned page bodies, whose
    // exceptions were already checked at their source. Inspect only their head.
    const boundary = llmsFiles.includes(file)
      ? source.search(/\n(?:---\r?\n|# [^\n]+\r?\n)/)
      : -1;
    const head = boundary < 0 ? source : source.slice(0, boundary);
    const result = inspectText(head, relative, manifest, { write });
    if (boundary >= 0) result.text += source.slice(boundary);
    errors.push(...result.errors);
    if (write && result.text !== source) {
      fs.writeFileSync(file, result.text);
      changed.push(relative);
    }
  }
  const exampleFile = path.join(root, 'examples/v2/package.json');
  if (!fs.existsSync(exampleFile))
    errors.push('Missing examples/v2/package.json');
  else {
    const source = fs.readFileSync(exampleFile, 'utf8');
    const pkg = JSON.parse(source);
    if (pkg.private !== true || pkg.type !== 'module')
      errors.push('examples/v2 must be private and type: module');
    pkg.dependencies ||= {};
    if (write)
      for (const entry of manifest.packages)
        pkg.dependencies[entry.name] = entry.version;
    const groups = ['dependencies', 'devDependencies', 'optionalDependencies'];
    for (const [name, expected] of [
      ...manifest.packages.map((entry) => [entry.name, entry.version]),
      ...Object.entries(EXAMPLE_PEER_PINS),
    ]) {
      const entries = groups.filter((group) =>
        Object.hasOwn(pkg[group] || {}, name),
      );
      if (entries.length !== 1 || pkg[entries[0]]?.[name] !== expected)
        errors.push(
          `examples/v2 dependency ${name} must appear once at exact ${expected}`,
        );
    }
    for (const group of groups)
      for (const name of Object.keys(pkg[group] || {}))
        if (
          name.startsWith('@0xintuition/') &&
          !manifest.packages.some((entry) => entry.name === name)
        )
          errors.push(`Unknown examples/v2 dependency ${name}`);
    const text = JSON.stringify(pkg, null, 2) + '\n';
    if (write && text !== source) {
      fs.writeFileSync(exampleFile, text);
      changed.push('examples/v2/package.json');
    }
  }
  return { errors, checked: files.length, changed };
}
if (require.main === module) {
  try {
    const result = checkReleasePins({
      write: process.argv.includes('--write'),
    });
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
      process.exitCode = 1;
    } else
      console.log(
        `Release pins verified in ${result.checked} files; ${result.changed.length} updated.`,
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  validateManifest,
  inspectText,
  checkReleasePins,
  EXAMPLE_PEER_PINS,
};
