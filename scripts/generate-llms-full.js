#!/usr/bin/env node
'use strict';

/**
 * Generate llms.txt, llms-full.txt, and llms-medium.txt from each configured documentation tree.
 *
 * Produces structured text files with cleaned content, correct canonical
 * Docusaurus URLs (frontmatter-aware), and metadata where appropriate.
 *
 * Usage:
 *   node scripts/generate-llms-full.js --version all # both versions (default)
 *   node scripts/generate-llms-full.js --version v1  # one version
 *   node scripts/generate-llms-full.js --full-only    # only llms-full.txt
 *   node scripts/generate-llms-full.js --medium-only  # only llms-medium.txt
 *   node scripts/generate-llms-full.js --index-only   # only llms.txt
 *   node scripts/generate-llms-full.js --version current --stdout # one full bundle
 *
 * V2 code preservation follows the site's Markdown grammar; V1 serialization
 * retains its frozen behavior.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { versions, getVersion } = require('../docs-versions.config');
const { readDocs, normalizeRoute } = require('./lib/docs-tree');

const ROOT = path.resolve(__dirname, '..');
const V1_TIMESTAMPS_PATH = path.join(__dirname, 'llms-v1-last-updated.json');
const BASE_URL = 'https://docs.intuition.systems';
const LLMS_ARTIFACT_PATHS = new Set(
  Object.values(versions).flatMap((version) =>
    ['llms.txt', 'llms-medium.txt', 'llms-full.txt'].map(
      (name) => new URL(llmsUrl(version, name)).pathname,
    ),
  ),
);
// The curated source already ends with an `## Optional` section, so the
// directory is emitted inside it rather than under a second heading.
const INDEX_DIRECTORY_INTRO =
  'Complete directory: every authored documentation page, one line each.';
const ROUTE_EXCLUSION_LIST = Object.freeze({
  categoryShellBasenames: Object.freeze(['_category_.json']),
  internalDirectoryNames: Object.freeze(['_hidden', 'partials']),
});

// ---------------------------------------------------------------------------
// URL utilities (routes and metadata come from the shared docs reader)
// ---------------------------------------------------------------------------

function isEligibleDocFile(file, version = versions.current, rootDir = ROOT) {
  const relativeParts = path
    .relative(path.resolve(rootDir, version.docsDir), file)
    .split(path.sep);
  const basename = relativeParts[relativeParts.length - 1];
  const ext = path.extname(basename).toLowerCase();

  // Category shells and internal helpers are routes or source fragments, not content pages.
  if (ROUTE_EXCLUSION_LIST.categoryShellBasenames.includes(basename))
    return false;
  if (basename.startsWith('_')) return false;
  if (
    relativeParts.some((part) =>
      ROUTE_EXCLUSION_LIST.internalDirectoryNames.includes(part),
    )
  ) {
    return false;
  }
  return ext === '.md' || ext === '.mdx';
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
  let normalized = normalizeRoute(routePath);
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
  const rel = path.relative(routeMaps.docsDir, targetPath);
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

  return (
    routeMaps.routeByLowerSourcePath.get(relWithoutExt.toLowerCase()) || null
  );
}

function resolveContentUrl(
  href,
  { pageUrl = BASE_URL, sourceFile = '', routeMaps = null } = {},
) {
  const trimmed = String(href || '').trim();
  if (!trimmed) return href;
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }

  const { pathPart, suffix } = splitLinkTarget(trimmed);

  if (trimmed.startsWith('#')) {
    return `${pageUrl}${trimmed}`;
  }

  // Static agent bundles are not authored document routes.
  if (LLMS_ARTIFACT_PATHS.has(pathPart)) {
    return `${BASE_URL}${pathPart}${suffix}`;
  }

  if (
    routeMaps &&
    Object.values(versions).some((version) =>
      isWithinRoute(pathPart, version.routeBase),
    )
  ) {
    const route = resolveDocRoutePath(pathPart, routeMaps);
    return route ? `${BASE_URL}${route}${suffix}` : null;
  }

  if (/^\.{1,2}\//.test(pathPart) && routeMaps) {
    const route = resolveSourceRelativeDocRoute(
      pathPart,
      sourceFile,
      routeMaps,
    );
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
  const quoted = attrs.match(
    new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, 'i'),
  );
  if (quoted) return quoted[1];

  const braced = attrs.match(
    new RegExp(`\\b${name}\\s*=\\s*\\{["']([^"']+)["']\\}`, 'i'),
  );
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

function isWithinRoute(route, base) {
  return route === base || route.startsWith(`${base}/`);
}

// ---------------------------------------------------------------------------
// Title & description extraction
// ---------------------------------------------------------------------------

function extractTitle(frontMatter, body, filePath) {
  const h1Match = body.match(/^#\s+(.+)$/m);
  const bodyTitle = h1Match ? h1Match[1].trim() : '';
  const frontMatterTitle = frontMatter.title
    ? String(frontMatter.title).trim()
    : '';

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
    if (trimmed.startsWith('import ') || trimmed.startsWith('export '))
      continue;
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
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Git last_updated extraction (batch for performance)
// ---------------------------------------------------------------------------

function getLastUpdatedMap(version = versions.current, rootDir = ROOT) {
  if (version.name === 'v1') {
    // Frozen provenance is captured from the source tree before the snapshot move.
    return new Map(
      Object.entries(JSON.parse(fs.readFileSync(V1_TIMESTAMPS_PATH, 'utf8'))),
    );
  }
  const map = new Map();
  try {
    const output = execFileSync(
      'git',
      ['log', '--format=%aI', '--name-only', '--', version.docsDir],
      {
        cwd: rootDir,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    const prefix = `${version.docsDir}/`;
    let currentDate = '';
    for (const line of output.split('\n')) {
      const trimmed = line.trim();
      if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) currentDate = trimmed;
      else if (trimmed.startsWith(prefix)) {
        const relative = trimmed.slice(prefix.length);
        if (!map.has(relative)) map.set(relative, currentDate);
      }
    }
  } catch {
    // Current docs may be generated from an archive without git history.
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

/**
 * Convert MDX component structure into useful plain Markdown.
 *
 * Content-bearing wrappers are unwrapped instead of discarded. Tabs receive
 * headings derived from their labels so variants remain distinguishable after
 * the interactive UI is removed. BrowserOnly is intentionally discarded
 * because the current documentation uses it only for executable diagram
 * renderers, which do not have meaningful static child content.
 */
