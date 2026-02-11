#!/usr/bin/env node
'use strict';

/**
 * Internal Link Validator for Intuition Docs
 *
 * Scans source files for internal /docs/ links and validates them against
 * the actual docs directory structure + configured redirects.
 *
 * Usage:
 *   node scripts/validate-internal-links.js              # scan all files
 *   node scripts/validate-internal-links.js file1 file2  # scan specific files (pre-commit)
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs', '_data');

// ---------------------------------------------------------------------------
// 1. Build a set of valid /docs/… paths from the file system
// ---------------------------------------------------------------------------

function walkDir(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function normalizeDocPath(docPath) {
  if (!docPath) return '/docs';
  let normalized = docPath.replace(/\\/g, '/');
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  normalized = normalized.replace(/\/+/g, '/');
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};

  const frontMatter = {};
  const lines = match[1].split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2].trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    frontMatter[key] = value;
  }

  return frontMatter;
}

function resolveDocRoute({ dirPath, basename, frontMatter }) {
  const fmId = frontMatter.id ? String(frontMatter.id).trim() : '';
  const fmSlug = frontMatter.slug ? String(frontMatter.slug).trim() : '';

  if (fmSlug) {
    if (fmSlug.startsWith('/docs/')) {
      return normalizeDocPath(fmSlug);
    }
    if (fmSlug.startsWith('/')) {
      return normalizeDocPath(`/docs${fmSlug}`);
    }
    if (dirPath) {
      return normalizeDocPath(`/docs/${dirPath}/${fmSlug}`);
    }
    return normalizeDocPath(`/docs/${fmSlug}`);
  }

  // Docusaurus keeps directory index routes at /docs/<dir> even when frontmatter id is set.
  if (basename === 'index') {
    return dirPath ? normalizeDocPath(`/docs/${dirPath}`) : '/docs';
  }

  const routeSegment = fmId || basename;

  if (dirPath) {
    return normalizeDocPath(`/docs/${dirPath}/${routeSegment}`);
  }
  return normalizeDocPath(`/docs/${routeSegment}`);
}

function buildValidPaths() {
  const validPaths = new Set();
  const files = walkDir(DOCS_DIR);
  const docIdToRoute = new Map();
  const categoryFiles = [];

  // Add /docs root (index.md in docs/_data/)
  validPaths.add('/docs');

  for (const file of files) {
    const rel = path.relative(DOCS_DIR, file);
    const basename = path.basename(rel);
    const ext = path.extname(rel).toLowerCase();

    if (basename === '_category_.json') {
      categoryFiles.push(file);
      continue;
    }

    if (ext !== '.md' && ext !== '.mdx') continue;

    // Skip files starting with _
    if (basename.startsWith('_')) continue;

    const withoutExt = rel.replace(/\.(md|mdx)$/, '');
    const parts = withoutExt.split(path.sep);
    const dirPath = parts.slice(0, -1).join('/');
    const baseNameNoExt = parts[parts.length - 1];
    const content = fs.readFileSync(file, 'utf-8');
    const frontMatter = parseFrontMatter(content);

    const docRoute = resolveDocRoute({
      dirPath,
      basename: baseNameNoExt,
      frontMatter,
    });
    validPaths.add(docRoute);

    // Register several doc id forms for _category_.json link.type === "doc" resolution.
    const pathId = withoutExt.split(path.sep).join('/');
    docIdToRoute.set(pathId, docRoute);
    if (baseNameNoExt === 'index' && dirPath) {
      docIdToRoute.set(dirPath, docRoute);
    }

    const fmId = frontMatter.id ? String(frontMatter.id).trim() : '';
    if (fmId) {
      docIdToRoute.set(fmId, docRoute);
      if (dirPath) {
        docIdToRoute.set(`${dirPath}/${fmId}`, docRoute);
      }
    }
  }

  // Only generated-index category pages create a new routable /docs/<dir> path.
  // link.type === "doc" points at an existing doc route, not /docs/<dir>.
  for (const categoryFile of categoryFiles) {
    let category;
    try {
      category = JSON.parse(fs.readFileSync(categoryFile, 'utf-8'));
    } catch {
      continue;
    }

    const rel = path.relative(DOCS_DIR, categoryFile);
    const dirPath = path.dirname(rel).split(path.sep).join('/');
    const categoryRoute = normalizeDocPath(`/docs/${dirPath}`);
    const linkType = category?.link?.type;
    const linkId = category?.link?.id;

    if (linkType === 'generated-index') {
      validPaths.add(categoryRoute);
      continue;
    }

    if (linkType === 'doc' && typeof linkId === 'string') {
      const linkedDocRoute = docIdToRoute.get(linkId);
      if (linkedDocRoute) {
        validPaths.add(linkedDocRoute);
      }
    }
  }

  return validPaths;
}

// ---------------------------------------------------------------------------
// 2. Parse active redirects from docusaurus.config.js
// ---------------------------------------------------------------------------

function parseRedirects() {
  const redirectTargets = new Set();
  const configPath = path.join(ROOT, 'docusaurus.config.js');
  const configContent = fs.readFileSync(configPath, 'utf-8');

  // Remove block comments (/* ... */) to skip commented-out redirects
  const noBlockComments = configContent.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove line comments (// ...)
  const noComments = noBlockComments.replace(/\/\/.*$/gm, '');

  // Match "from:" values in redirect configs
  const fromRegex = /from:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = fromRegex.exec(noComments)) !== null) {
    redirectTargets.add(match[1]);
  }

  return redirectTargets;
}

