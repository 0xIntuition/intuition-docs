#!/usr/bin/env node
'use strict';

/**
 * Generate llms-full.txt and llms-medium.txt from all docs/_data/ markdown files.
 *
 * Produces structured text files with cleaned content, correct canonical
 * Docusaurus URLs (frontmatter-aware), and metadata where appropriate.
 *
 * Usage:
 *   node scripts/generate-llms-full.js              # generate both output files
 *   node scripts/generate-llms-full.js --full-only   # only llms-full.txt
 *   node scripts/generate-llms-full.js --medium-only  # only llms-medium.txt
 *   node scripts/generate-llms-full.js --stdout       # print llms-full.txt to stdout
 *
 * Zero external dependencies — uses only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs', '_data');
const STATIC_DIR = path.join(ROOT, 'static');
const BASE_URL = 'https://docs.intuition.systems';

// ---------------------------------------------------------------------------
// Utilities (mirrored from validate-internal-links.js)
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

function absolutizeUrl(href, pageUrl = BASE_URL) {
  const trimmed = String(href || '').trim();
  if (!trimmed) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  try {
    return new URL(trimmed, pageUrl || BASE_URL).toString();
  } catch {
    return href;
  }
}

function splitLinkTarget(href) {
  const match = String(href || '').match(/^([^?#]*)([?#][\s\S]*)?$/);
  return {
    pathPart: match ? match[1] : String(href || ''),
    suffix: match?.[2] || '',
  };
}

function normalizeRoutePath(routePath) {
  let normalized = normalizeDocPath(routePath);
  normalized = normalized.replace(/\.(md|mdx)$/i, '');
  return normalized;
}

function resolveDocRoutePath(routePath, routeMaps) {
  const normalized = normalizeRoutePath(routePath);
  if (routeMaps.validRoutes.has(normalized)) {
    return normalized;
  }

  const lowerMatch = routeMaps.routeByLowerCase.get(normalized.toLowerCase());
  if (lowerMatch) {
    return lowerMatch;
  }

  return null;
}

function resolveSourceRelativeDocRoute(hrefPath, sourceFile, routeMaps) {
  if (!sourceFile || !hrefPath) return null;

  const targetPath = path.resolve(path.dirname(sourceFile), hrefPath);
  const rel = path.relative(DOCS_DIR, targetPath);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }

  const relWithoutExt = rel
    .replace(/\.(md|mdx)$/i, '')
    .split(path.sep)
    .join('/');

  const route = routeMaps.routeBySourcePath.get(relWithoutExt);
  if (route) {
    return route;
  }

  return routeMaps.routeByLowerSourcePath.get(relWithoutExt.toLowerCase()) || null;
}

function resolveContentUrl(href, { pageUrl = BASE_URL, sourceFile = '', routeMaps = null } = {}) {
  const trimmed = String(href || '').trim();
  if (!trimmed) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  const { pathPart, suffix } = splitLinkTarget(trimmed);

  if (trimmed.startsWith('#')) {
    return `${pageUrl}${trimmed}`;
  }

  if (pathPart.startsWith('/docs') && routeMaps) {
    const route = resolveDocRoutePath(pathPart, routeMaps);
    return route ? `${BASE_URL}${route}${suffix}` : null;
  }

  if (/^\.{1,2}\//.test(pathPart) && routeMaps) {
    const route = resolveSourceRelativeDocRoute(pathPart, sourceFile, routeMaps);
    if (route) {
      return `${BASE_URL}${route}${suffix}`;
    }

    if (!path.extname(pathPart) || /\.(md|mdx)$/i.test(pathPart)) {
      return null;
    }
  }

  return absolutizeUrl(trimmed, pageUrl);
}

function getHtmlAttribute(attrs, name) {
  const quoted = attrs.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'));
  if (quoted) return quoted[1];

  const braced = attrs.match(new RegExp(`\\b${name}\\s*=\\s*\\{["']([^"']+)["']\\}`, 'i'));
  if (braced) return braced[1];

  return '';
}

function textFromHtml(value) {
  return String(value || '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\{[^}]*\}/g, '')
    .replace(/(^|\s)#{1,6}\s+/g, '$1')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { attributes: {}, body: content };

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

  const body = content.slice(match[0].length);
  return { attributes: frontMatter, body };
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

  if (basename === 'index') {
    return dirPath ? normalizeDocPath(`/docs/${dirPath}`) : '/docs';
  }

  const routeSegment = fmId || basename;

  if (dirPath) {
    return normalizeDocPath(`/docs/${dirPath}/${routeSegment}`);
  }
  return normalizeDocPath(`/docs/${routeSegment}`);
}

// ---------------------------------------------------------------------------
// Title & description extraction
// ---------------------------------------------------------------------------

function extractTitle(frontMatter, body, filePath) {
  const h1Match = body.match(/^#\s+(.+)$/m);
  const bodyTitle = h1Match ? h1Match[1].trim() : '';
  const frontMatterTitle = frontMatter.title ? String(frontMatter.title).trim() : '';

  if (frontMatterTitle && bodyTitle) {
    const normalizedFrontMatter = normalizeTitleText(frontMatterTitle);
    const normalizedBody = normalizeTitleText(bodyTitle);

    if (normalizedFrontMatter.includes(normalizedBody)) {
      return frontMatterTitle;
    }
    if (normalizedBody.includes(normalizedFrontMatter)) {
      return bodyTitle;
    }
    return frontMatterTitle;
  }

  if (frontMatterTitle) {
    return frontMatterTitle;
  }

  if (h1Match) {
    return bodyTitle;
  }

  const basename = path.basename(filePath, path.extname(filePath));
  if (basename === 'index') {
    const parentDir = path.basename(path.dirname(filePath));
    return titleCase(parentDir);
  }
  return titleCase(basename);
}

function normalizeTitleText(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function extractDescription(frontMatter, body) {
  // 1. Frontmatter description
  if (frontMatter.description) {
    return frontMatter.description;
  }

  // 2. First non-heading, non-empty paragraph from body
  const lines = body.split('\n');
  let paragraph = '';
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines, headings, imports, JSX, frontmatter artifacts
    if (!trimmed) {
      if (paragraph) break; // end of first paragraph
      continue;
    }
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('import ') || trimmed.startsWith('export ')) continue;
    if (trimmed.startsWith('<') || trimmed.startsWith('{')) continue;
    if (trimmed.startsWith('---')) continue;
    if (trimmed.startsWith('```')) break;
    paragraph += (paragraph ? ' ' : '') + trimmed;
  }

  if (paragraph) {
    // Truncate to ~200 chars at word boundary
    if (paragraph.length > 200) {
      const cut = paragraph.lastIndexOf(' ', 200);
      return paragraph.slice(0, cut > 100 ? cut : 200) + '...';
    }
    return paragraph;
  }

  return '';
}

function titleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Git last_updated extraction (batch for performance)
// ---------------------------------------------------------------------------

function getLastUpdatedMap() {
  const map = new Map();
  try {
    // Get last commit date for all files in docs/_data in one git call
    const output = execSync(
      'git log --format="%aI" --name-only -- docs/_data/',
      { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );

    let currentDate = '';
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // ISO date line
      if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
        currentDate = trimmed;
        continue;
      }

      // File path line — only record the FIRST (most recent) date per file
      if (trimmed.startsWith('docs/_data/') && !map.has(trimmed)) {
        map.set(trimmed, currentDate);
      }
    }
  } catch {
    // Git not available or not a repo — skip last_updated
  }
  return map;
}

// ---------------------------------------------------------------------------
// Content cleaning — multi-pass JSX/MDX stripping
// ---------------------------------------------------------------------------

function qualifyGenericReferenceHeadings(content, pageTitle) {
  const genericHeadings = new Set([
    'Parameters',
    'Returns',
    'Example',
    'Query Structure',
  ]);
  const headingStack = new Map();
  if (pageTitle) {
    headingStack.set(1, pageTitle);
  }

  return content
    .split('\n')
    .map((line) => {
      const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
      if (!match) return line;

      const level = match[1].length;
      const heading = match[2].trim();

      for (const existingLevel of [...headingStack.keys()]) {
        if (existingLevel >= level) {
          headingStack.delete(existingLevel);
        }
      }

      if (!genericHeadings.has(heading)) {
        headingStack.set(level, heading);
        return line;
      }

      let parent = '';
      for (let parentLevel = level - 1; parentLevel >= 1; parentLevel--) {
        const candidate = headingStack.get(parentLevel);
        if (candidate && !genericHeadings.has(candidate)) {
          parent = candidate;
          break;
        }
      }

      const qualified = parent ? `${parent} - ${heading}` : heading;
      headingStack.set(level, qualified);
      return `${match[1]} ${qualified}`;
    })
    .join('\n');
}

function cleanContent(
  body,
  title,
  { stripCodeBlocks = false, pageUrl = BASE_URL, sourceFile = '', routeMaps = null } = {}
) {
  let content = body;
  const linkContext = { pageUrl, sourceFile, routeMaps };

  // Pass 0: Handle fenced code blocks
  const codeBlocks = [];
  content = content.replace(/^([ \t]*```[\s\S]*?^[ \t]*```)/gm, (match) => {
    if (stripCodeBlocks) {
      return ''; // Remove entirely for medium output
    }
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${idx}__`;
  });

  // Pass 1: Remove import/export statements
  content = content.replace(/^(import|export)\s+.*$/gm, '');

  // Pass 2: Remove JSX comments {/* ... */} (single and multi-line)
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

  // Pass 3: Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Pass 4: Remove markdown horizontal rules from exported body content.
  content = content.replace(/^[ \t]*---[ \t]*$/gm, '');

  // Pass 5: Convert simple HTML/MDX elements to markdown where the text matters.
  content = content.replace(
    /^[ \t]*<h([1-6])\b[^>]*>\s*\r?\n([^\n]+?)\r?\n[ \t]*<\/h\1>[ \t]*$/gim,
    (_, level, text) => {
      const heading = textFromHtml(text);
      return heading ? `${'#'.repeat(Number(level))} ${heading}` : '';
    }
  );
  content = content.replace(
    /^[ \t]*<h([1-6])\b[^>]*>(.*?)<\/h\1>[ \t]*$/gim,
    (_, level, text) => {
      const heading = textFromHtml(text);
      return heading ? `${'#'.repeat(Number(level))} ${heading}` : '';
    }
  );
  content = content.replace(
    /^[ \t]*<img\b([^>]*)\/?>[ \t]*$/gim,
    (_, attrs) => {
      const src = getHtmlAttribute(attrs, 'src');
      if (!src) return '';
      const alt = textFromHtml(getHtmlAttribute(attrs, 'alt'));
      const resolved = resolveContentUrl(src, linkContext);
      return resolved ? `![${alt}](${resolved})` : alt;
    }
  );
  content = content.replace(
    /<a\b([^>]*)>([\s\S]*?)<\/a>/gim,
    (_, attrs, text) => {
      const href = getHtmlAttribute(attrs, 'href');
      const label = textFromHtml(text);
      if (!href) return label;
      const resolved = resolveContentUrl(href, linkContext);
      if (!resolved) return label;
      return label ? `[${label}](${resolved})` : '';
    }
  );
  content = content.replace(/<br\s*\/?>/gi, '\n');

  // Pass 6: Drop decorative SVG markup before generic tag stripping.
  content = content.replace(/^[ \t]*<svg\b[\s\S]*?<\/svg>[ \t]*$/gim, '');
  content = content.replace(/^[ \t]*<(?:svg|path)\b[^>]*\/?>[ \t]*$/gim, '');

  // Pass 7: Absolutize markdown links and images outside code fences.
  content = content.replace(
    /(!?)\[([^\]\n]*)\]\(((?:\/(?!\/)|\.{1,2}\/|#)[^)\s]*)\)/g,
    (match, imagePrefix, label, href) => {
      const resolved = resolveContentUrl(href, linkContext);
      if (!resolved) {
        return imagePrefix ? label : label;
      }
      return `${imagePrefix}[${label}](${resolved})`;
    }
  );

  // Pass 8: Remove self-closing JSX components: <Component ... />
  content = content.replace(
    /^[ \t]*<[A-Z][A-Za-z]*\b[^>]*\/>\s*$/gm,
    ''
  );

  // Pass 9: Remove multi-line JSX blocks (opening + children + closing)
  for (let i = 0; i < 5; i++) {
    const before = content;
    content = content.replace(
      /^[ \t]*<([A-Z][A-Za-z]*)\b[^>]*>[\s\S]*?<\/\1>\s*$/gm,
      ''
    );
    if (content === before) break;
  }

  // Pass 10: Remove inline style objects: style={{ ... }}
  content = content.replace(/style=\{\{[\s\S]*?\}\}/g, '');

  // Pass 11: Remove JSX event handlers and React-specific attributes
  content = content.replace(/\s+(onClick|onChange|onSubmit|onError|onLoad|className|htmlFor|tabIndex|aria-\w+)=\{[^}]*\}/g, '');
  content = content.replace(/\s+(onClick|onChange|onSubmit|onError|onLoad|className|htmlFor)="[^"]*"/g, '');

  // Pass 12: Remove lines that are clearly JSX/React artifacts
  content = content.replace(
    /^[ \t]*(className=|<div|<\/div>|<span|<\/span>|<button|<\/button>|<input\b|<\/input>|<p[ >]|<\/p>|<a\s|<\/a>|<ul|<\/ul>|<li|<\/li>|<table|<\/table>|<thead|<\/thead>|<tbody|<\/tbody>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>).*$/gm,
    ''
  );

  // Pass 13: Remove Docusaurus/MDX admonition wrappers (keep content)
  content = content.replace(/^:::.*$/gm, '');

  // Pass 14: Remove remaining inline HTML tags but keep text content.
  content = content.replace(/<\/?(?:div|span|p|br|img|a|ul|ol|li|table|thead|tbody|tr|th|td|strong|em|b|i|code|pre|blockquote|section|article|header|footer|nav|main|aside|details|summary|figure|figcaption|sup|sub|mark|small|del|ins|abbr|cite|q|dfn|kbd|samp|var|time|ruby|rt|rp|bdi|bdo|wbr|hr|h[1-6])\b[^>]*\/?>/gi, '');

  // Pass 15: Remove empty JSX fragments and closings
  content = content.replace(/^[ \t]*[<>{}()]+[ \t]*$/gm, '');

  // Pass 16: Remove lines with only Docusaurus CSS variables
  content = content.replace(/^.*var\(--ifm[^)]*\).*$/gm, '');

  // Pass 17: Strip markdown links that point to local filesystem paths.
  content = content.replace(
    /\[([^\]]+)\]\((\/Users\/[^)\s]+|[A-Za-z]:[\\/][^)]+|file:\/\/[^)\s]+)\)/g,
    '$1'
  );

  // Pass 18: Collapse excessive blank lines (3+ -> 2)
  content = content.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  content = content.trim();

  // Remove leading H1 if it duplicates the section title
  if (title) {
    const h1Pattern = /^#\s+(.+)\n*/;
    const h1Match = content.match(h1Pattern);
    if (
      h1Match &&
      (
        normalizeTitleText(h1Match[1]).includes(normalizeTitleText(title)) ||
        normalizeTitleText(title).includes(normalizeTitleText(h1Match[1]))
      )
    ) {
      content = content.slice(h1Match[0].length).trim();
    }
  }

  // Preserve a single page-level H1 emitted by the formatter; demote any
  // remaining body H1s so heading-based chunkers don't treat them as page starts.
  content = content.replace(/^#\s+/gm, '## ');

  content = qualifyGenericReferenceHeadings(content, title);

  // Pass 19: Restore preserved code blocks
  if (!stripCodeBlocks) {
    content = content.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
      return codeBlocks[parseInt(idx, 10)];
    });
  }

  content = content.replace(/\n{3,}/g, '\n\n').trim();

  return content;
}

