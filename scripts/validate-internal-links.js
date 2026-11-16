#!/usr/bin/env node
'use strict';

// Resolve links from the same version table and route helper as the site.
const fs = require('node:fs');
const path = require('node:path');
const { versions } = require('../docs-versions.config');
const { redirects, createRedirects } = require('../redirects.config');
const { readDocs, walkFiles, normalizeRoute } = require('./lib/docs-tree');
const { createSlugger } = require('@docusaurus/utils');
const ROOT = path.resolve(__dirname, '..');
const LLMS_FILES = ['llms.txt', 'llms-medium.txt', 'llms-full.txt'];

function buildValidPaths(root = ROOT) {
  const paths = new Set();
  for (const version of Object.values(versions)) {
    for (const doc of readDocs(root, version)) paths.add(doc.route);
    const categorySlugger = createSlugger();
    for (const file of walkFiles(path.join(root, version.docsDir)).filter(
      (entry) => path.basename(entry) === '_category_.json',
    )) {
      const category = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (category.link?.type !== 'generated-index') continue;
      // Native generated index metadata uses its explicit slug when provided.
      const slug =
        category.link.slug ??
        `/category/${categorySlugger.slug(category.label)}`;
      paths.add(normalizeRoute(`${version.routeBase}/${slug}`));
    }
    for (const filename of LLMS_FILES) {
      if (fs.existsSync(path.join(root, version.llmsDir, filename)))
        paths.add(
          `/${path.posix.join(version.llmsDir.replace(/^static\/?/, ''), filename)}`,
        );
    }
  }
  for (const route of [...paths])
    for (const source of createRedirects(route) || []) paths.add(source);
  for (const { from } of redirects)
    for (const source of Array.isArray(from) ? from : [from]) paths.add(source);
  return paths;
}
function stripCodeAndComments(content, file) {
  if (/\.mdx?$/.test(file)) {
    return content
      .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '')
      .replace(/`[^`\n]+`/g, '')
      .replace(/<!--[\s\S]*?-->/g, '');
  }
  // Preserve URLs and literal destinations; comments are not rendered links.
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}
function extractLinks(source, file) {
  const content = stripCodeAndComments(source, file);
  const matches = [];
  const patterns = [
    /\]\(\s*<?([^\s<>)]*)/g,
    /^\s*\[[^\]\n]+\]:\s*<?([^\s<>]*)/gm,
    /\b(?:href|to|link)\s*(?:=|:)\s*\{?\s*["'`]([^"'`\r\n]*)["'`]/g,
    /^(?:Source|source):\s*["']?([^\s"']+)/gm,
  ];
  for (const pattern of patterns)
    for (const match of content.matchAll(pattern)) {
      let target = match[1];
      if (target.startsWith('https://docs.intuition.systems/'))
        target = new URL(target).pathname;
      target = target.split(/[?#]/, 1)[0].replace(/\/$/, '');
      if (
        target === versions.current.routeBase ||
        target.startsWith(`${versions.current.routeBase}/`)
      )
        matches.push({
          link: target,
          line: content.slice(0, match.index).split('\n').length,
        });
    }
  return matches;
}
function getFilesToScan(specificFiles = [], root = ROOT) {
  if (specificFiles.length)
    return specificFiles.map((file) => path.resolve(root, file));
  const files = Object.values(versions).flatMap((version) =>
    readDocs(root, version).map((doc) => doc.absolutePath),
  );
  files.push(
    ...walkFiles(path.join(root, 'src')).filter((file) =>
      /\.(?:[cm]?[jt]sx?|html)$/.test(file),
    ),
  );
  for (const version of Object.values(versions))
    for (const name of LLMS_FILES)
      files.push(path.join(root, version.llmsDir, name));
  return files;
}
function run({ root = ROOT, files = [] } = {}) {
  const paths = buildValidPaths(root);
  const targets = getFilesToScan(files, root);
  const errors = [];
  for (const file of targets) {
    if (!fs.existsSync(file)) {
      errors.push(`${path.relative(root, file)}: missing input`);
      continue;
    }
    for (const { link, line } of extractLinks(
      fs.readFileSync(file, 'utf8'),
      file,
    ))
      if (!paths.has(link))
        errors.push(`${path.relative(root, file)}:${line} → ${link}`);
  }
  return { errors, count: targets.length };
}
if (require.main === module) {
  try {
    const result = run({ files: process.argv.slice(2) });
    if (result.errors.length) throw new Error(result.errors.join('\n'));
    console.log(
      `All internal links valid: ${result.count} files across both versions and six llms outputs.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  LLMS_FILES,
  buildValidPaths,
  extractLinks,
  getFilesToScan,
  run,
};