function serializeMdxComponents(content) {
  let serialized = content;

  // BrowserOnly currently wraps executable Excalidraw render functions. Drop
  // these blocks explicitly so JSX expressions do not leak into Markdown.
  serialized = serialized.replace(
    /^[ \t]*<BrowserOnly\b[^>]*>[\s\S]*?<\/BrowserOnly>\s*$/gm,
    '',
  );

  const output = [];
  const tabHeadingLevels = [];
  let lastMarkdownHeadingLevel = 1;

  for (const line of serialized.split('\n')) {
    const trimmed = line.trim();

    if (/^<Tabs\b[^>]*>$/.test(trimmed)) {
      const parentLevel = tabHeadingLevels.length
        ? tabHeadingLevels[tabHeadingLevels.length - 1]
        : lastMarkdownHeadingLevel;
      tabHeadingLevels.push(Math.min(parentLevel + 1, 6));
      continue;
    }

    if (/^<\/Tabs>$/.test(trimmed)) {
      tabHeadingLevels.pop();
      continue;
    }

    const tabItemMatch = trimmed.match(/^<TabItem\b([^>]*)>$/);
    if (tabItemMatch) {
      const label =
        getHtmlAttribute(tabItemMatch[1], 'label') ||
        getHtmlAttribute(tabItemMatch[1], 'value');
      if (label) {
        const headingLevel = tabHeadingLevels.length
          ? tabHeadingLevels[tabHeadingLevels.length - 1]
          : Math.min(lastMarkdownHeadingLevel + 1, 6);
        output.push(`${'#'.repeat(headingLevel)} ${textFromHtml(label)}`);
      }
      continue;
    }

    if (/^<\/TabItem>$/.test(trimmed)) {
      continue;
    }

    // React fragments and named Fragment wrappers carry structure only.
    if (/^(?:<>|<\/>)$/.test(trimmed)) {
      continue;
    }

    if (/^<Fragment\b[^>]*>$/.test(trimmed) || /^<\/Fragment>$/.test(trimmed)) {
      continue;
    }

    // A self-closing component has no child prose to preserve.
    if (/^<[A-Z][A-Za-z0-9_.]*\b[^>]*\/>$/.test(trimmed)) {
      continue;
    }

    // Unknown paired components are treated as presentation wrappers. Strip
    // standalone tags but retain their children to avoid silent content loss.
    if (
      /^<[A-Z][A-Za-z0-9_.]*\b[^>]*>$/.test(trimmed) ||
      /^<\/[A-Z][A-Za-z0-9_.]*>$/.test(trimmed)
    ) {
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+/);
    if (headingMatch && tabHeadingLevels.length === 0) {
      lastMarkdownHeadingLevel = headingMatch[1].length;
    }

    output.push(line);
  }

  return output.join('\n');
}