// ---------------------------------------------------------------------------
// Section parsing — shared across output formats
// ---------------------------------------------------------------------------

function buildDocRouteMaps(docFiles) {
  const routeByFile = new Map();
  const routeBySourcePath = new Map();
  const routeByLowerSourcePath = new Map();
  const routeByLowerCase = new Map();
  const validRoutes = new Set(['/docs']);

  for (const file of docFiles) {
    const rel = path.relative(DOCS_DIR, file);
    const basename = path.basename(rel);
    const ext = path.extname(rel).toLowerCase();
    if (ext !== '.md' && ext !== '.mdx') continue;
    if (basename.startsWith('_')) continue;

    const withoutExt = rel.replace(/\.(md|mdx)$/i, '');
    const parts = withoutExt.split(path.sep);
    const dirPath = parts.slice(0, -1).join('/');
    const baseNameNoExt = parts[parts.length - 1];
    const content = fs.readFileSync(file, 'utf-8');
    const { attributes: frontMatter } = parseFrontMatter(content);
    const route = resolveDocRoute({
      dirPath,
      basename: baseNameNoExt,
      frontMatter,
    });
    const sourcePath = withoutExt.split(path.sep).join('/');

    routeByFile.set(file, route);
    routeBySourcePath.set(sourcePath, route);
    routeByLowerSourcePath.set(sourcePath.toLowerCase(), route);
    routeByLowerCase.set(route.toLowerCase(), route);
    validRoutes.add(route);
  }

  return {
    routeByFile,
    routeBySourcePath,
    routeByLowerSourcePath,
    routeByLowerCase,
    validRoutes,
  };
}

