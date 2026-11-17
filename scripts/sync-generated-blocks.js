#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const { readDocs } = require('./lib/docs-tree');
const cell = (value) =>
  String(value).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

function releasePins(manifest) {
  return (
    '| Package | Version |\n| --- | --- |\n' +
    manifest.packages
      .map((pkg) => `| \`${pkg.name}\` | \`${pkg.version}\` |`)
      .join('\n')
  );
}
function versionEquivalents(pairs, current, legacy) {
  const currentById = new Map(current.map((doc) => [doc.id, doc]));
  const legacyById = new Map(legacy.map((doc) => [doc.id, doc]));
  const rows = [];
  for (const pair of pairs) {
    if (
      pair.v1 === 'experimental-applications/mcp-server' ||
      (pair.v1.startsWith('graphql-api/') && pair.v1 !== 'graphql-api/overview')
    )
      continue;
    const v1 = legacyById.get(pair.v1);
    const v2 = currentById.get(pair.v2);
    if (!v1 || !v2)
      throw new Error(
        `Version equivalence points to an unshipped page: ${pair.v1} ↔ ${pair.v2}`,
      );
    rows.push(
      `| [${cell(v1.frontMatter.title)}](${v1.route}) | [${cell(v2.frontMatter.title)}](${v2.route}) |`,
    );
  }
  return '| V1 page | V2 page |\n| --- | --- |\n' + rows.join('\n');
}
function replaceBlocks(source, render) {
  const markers = [
    ...source.matchAll(/\{\/\* generated:(start\s+([^\s]+)|end) \*\/\}/g),
  ];
  const replacements = [];
  for (let i = 0; i < markers.length; i += 2) {
    const start = markers[i];
    const end = markers[i + 1];
    if (!start[1].startsWith('start ') || !end || end[1] !== 'end')
      throw new Error('Unpaired or nested generated block markers');
    const content = render(start[2]);
    replacements.push([
      start.index + start[0].length,
      end.index,
      `\n\n${content}\n\n`,
    ]);
  }
  let text = source;
  for (const [start, end, content] of replacements.reverse())
    text = text.slice(0, start) + content + text.slice(end);
  return { text, blocks: replacements.length };
}
function syncGeneratedBlocks({
  root = path.resolve(__dirname, '..'),
  write = false,
  files = [],
} = {}) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'static/intuition-release.json'), 'utf8'),
  );
  const current = readDocs(root, versions.current);
  const legacy = readDocs(root, versions.v1);
  const pairs = JSON.parse(
    fs.readFileSync(
      path.join(root, 'src/data/version-equivalents.json'),
      'utf8',
    ),
  ).pairs;
  const render = (name) => {
    if (name === 'release-pins') return releasePins(manifest);
    if (name === 'version-equivalents')
      return versionEquivalents(pairs, current, legacy);
    throw new Error(`Unknown generated block: ${name}`);
  };
  const selected = new Set(files.map((file) => path.resolve(root, file)));
  for (const file of selected)
    if (!current.some((doc) => doc.absolutePath === file))
      throw new Error(`--file must name an existing V2 page: ${file}`);
  const errors = [];
  let blocks = 0;
  for (const doc of current.filter(
    (doc) => !selected.size || selected.has(doc.absolutePath),
  )) {
    try {
      const result = replaceBlocks(doc.content, render);
      blocks += result.blocks;
      if (result.text !== doc.content) {
        if (write) fs.writeFileSync(doc.absolutePath, result.text);
        else
          errors.push(
            `${doc.relativePath}: Generated block drift; run sync-generated-blocks.js --write`,
          );
      }
    } catch (error) {
      errors.push(`${doc.relativePath}: ${error.message}`);
    }
  }
  return { errors, blocks };
}
if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const files = [];
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--file' && args[i + 1]) files.push(args[++i]);
      else if (!['--check', '--write'].includes(args[i]))
        throw new Error(`Unknown argument: ${args[i]}`);
    }
    if (args.includes('--write') && args.includes('--check'))
      throw new Error('Choose --write or --check');
    const result = syncGeneratedBlocks({
      write: args.includes('--write'),
      files,
    });
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
      process.exitCode = 1;
    } else
      console.log(
        `${args.includes('--write') ? 'Synced' : 'Verified'} ${result.blocks} generated blocks.`,
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  releasePins,
  versionEquivalents,
  replaceBlocks,
  syncGeneratedBlocks,
};