// ---------------------------------------------------------------------------
// 3. Extract internal /docs/ links from source files
// ---------------------------------------------------------------------------

/**
 * Remove code blocks and comments from content so we don't flag links
 * that appear inside examples or commented-out code.
 */
function stripCodeAndComments(content, filePath) {
  const ext = path.extname(filePath);

  if (ext === '.md' || ext === '.mdx') {
    // Remove fenced code blocks (``` ... ```)
    content = content.replace(/```[\s\S]*?```/g, '');
    // Remove inline code (`...`)
    content = content.replace(/`[^`\n]+`/g, '');
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
  }

  if (ext === '.jsx' || ext === '.tsx' || ext === '.js' || ext === '.ts') {
    // Remove block comments (/* ... */)
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove line comments (// ...)
    content = content.replace(/\/\/.*$/gm, '');
    // Remove template literal code blocks and backtick strings that contain example code
    content = content.replace(/`[\s\S]*?`/g, '');
  }

  if (ext === '.html') {
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
  }

  return content;
}

/**
 * Extract all internal /docs/... links from file content.
 * Returns array of { link, line } objects.
 */
function extractLinks(rawContent, filePath) {
  const content = stripCodeAndComments(rawContent, filePath);
  const links = [];
  const lines = content.split('\n');

  // llms.txt files use full URLs like https://docs.intuition.systems/docs/...
  const isLlmsTxt = path.basename(filePath) === 'llms.txt';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Patterns that capture /docs/... paths:
    // 1. Markdown: [text](/docs/...)
    // 2. href="/docs/..."  or  href='/docs/...'
    // 3. to="/docs/..."    or  to='/docs/...'
    // 4. link: '/docs/...' or  link: "/docs/..."
    // 5. Markdown href in MDX: href="/docs/..."  (already covered by #2)
    const patterns = [
      /\]\(\s*(\/docs\/[^)\s#?"]*)/g,          // markdown links
      /href=["'](\/docs\/[^"'#?]*)/g,          // href attributes
      /to=["'](\/docs\/[^"'#?]*)/g,            // Docusaurus Link to=
      /link:\s*["'](\/docs\/[^"'#?]*)/g,       // data array link:
      /href=\{["'](\/docs\/[^"'#?]*)/g,        // JSX href={"/docs/..."}
    ];

    // llms.txt uses full URLs: [text](https://docs.intuition.systems/docs/...)
    if (isLlmsTxt) {
      patterns.push(
        /\]\(https:\/\/docs\.intuition\.systems(\/docs[^)\s#?"]*)/g,
      );
    }

    for (const pattern of patterns) {
      let m;
      while ((m = pattern.exec(line)) !== null) {
        let link = m[1];
        // Remove trailing slash
        link = link.replace(/\/$/, '');
        links.push({ link, line: i + 1 });
      }
    }
  }

  return links;
}

// ---------------------------------------------------------------------------
// 4. Determine which files to scan
// ---------------------------------------------------------------------------

function getFilesToScan(specificFiles) {
  if (specificFiles && specificFiles.length > 0) {
    // Pre-commit mode: only scan the provided files
    return specificFiles.map(f => path.resolve(f));
  }

  // Full scan mode: scan all relevant file types
  const globs = [
    { dir: path.join(ROOT, 'docs', '_data'), exts: ['.md', '.mdx'] },
    { dir: path.join(ROOT, 'src', 'components'), exts: ['.jsx', '.tsx'] },
    { dir: path.join(ROOT, 'src', 'pages'), exts: ['.jsx', '.tsx'] },
    { dir: path.join(ROOT, 'src', 'snippets'), exts: ['.html'] },
  ];

  const files = [];
  for (const { dir, exts } of globs) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walkDir(dir)) {
      if (exts.includes(path.extname(file))) {
        files.push(file);
      }
    }
  }

  // Also scan llms.txt for full-URL doc links
  const llmsTxt = path.join(ROOT, 'static', 'llms.txt');
  if (fs.existsSync(llmsTxt)) {
    files.push(llmsTxt);
  }

  return files;
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);

  // Build valid paths and redirects
  const validPaths = buildValidPaths();
  const redirects = parseRedirects();

  // Merge redirects into valid paths (a redirect "from" is a valid URL)
  for (const r of redirects) {
    validPaths.add(r);
  }

  const files = getFilesToScan(args.length > 0 ? args : null);
  const errors = [];

  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content, file);

    for (const { link, line } of links) {
      if (!validPaths.has(link)) {
        const relFile = path.relative(ROOT, file);
        errors.push({ file: relFile, line, link });
      }
    }
  }

  if (errors.length === 0) {
    console.log(`\u2705 All internal links are valid (scanned ${files.length} files)`);
    process.exit(0);
  }

  console.error(`\u274C Found ${errors.length} broken internal link(s):\n`);
  for (const { file, line, link } of errors) {
    console.error(`  ${file}:${line} \u2192 ${link}`);
  }
  console.error('');
  process.exit(1);
}

main();