function cleanContent(
  body,
  title,
  {
    stripCodeBlocks = false,
    pageUrl = BASE_URL,
    sourceFile = '',
    routeMaps = null,
    packages = [],
    manifest = null,
    version = 'v1',
  } = {},
) {
  let content = body;
  const linkContext = { pageUrl, sourceFile, routeMaps };

  // Pass 0: Handle fenced code blocks
  const codeBlocks = [];
  const protectCode = (match) => {
    if (stripCodeBlocks) {
      return ''; // Remove entirely for medium output
    }
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `__CODE_BLOCK_${idx}__`;
  };
  if (version === 'current') {
    const { parseMarkdownCode } = require('./lib/markdown-fences');
    const parsed = parseMarkdownCode(content, {
      filePath: sourceFile || 'document.md',
    });
    content = parsed.source;
    for (const fence of [...parsed.fences].reverse()) {
      const replacement = protectCode(content.slice(fence.start, fence.end));
      content =
        content.slice(0, fence.start) + replacement + content.slice(fence.end);
    }
  } else {
    content = content.replace(/^([ \t]*```[\s\S]*?^[ \t]*```)/gm, protectCode);
  }

  // Resolve package metadata before presentation-only components are removed.
  // Fences are protected, so a literal JSX example is never rewritten.
  if (version === 'current')
    content = content.replace(/<AppliesTo\s*\/>/g, () =>
      appliesToMarkdown(packages, manifest),
    );

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
    },
  );
  content = content.replace(
    /^[ \t]*<h([1-6])\b[^>]*>(.*?)<\/h\1>[ \t]*$/gim,
    (_, level, text) => {
      const heading = textFromHtml(text);
      return heading ? `${'#'.repeat(Number(level))} ${heading}` : '';
    },
  );
  content = content.replace(
    /^[ \t]*<img\b([^>]*)\/?>[ \t]*$/gim,
    (_, attrs) => {
      const src = getHtmlAttribute(attrs, 'src');
      if (!src) return '';
      const alt = textFromHtml(getHtmlAttribute(attrs, 'alt'));
      const resolved = resolveContentUrl(src, linkContext);
      return resolved ? `![${alt}](${resolved})` : alt;
    },
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
    },
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
    },
  );

  // Pass 8: Remove MDX presentation structure while preserving useful child
  // content and labels.
  content = serializeMdxComponents(content);

  // Pass 9: Remove inline style objects: style={{ ... }}
  content = content.replace(/style=\{\{[\s\S]*?\}\}/g, '');

  // Pass 11: Remove JSX event handlers and React-specific attributes
  content = content.replace(
    /\s+(onClick|onChange|onSubmit|onError|onLoad|className|htmlFor|tabIndex|aria-\w+)=\{[^}]*\}/g,
    '',
  );
  content = content.replace(
    /\s+(onClick|onChange|onSubmit|onError|onLoad|className|htmlFor)="[^"]*"/g,
    '',
  );

  // Pass 12: Remove lines that are clearly JSX/React artifacts
  content = content.replace(
    /^[ \t]*(className=|<div|<\/div>|<span|<\/span>|<button|<\/button>|<input\b|<\/input>|<p[ >]|<\/p>|<a\s|<\/a>|<ul|<\/ul>|<li|<\/li>|<table|<\/table>|<thead|<\/thead>|<tbody|<\/tbody>|<tr|<\/tr>|<th|<\/th>|<td|<\/td>).*$/gm,
    '',
  );

  // Pass 13: Remove Docusaurus/MDX admonition wrappers (keep content)
  content = content.replace(/^:::.*$/gm, '');

  // Pass 14: Remove remaining inline HTML tags but keep text content.
  content = content.replace(
    /<\/?(?:div|span|p|br|img|a|ul|ol|li|table|thead|tbody|tr|th|td|strong|em|b|i|code|pre|blockquote|section|article|header|footer|nav|main|aside|details|summary|figure|figcaption|sup|sub|mark|small|del|ins|abbr|cite|q|dfn|kbd|samp|var|time|ruby|rt|rp|bdi|bdo|wbr|hr|h[1-6])\b[^>]*\/?>/gi,
    '',
  );

  // Pass 15: Remove empty JSX fragments and closings
  content = content.replace(/^[ \t]*[<>{}()]+[ \t]*$/gm, '');

  // Pass 16: Remove lines with only Docusaurus CSS variables
  content = content.replace(/^.*var\(--ifm[^)]*\).*$/gm, '');

  // Pass 17: Strip markdown links that point to local filesystem paths.
  content = content.replace(
    /\[([^\]]+)\]\((\/Users\/[^)\s]+|[A-Za-z]:[\\/][^)]+|file:\/\/[^)\s]+)\)/g,
    '$1',
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
      (normalizeTitleText(h1Match[1]).includes(normalizeTitleText(title)) ||
        normalizeTitleText(title).includes(normalizeTitleText(h1Match[1])))
    ) {
      content = content.slice(h1Match[0].length).trim();
    }
  }

  // Preserve a single page-level H1 emitted by the formatter; demote any
  // remaining body H1s so heading-based chunkers don't treat them as page starts.
  content = content.replace(/^#\s+/gm, '## ');

  content = qualifyGenericReferenceHeadings(content, title);

  // Normalize prose before restoring the exact V2 code (including blank lines).
  if (version === 'current')
    content = content.replace(/\n{3,}/g, '\n\n').trim();

  // Pass 19: Restore preserved code blocks
  if (!stripCodeBlocks) {
    content = content.replace(/__CODE_BLOCK_(\d+)__/g, (_, idx) => {
      return codeBlocks[parseInt(idx, 10)];
    });
  }

  return version === 'current'
    ? content
    : content.replace(/\n{3,}/g, '\n\n').trim();
}

