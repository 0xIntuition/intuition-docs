'use strict';

const fs = require('node:fs');
const path = require('node:path');

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const file = path.join(root, entry.name);
      return entry.isDirectory() ? walkFiles(file) : entry.isFile() ? [file] : [];
    });
}

function frontMatterBlock(content) {
  return content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
}

// V2 deliberately uses flat scalars and single-line JSON arrays. V1 retains its
// original scalar metadata; unrelated nested YAML does not affect route parsing.
function parseFrontMatter(content) {
  const block = frontMatterBlock(content);
  const result = {};
  if (!block) return result;
  const lines = block[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^([\w-]+):\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    let value = raw;
    if (/^[|>][-+]?$/.test(raw)) {
      const parts = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) parts.push(lines[++i].trim());
      value = parts.join(raw[0] === '>' ? ' ' : '\n');
    } else if (raw.startsWith('[') || raw.startsWith('{') || raw.startsWith('"')) {
      try { value = JSON.parse(raw); } catch { /* Retain malformed values for validators. */ }
    } else if (raw.startsWith("'") && raw.endsWith("'")) {
      value = raw.slice(1, -1).replace(/''/g, "'");
    } else if (raw === 'true' || raw === 'false') {
      value = raw === 'true';
    } else if (raw === 'null') {
      value = null;
    }
    result[key] = value;
  }
  return result;
}

function stripNumberPrefix(segment) {
  if (/^\d+[-_.]\d+/.test(segment)) return segment;
  return segment.replace(/^\d+\s*[-_.]+\s*([^-_.\s].*)$/, '$1');
}

function normalizeRoute(route) {
  const normalized = path.posix.normalize(`/${route}`).replace(/\/{2,}/g, '/');
  return normalized === '/' ? normalized : normalized.replace(/\/$/, '');
}

// Mirrors plugin-content-docs 3.9.2 docs.js + slug.js: frontmatter ids are
// directory-relative; absolute slugs are version-relative, even /docs/foo.
// index, README and a file matching its parent directory are category indexes.
function docMetadata(relativePath, content, version) {
  const relative = relativePath.replace(/\\/g, '/');
  const frontMatter = parseFrontMatter(content);
  const block = frontMatterBlock(content);
  const extension = path.posix.extname(relative);
  const filename = path.posix.basename(relative, extension);
  const sourceDir = path.posix.dirname(relative);
  const parsePrefixes = frontMatter.parse_number_prefixes !== false;
  const dir = sourceDir === '.' ? '' : sourceDir.split('/').map((s) => parsePrefixes ? stripNumberPrefix(s) : s).join('/');
  const baseId = frontMatter.id ?? (parsePrefixes ? stripNumberPrefix(filename) : filename);
  if (typeof baseId !== 'string' || baseId.includes('/')) throw new Error(`Invalid doc id in ${relative}: ${baseId}`);
  const id = [dir, baseId].filter(Boolean).join('/');
  const indexNames = ['index', 'readme', path.posix.basename(sourceDir).toLowerCase()];
  const slug = frontMatter.slug;
  let suffix;
  if (typeof slug === 'string' && slug.startsWith('/')) suffix = slug;
  else if (!slug && indexNames.includes(filename.toLowerCase())) suffix = dir;
  else suffix = path.posix.join(dir, slug ?? baseId);
  return {
    id,
    route: normalizeRoute(`${version.routeBase}/${suffix}`),
    relativePath: relative,
    frontMatter,
    frontMatterRaw: block ? block[1] : '',
    body: block ? content.slice(block[0].length) : content,
    content,
  };
}

function readDocs(rootDir, version) {
  const docsDir = path.resolve(rootDir, version.docsDir);
  return walkFiles(docsDir)
    .filter((file) => /\.mdx?$/.test(file))
    // Docusaurus GlobExcludeDefault skips partials and hidden path segments.
    .filter((file) => !path.relative(docsDir, file).split(path.sep).some((part) => /^[_.]/.test(part)))
    .map((absolutePath) => ({
      ...docMetadata(path.relative(docsDir, absolutePath), fs.readFileSync(absolutePath, 'utf8'), version),
      absolutePath,
    }));
}

module.exports = { walkFiles, parseFrontMatter, docMetadata, readDocs, normalizeRoute };