function parseSections() {
  const lastUpdatedMap = getLastUpdatedMap();

  const allFiles = walkDir(DOCS_DIR);
  const docFiles = allFiles
    .filter((f) => {
      const basename = path.basename(f);
      const ext = path.extname(f).toLowerCase();
      if (ext !== '.md' && ext !== '.mdx') return false;
      if (basename.startsWith('_')) return false;
      if (f.includes('/_hidden/') || f.includes('/partials/')) return false;
      return true;
    })
    .sort();

  const routeMaps = buildDocRouteMaps(docFiles);
  const sections = [];

  for (const file of docFiles) {
    const rawContent = fs.readFileSync(file, 'utf-8');
    const { attributes: frontMatter, body } = parseFrontMatter(rawContent);

    const rel = path.relative(DOCS_DIR, file);
    const withoutExt = rel.replace(/\.(md|mdx)$/, '');
    const parts = withoutExt.split(path.sep);
    const dirPath = parts.slice(0, -1).join('/');
    const baseNameNoExt = parts[parts.length - 1];

    const route = routeMaps.routeByFile.get(file) || resolveDocRoute({
      dirPath,
      basename: baseNameNoExt,
      frontMatter,
    });

    const url = `${BASE_URL}${route}`;
    const title = extractTitle(frontMatter, body, file);
    const description = extractDescription(frontMatter, body);

    // Get last_updated from git
    const gitKey = `docs/_data/${rel}`;
    const lastUpdated = lastUpdatedMap.get(gitKey) || '';

    // Clean content (full version — preserves code blocks)
    const cleanedFull = cleanContent(body, title, {
      pageUrl: url,
      sourceFile: file,
      routeMaps,
    });

    // Clean content (medium version — strips code blocks)
    const cleanedMedium = cleanContent(body, title, {
      stripCodeBlocks: true,
      pageUrl: url,
      sourceFile: file,
      routeMaps,
    });

    // Skip files with very little content
    const nonEmptyLines = cleanedFull
      .split('\n')
      .filter((l) => l.trim().length > 0);
    if (nonEmptyLines.length < 3) {
      continue;
    }

    sections.push({
      title,
      description,
      url,
      route,
      lastUpdated,
      contentFull: cleanedFull,
      contentMedium: cleanedMedium,
    });
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Output formatters
// ---------------------------------------------------------------------------

function formatMetadataBlock({ title, description, url, lastUpdated }) {
  let block = '---\n';
  block += `title: "${title.replace(/"/g, '\\"')}"\n`;
  if (description) {
    block += `description: "${description.replace(/"/g, '\\"')}"\n`;
  }
  if (lastUpdated) {
    block += `last_updated: "${lastUpdated}"\n`;
  }
  block += `source: "${url}"\n`;
  block += '---';
  return block;
}

function generateFullTxt(sections) {
  const preamble = `# Intuition Protocol - Complete Documentation

> This file contains comprehensive documentation for the Intuition protocol, including all guides, API references, and technical documentation.

Intuition is a permissionless protocol for creating verifiable, tokenized attestations on a Layer 3 blockchain. Developers build context-aware applications using semantic triples (subject-predicate-object relationships) backed by economic incentives through bonding curves.

## Key Concepts

- **Atoms**: Universal identifiers for any entity, concept, or piece of data — the nodes in the knowledge graph
- **Triples**: Subject-predicate-object claims connecting atoms — the edges in the knowledge graph
- **Signals**: Staked conviction (deposits/redemptions) on atoms and triples — the weights in the knowledge graph

## Routing Guide

- SDK docs: ${BASE_URL}/docs/intuition-sdk/
- GraphQL API: ${BASE_URL}/docs/graphql-api/
- Smart Contracts: ${BASE_URL}/docs/intuition-smart-contracts/
- Protocol package: ${BASE_URL}/docs/protocol/
- Tutorials: ${BASE_URL}/docs/tutorials/
- Core concepts: ${BASE_URL}/docs/intuition-concepts/

For a curated index of the most important pages, see: ${BASE_URL}/llms.txt

Because this file is large, agents should prefer ${BASE_URL}/llms.txt first, then fetch specific pages or chunk this file by page sections. Each page section starts with a single H1 followed by a \`Source:\` line.
`;

  const body = sections
    .map((s) => {
      return `# ${s.title}\n\nSource: ${s.url}\n\n${s.contentFull}`;
    })
    .join('\n\n');

  return preamble + '\n' + body + '\n';
}

function truncatePreservingStructure(content, maxWords) {
  const lines = content.split('\n');
  const result = [];
  let wordCount = 0;
  let truncated = false;

  for (const line of lines) {
    const lineWords = line.trim().split(/\s+/).filter(Boolean);
    if (wordCount + lineWords.length > maxWords && wordCount > 0) {
      truncated = true;
      break;
    }
    result.push(line);
    wordCount += lineWords.length;
  }

  let output = result.join('\n').trim();
  if (truncated) {
    output += '\n\n[... see full docs for complete content]';
  }
  return output;
}

function generateMediumTxt(sections) {
  const preamble = `# Intuition Protocol - Documentation Summary

> Condensed reference for the Intuition protocol. Each section includes metadata and prose content without code examples. For full content with code, see: ${BASE_URL}/llms-full.txt
> For a curated navigation index, see: ${BASE_URL}/llms.txt

Intuition is a permissionless protocol for creating verifiable, tokenized attestations on a Layer 3 blockchain. The three core primitives are Atoms (universal identifiers), Triples (structured claims), and Signals (staked conviction).
`;

  const body = sections
    .map((s) => {
      const meta = formatMetadataBlock(s);
      // For medium: keep only the first ~100 words, preserving paragraph breaks
      const content = truncatePreservingStructure(s.contentMedium, 100);
      return `${meta}\n\n# ${s.title}\n\n${content}`;
    })
    .join('\n\n');

  return preamble + '\n' + body + '\n';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = process.argv.slice(2);
  const toStdout = args.includes('--stdout');
  const fullOnly = args.includes('--full-only');
  const mediumOnly = args.includes('--medium-only');

  const doFull = !mediumOnly || fullOnly;
  const doMedium = !fullOnly || mediumOnly;

  // Parse all sections once
  const sections = parseSections();

  // Generate llms-full.txt
  if (doFull) {
    const fullContent = generateFullTxt(sections);

    if (toStdout) {
      process.stdout.write(fullContent);
      return;
    }

    const fullPath = path.join(STATIC_DIR, 'llms-full.txt');
    fs.writeFileSync(fullPath, fullContent, 'utf-8');
    const fullSizeKB = Math.round(fs.statSync(fullPath).size / 1024);
    console.log(`Generated ${fullPath} (${sections.length} sections, ${fullSizeKB}KB)`);
  }

  // Generate llms-medium.txt
  if (doMedium) {
    const mediumContent = generateMediumTxt(sections);
    const mediumPath = path.join(STATIC_DIR, 'llms-medium.txt');
    fs.writeFileSync(mediumPath, mediumContent, 'utf-8');
    const mediumSizeKB = Math.round(fs.statSync(mediumPath).size / 1024);
    console.log(`Generated ${mediumPath} (${sections.length} sections, ${mediumSizeKB}KB)`);
  }
}

main();
