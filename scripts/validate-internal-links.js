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

function buildValidPaths() {
  const validPaths = new Set();
  const files = walkDir(DOCS_DIR);

  // Add /docs root (index.md in docs/_data/)
  validPaths.add('/docs');

  for (const file of files) {
    const rel = path.relative(DOCS_DIR, file);
    const ext = path.extname(rel);

    // Directories with _category_.json get auto-generated category index pages
    if (path.basename(rel) === '_category_.json') {
      const dirPath = '/docs/' + path.dirname(rel).split(path.sep).join('/');
      if (dirPath !== '/docs/.') {
        validPaths.add(dirPath);
      }
      continue;
    }

    if (ext !== '.md' && ext !== '.mdx') continue;

    // Skip files starting with _
    if (path.basename(rel).startsWith('_')) continue;

    const withoutExt = rel.replace(/\.(md|mdx)$/, '');
    const parts = withoutExt.split(path.sep);

    // /docs/getting-started/overview → from docs/_data/getting-started/overview.md
    const docPath = '/docs/' + parts.join('/');
    validPaths.add(docPath);

    // Index files also serve as directory paths:
    // docs/_data/intuition-network/index.md → /docs/intuition-network
    const basename = parts[parts.length - 1];
    if (basename === 'index') {
      validPaths.add('/docs/' + parts.slice(0, -1).join('/'));
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