// ---------------------------------------------------------------------------
// Section parsing — shared across output formats
// ---------------------------------------------------------------------------

function buildDocRouteMaps(records, version, rootDir = ROOT, allRecords) {
  const routeBySourcePath = new Map();
  const routeByLowerSourcePath = new Map();
  const routeByLowerCase = new Map();
  const validRoutes = new Set();

  // Body cross-links can intentionally lead to either version. Source sections
  // themselves still come exclusively from the selected tree.
  for (const record of allRecords ??
    Object.values(versions).flatMap((entry) => readDocs(rootDir, entry))) {
    validRoutes.add(record.route);
    routeByLowerCase.set(record.route.toLowerCase(), record.route);
  }
  for (const record of records) {
    const sourcePath = record.relativePath.replace(/\.(md|mdx)$/i, '');
    routeBySourcePath.set(sourcePath, record.route);
    routeByLowerSourcePath.set(sourcePath.toLowerCase(), record.route);
    routeByLowerCase.set(record.route.toLowerCase(), record.route);
    validRoutes.add(record.route);
  }
  return {
    docsDir: path.resolve(rootDir, version.docsDir),
    routeBySourcePath,
    routeByLowerSourcePath,
    routeByLowerCase,
    validRoutes,
  };
}

function parseSections(versionName = 'current', { rootDir = ROOT } = {}) {
  const version =
    typeof versionName === 'string' ? getVersion(versionName) : versionName;
  const lastUpdatedMap = getLastUpdatedMap(version, rootDir);
  const records = readDocs(rootDir, version).filter((record) =>
    isEligibleDocFile(record.absolutePath, version, rootDir),
  );
  const routeMaps = buildDocRouteMaps(records, version, rootDir);
  const manifest = version.isDefault ? readManifest(rootDir) : null;

  return records.map((record) => {
    const {
      id,
      route,
      relativePath,
      absolutePath: sourceFile,
      frontMatter,
      body,
    } = record;
    const url = `${BASE_URL}${route}`;
    const title = extractTitle(frontMatter, body, sourceFile);
    const description = extractDescription(frontMatter, body);
    const lastUpdated = lastUpdatedMap.get(relativePath) || '';
    if (version.name === 'v1' && !lastUpdated) {
      throw new Error(`Missing frozen V1 last_updated for ${relativePath}`);
    }
    const context = {
      pageUrl: url,
      sourceFile,
      routeMaps,
      version: version.name,
      packages: frontMatter.packages || [],
      manifest,
    };
    return {
      id,
      title,
      description,
      url,
      route,
      relativePath,
      sourceFile,
      lastUpdated,
      frontMatter,
      contentFull: cleanContent(body, title, context),
      contentMedium: cleanContent(body, title, {
        ...context,
        stripCodeBlocks: true,
      }),
    };
  });
}

