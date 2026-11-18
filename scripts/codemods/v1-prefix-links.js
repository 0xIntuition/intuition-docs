#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../../docs-versions.config');
const { legacyRedirects } = require('../../redirects.config');
const { walkFiles } = require('../lib/docs-tree');
const ROOT = path.resolve(__dirname, '../..');
const redirectMap = new Map(legacyRedirects.map(({ from, to }) => [from, to]));

function isWithin(target, base) {
  return target === base || target.startsWith(`${base}/`) || target.startsWith(`${base}?`) || target.startsWith(`${base}#`);
}

function rewriteTarget(target) {
  if (!isWithin(target, versions.current.routeBase) || isWithin(target, versions.v1.routeBase)) return target;
  const suffixStart = target.search(/[?#]/);
  const pathname = suffixStart === -1 ? target : target.slice(0, suffixStart);
  const suffix = suffixStart === -1 ? '' : target.slice(suffixStart);
  return (redirectMap.get(pathname) ?? `${versions.v1.routeBase}${pathname.slice(versions.current.routeBase.length)}`) + suffix;
}

function findTargets(content, { allLiterals = false } = {}) {
  // Capture only destinations, preserving the surrounding markdown/JSX bytes.
  const patterns = [
    /\]\(\s*<?([^\s<>)]*)/g,
    /^\s*\[[^\]\n]+\]:\s*<?([^\s<>]*)/gm,
    /\b(?:href|to|link)\s*(?:=|:)\s*\{?\s*["'`]([^"'`\r\n]*)["'`]/g,
    /<(\/[^<>\s]+)>/g,
  ];
  if (allLiterals) patterns.push(/["'`](\/[^"'`\r\n]*)["'`]/g);
  const targets = new Map();
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      const target = match[1];
      if (!isWithin(target, versions.current.routeBase)) continue;
      const index = match.index + match[0].indexOf(target);
      targets.set(index, { target, index, length: target.length });
    }
  }
  return [...targets.values()].sort((a, b) => a.index - b.index);
}

function transformContent(content) {
  let transformed = content;
  for (const { target, index, length } of findTargets(content).reverse()) {
    transformed = transformed.slice(0, index) + rewriteTarget(target) + transformed.slice(index + length);
  }
  return transformed;
}

function checkContent(content, { version = 'v1', launchRoutes = new Set(), excludeNoscript = false } = {}) {
  const checked = excludeNoscript ? content.replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/g, '') : content;
  return findTargets(checked, { allLiterals: version !== 'v1' }).filter(({ target }) => {
    if (isWithin(target, versions.v1.routeBase)) return false;
    if (version === 'v1') return true;
    const route = target.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
    return route !== versions.current.routeBase && !launchRoutes.has(route);
  });
}

function run({ root = ROOT, check = false } = {}) {
  const snapshotDir = path.join(root, versions.v1.docsDir);
  if (!fs.existsSync(snapshotDir)) throw new Error(`Missing V1 snapshot: ${snapshotDir}`);
  const snapshotFiles = walkFiles(snapshotDir).filter((file) => /\.(?:mdx?|json)$/.test(file));
  const failures = [];
  let changed = 0;
  for (const file of snapshotFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (check) {
      for (const { target } of checkContent(content)) failures.push(`${path.relative(root, file)}: ${target}`);
    } else {
      const next = transformContent(content);
      if (next !== content) { fs.writeFileSync(file, next); changed++; }
    }
  }
  if (check) {
    const launchFile = path.join(root, 'scripts/v2-launch-routes.txt');
    const launchRoutes = new Set(fs.readFileSync(launchFile, 'utf8').split(/\r?\n/).filter((line) => line && !line.startsWith('#')).map((line) => line.split(/\s+/)[0]));
    for (const file of walkFiles(path.join(root, 'src')).filter((file) => /\.(?:[cm]?[jt]sx?|html|mdx?)$/.test(file))) {
      for (const { target } of checkContent(fs.readFileSync(file, 'utf8'), {
        version: 'src', launchRoutes, excludeNoscript: path.relative(root, file).replace(/\\/g, '/') === 'src/pages/index.jsx',
      })) failures.push(`${path.relative(root, file)}: ${target}`);
    }
  }
  return { changed, failures };
}

if (require.main === module) {
  try {
    const result = run({ check: process.argv.includes('--check') });
    if (result.failures.length) throw new Error(result.failures.join('\n'));
    console.log(process.argv.includes('--check') ? 'V1 and src link targets: 0 invalid targets.' : `Rewrote V1 links in ${result.changed} files.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { rewriteTarget, transformContent, findTargets, checkContent, run };