// ---------------------------------------------------------------------------
// Output formatters
// ---------------------------------------------------------------------------

function readManifest(rootDir = ROOT) {
  const file = path.join(rootDir, 'static/intuition-release.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function appliesToMarkdown(packages, manifest) {
  if (!packages.length) return '';
  const pins = new Map(
    (manifest?.packages || []).map((pkg) => [pkg.name, pkg.version]),
  );
  const labels = packages.map((name) => {
    if (!pins.has(name)) throw new Error(`Missing AppliesTo version: ${name}`);
    return `\`${name}\` ${pins.get(name)}`;
  });
  return `Applies to V2 · ${labels.join(' · ')}${manifest.status.includes('alpha') ? ' · pre-release' : ''}`;
}

// The curated head can also link to release sources, discovery files and assets.
function markdownDocLinks(markdown, routes) {
  return markdown.replace(
    /(\]\(<?)((?:https?:\/\/|\/)[^\s<>)]+)/g,
    (match, prefix, href) => {
      const url = new URL(href, BASE_URL);
      const route = url.pathname.replace(/\/$/, '');
      if (url.origin !== BASE_URL || !routes.has(route)) return match;
      return `${prefix}${BASE_URL}${route}.md${url.search}${url.hash}`;
    },
  );
}

function readCuratedIndexSource(version = versions.current, options = {}) {
  const source = fs.readFileSync(
    path.join(ROOT, version.llmsIndexSource),
    'utf-8',
  );
  const withHeader = version.isDefault
    ? source.replace(
        '<!-- version-header -->',
        generateHeader(version, 'index', options).trimEnd(),
      )
    : source;
  return withHeader.replace(/<!--[\s\S]*?-->\r?\n?/g, '');
}

function generateIndexTxt(sections, version = versions.current, options = {}) {
  const routes = new Set(
    Object.values(versions).flatMap((entry) =>
      readDocs(options.rootDir ?? ROOT, entry).map((doc) => doc.route),
    ),
  );
  const curated = markdownDocLinks(
    readCuratedIndexSource(version, options),
    routes,
  );
  // Route sorting makes the generated directory deterministic across file-system walks.
  const directory = [...sections]
    .sort((a, b) => (a.route < b.route ? -1 : a.route > b.route ? 1 : 0))
    .map((section) => `- [${section.title}](${section.url}.md)`)
    .join('\n');

  return `${curated}\n${INDEX_DIRECTORY_INTRO}\n\n${directory}\n`;
}

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

function llmsUrl(version, name = 'llms.txt') {
  const relative = path
    .relative(versions.current.llmsDir, version.llmsDir)
    .split(path.sep)
    .join('/');
  return `${BASE_URL}/${relative ? `${relative}/` : ''}${name}`;
}

function versionScope(version) {
  return version.name === 'v1'
    ? 'V1 covers the `intuition-ts` packages and `intuition-rs` services.'
    : 'V2 covers the packages in the release manifest and Intuition Core.';
}

function generateHeader(version, format = 'index', { manifest } = {}) {
  if (version.isDefault && manifest === undefined) manifest = readManifest();
  const suffix =
    format === 'full'
      ? ' — full text'
      : format === 'medium'
        ? ' — condensed'
        : '';
  const other = Object.values(versions).find(
    (entry) => entry.name !== version.name,
  );
  const lines = [
    `# Intuition Docs (${version.label})${suffix}`,
    '',
    `Version: ${version.label}`,
    `Scope: ${versionScope(version)}`,
  ];
  if (version.isDefault) {
    if (manifest) {
      if (
        manifest.source?.repository !==
          'https://github.com/0xIntuition/packages' ||
        !/^[a-f0-9]{40}$/.test(manifest.source?.commit || '') ||
        manifest.core?.repository !==
          'https://github.com/0xIntuition/intuition-core' ||
        manifest.core?.distribution !== 'source' ||
        !/^[a-f0-9]{40}$/.test(manifest.core?.commit || '')
      )
        throw new Error(
          'V2 llms metadata requires immutable package and Core source revisions',
        );
      lines.push(
        `Package source: ${manifest.source.repository}/tree/${manifest.source.commit}`,
        `Core source revision: ${manifest.core.repository}/tree/${manifest.core.commit}`,
      );
    } else {
      lines.push(
        'The V2 packages are published as stable npm releases and Intuition Core is a release candidate.',
      );
    }
  }
  lines.push(`Other versions: ${other.label} — ${llmsUrl(other)}`);
  return lines.join('\n') + '\n';
}

function generateFullTxt(sections, version = versions.current, options = {}) {
  const preamble = `${generateHeader(version, 'full', options)}
Prefer the curated index at ${llmsUrl(version)}, then fetch specific pages or chunk this file by page sections. Each page section starts with a single H1 followed by a \`Source:\` line.
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

function generateMediumTxt(sections, version = versions.current, options = {}) {
  const preamble = `${generateHeader(version, 'medium', options)}
Condensed reference with metadata and prose, without code examples. For full content with code, see ${llmsUrl(version, 'llms-full.txt')}. For curated navigation, see ${llmsUrl(version)}.
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

function selectedVersions(args) {
  const flag = args.indexOf('--version');
  const name = flag === -1 ? 'all' : args[flag + 1];
  if (!['current', 'v1', 'all'].includes(name)) {
    throw new Error('--version must be current, v1, or all');
  }
  return name === 'all' ? Object.values(versions) : [getVersion(name)];
}

function main() {
  const args = process.argv.slice(2);
  const selected = selectedVersions(args);
  const toStdout = args.includes('--stdout');
  if (toStdout && selected.length !== 1) {
    throw new Error('--stdout requires --version current or --version v1');
  }
  const fullOnly = args.includes('--full-only');
  const mediumOnly = args.includes('--medium-only');
  const indexOnly = args.includes('--index-only');
  const outputs = [
    ['llms-full.txt', generateFullTxt, !indexOnly && (!mediumOnly || fullOnly)],
    [
      'llms-medium.txt',
      generateMediumTxt,
      !indexOnly && (!fullOnly || mediumOnly),
    ],
    ['llms.txt', generateIndexTxt, indexOnly || (!fullOnly && !mediumOnly)],
  ];
  for (const version of selected) {
    const sections = parseSections(version);
    if (!sections.length)
      throw new Error(`No authored pages found for ${version.label}`);
    if (toStdout) {
      process.stdout.write(generateFullTxt(sections, version));
      continue;
    }
    const outputDir = path.join(ROOT, version.llmsDir);
    fs.mkdirSync(outputDir, { recursive: true });
    for (const [filename, generate, enabled] of outputs) {
      if (!enabled) continue;
      const outputPath = path.join(outputDir, filename);
      fs.writeFileSync(outputPath, generate(sections, version), 'utf8');
      console.log(
        `Generated ${outputPath} (${sections.length} ${version.label} pages, ${Math.round(fs.statSync(outputPath).size / 1024)}KB)`,
      );
    }
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  cleanContent,
  parseSections,
  serializeMdxComponents,
  BASE_URL,
  INDEX_DIRECTORY_INTRO,
  ROUTE_EXCLUSION_LIST,
  generateIndexTxt,
  generateFullTxt,
  generateMediumTxt,
  generateHeader,
  versionScope,
  llmsUrl,
  selectedVersions,
  getLastUpdatedMap,
  getEligibleSections: parseSections,
  isEligibleDocFile,
  readCuratedIndexSource,
  markdownDocLinks,
  readManifest,
  appliesToMarkdown,
  buildDocRouteMaps,
};
