'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { versions } = require('../docs-versions.config');

const PLUGIN = 'docusaurus-plugin-content-docs';
const INSTANCE = '_data';

function contentRoute(value) {
  if (
    typeof value !== 'string' ||
    !value.startsWith('/') ||
    value.includes('//') ||
    /[\\?#\u0000-\u001f]/.test(value)
  )
    throw new Error(`Invalid native document route: ${value}`);
  const decoded = decodeURIComponent(value);
  if (
    /[\\\u0000-\u001f]/.test(decoded) ||
    decoded.split('/').some((part) => part === '.' || part === '..') ||
    /%2f/i.test(value)
  )
    throw new Error(`Unsafe native document route: ${value}`);
  return value.replace(/\/+$/, '') || '/';
}

function inside(root, file) {
  const relative = path.relative(root, file);
  return (
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

function outputPath(outDir, route, extension) {
  const file = path.resolve(
    outDir,
    `${contentRoute(route).slice(1)}${extension}`,
  );
  if (!inside(path.resolve(outDir), file))
    throw new Error(`Output escapes build directory: ${route}`);
  // A stale/supplied symlink must not redirect a write outside the build tree.
  for (
    let entry = file;
    entry !== path.resolve(outDir);
    entry = path.dirname(entry)
  ) {
    const stat = fs.lstatSync(entry, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink() || (stat?.isFile() && stat.nlink > 1))
      throw new Error(`Unsafe linked build output: ${route}`);
  }
  return file;
}

function sourcePath(siteDir, source, version) {
  if (
    typeof source !== 'string' ||
    !source.startsWith('@site/') ||
    /[\\\u0000-\u001f]/.test(source)
  )
    throw new Error(`Invalid native document source: ${source}`);
  const docsDir = path.resolve(siteDir, version.docsDir);
  const file = path.resolve(siteDir, source.slice('@site/'.length));
  if (!inside(docsDir, file) || !/\.mdx?$/.test(file))
    throw new Error(`Document source is outside ${version.docsDir}: ${source}`);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile())
    throw new Error(`Missing native document source: ${source}`);
  if (
    !inside(fs.realpathSync(siteDir), fs.realpathSync(file)) ||
    !inside(fs.realpathSync(docsDir), fs.realpathSync(file))
  )
    throw new Error(
      `Document source symlink escapes ${version.docsDir}: ${source}`,
    );
  return file;
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ],
  );
}

function insertAlternate(html, href) {
  // Remove only Markdown alternates, leaving canonical/feeds/translations alone.
  const head = html.match(/<head(?:\s[^>]*)?>[\s\S]*?<\/head\s*>/i);
  if (!head) throw new Error('Document HTML is missing its head');
  const without = head[0].replace(/<link\b[^>]*>/gi, (tag) => {
    const attributes = Object.fromEntries(
      [
        ...tag.matchAll(
          /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s/>]+(?:\/[^\s/>]+)*))/g,
        ),
      ].map((match) => [
        match[1].toLowerCase(),
        match[2] ?? match[3] ?? match[4],
      ]),
    );
    return attributes.rel?.toLowerCase().split(/\s+/).includes('alternate') &&
      attributes.type?.toLowerCase() === 'text/markdown'
      ? ''
      : tag;
  });
  const link = `<link rel="alternate" type="text/markdown" href="${escapeHtml(href)}">`;
  return (
    html.slice(0, head.index) +
    without.replace(/<\/head\s*>$/i, () => link + '</head>') +
    html.slice(head.index + head[0].length)
  );
}

function exportMetadata(doc, version, manifest, baseUrl) {
  const url = `${baseUrl}${doc.route}`;
  const llmsPath = path.posix.join(
    version.llmsDir.replace(/^static\/?/, ''),
    'llms.txt',
  );
  const metadata = {
    title: doc.title,
    description: doc.description,
    url,
    markdown_url: `${url}.md`,
    version: version.label,
    llms_index: `${baseUrl}/${llmsPath}`,
  };
  if (
    typeof metadata.title !== 'string' ||
    typeof metadata.description !== 'string'
  )
    throw new Error(`Missing native title/description: ${doc.id}`);
  if (version.isDefault) {
    const front = doc.frontMatter;
    if (
      typeof front.kind !== 'string' ||
      !Array.isArray(front.reader) ||
      !front.reader.every((reader) => typeof reader === 'string') ||
      !Array.isArray(front.packages)
    )
      throw new Error(`Missing V2 export metadata: ${doc.id}`);
    const pins = new Map(
      (manifest?.packages || []).map((pkg) => [pkg.name, pkg.version]),
    );
    metadata.kind = front.kind;
    metadata.reader = front.reader;
    metadata.packages = front.packages.map((name) => {
      if (!pins.has(name))
        throw new Error(`Missing export package pin: ${name}`);
      return `${name}@${pins.get(name)}`;
    });
    if (doc.id.startsWith('concepts/')) {
      if (
        !Array.isArray(front.depends_on) ||
        !front.depends_on.every(
          (slug) =>
            typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
        )
      )
        throw new Error(`Invalid concept export dependencies: ${doc.id}`);
      metadata.depends_on = front.depends_on.map(
        (slug) => `${baseUrl}${version.routeBase}/concepts/${slug}.md`,
      );
    }
  }
  return metadata;
}

function exportDocuments({
  siteDir,
  outDir,
  loadedVersions,
  globalData,
  siteUrl,
}) {
  // Load lazily: the Markdown parser reads the site configuration as well.
  const { readFrontMatter } = require('../scripts/lib/markdown-fences');
  const {
    cleanContent,
    readManifest,
    buildDocRouteMaps,
  } = require('../scripts/generate-llms-full');
  const nativeVersions = globalData?.[PLUGIN]?.[INSTANCE]?.versions;
  if (!Array.isArray(loadedVersions) || !Array.isArray(nativeVersions))
    throw new Error(
      'Missing native docs content/global data for Markdown export',
    );
  const baseUrl = siteUrl.replace(/\/$/, '');
  const manifest = readManifest(siteDir);
  const records = [];
  const routes = new Set();
  const sources = new Set();
  const expectedVersions = Object.keys(versions);
  if (
    nativeVersions.length !== expectedVersions.length ||
    loadedVersions.length !== expectedVersions.length ||
    expectedVersions.some(
      (name) => !nativeVersions.some((entry) => entry.name === name),
    )
  )
    throw new Error('Native version inventory mismatch');
  for (const nativeVersion of nativeVersions) {
    const version = versions[nativeVersion.name];
    const loaded = loadedVersions.find(
      (item) => item.versionName === nativeVersion.name,
    );
    if (!version || !loaded || !Array.isArray(loaded.docs))
      throw new Error(`Missing native version: ${nativeVersion.name}`);
    const contentDocs = nativeVersion.docs.filter(
      (doc) => !doc.id.startsWith('/'),
    );
    if (contentDocs.length !== loaded.docs.length)
      throw new Error(`Native content count mismatch: ${version.name}`);
    const byId = new Map(loaded.docs.map((doc) => [doc.id, doc]));
    for (const nativeDoc of contentDocs) {
      const doc = byId.get(nativeDoc.id);
      if (!doc)
        throw new Error(
          `Missing native source identity: ${version.name}/${nativeDoc.id}`,
        );
      const route = contentRoute(nativeDoc.path);
      if (contentRoute(doc.permalink) !== route || doc.version !== version.name)
        throw new Error(
          `Native source route/version mismatch: ${nativeDoc.id}`,
        );
      const sourceFile = sourcePath(siteDir, doc.source, version);
      const owner = Object.values(versions)
        .filter(
          (item) =>
            route === item.routeBase || route.startsWith(item.routeBase + '/'),
        )
        .sort((a, b) => b.routeBase.length - a.routeBase.length)[0];
      if (owner !== version)
        throw new Error(`Native route outside version: ${route}`);
      const realSource = fs.realpathSync(sourceFile);
      if (routes.has(route) || sources.has(realSource))
        throw new Error(`Markdown export collision: ${route}`);
      routes.add(route);
      sources.add(realSource);
      const source = fs.readFileSync(sourceFile, 'utf8');
      const frontMatter = readFrontMatter(source);
      const body = source.replace(
        /^\uFEFF?---[^\r\n]*\r?\n[\s\S]*?\r?\n---[^\S\r\n]*(?:\r?\n|$)/,
        '',
      );
      records.push({
        ...doc,
        version,
        route,
        sourceFile,
        relativePath: path
          .relative(path.resolve(siteDir, version.docsDir), sourceFile)
          .split(path.sep)
          .join('/'),
        frontMatter,
        body,
      });
    }
  }
  const maps = new Map(
    Object.values(versions).map((version) => [
      version.name,
      buildDocRouteMaps(
        records.filter((record) => record.version === version),
        version,
        siteDir,
        records,
      ),
    ]),
  );
  // Prepare and validate every output before writing any of them.
  const outputs = records.map((doc) => {
    const metadata = exportMetadata(doc, doc.version, manifest, baseUrl);
    const routeMaps = maps.get(doc.version.name);
    const content = cleanContent(doc.body, doc.title, {
      pageUrl: metadata.url,
      sourceFile: doc.sourceFile,
      routeMaps,
      version: doc.version.name,
      packages: doc.frontMatter.packages || [],
      manifest,
    });
    const markdownFile = outputPath(outDir, doc.route, '.md');
    if (fs.existsSync(path.join(siteDir, 'static', doc.route.slice(1) + '.md')))
      throw new Error(
        `Static file collides with Markdown export: ${doc.route}`,
      );
    if (fs.existsSync(markdownFile)) {
      const previous = readFrontMatter(fs.readFileSync(markdownFile, 'utf8'));
      if (
        previous.markdown_url !== metadata.markdown_url ||
        previous.version !== metadata.version
      )
        throw new Error(
          `Existing file collides with Markdown export: ${doc.route}`,
        );
    }
    const htmlFiles = [
      outputPath(outDir, doc.route, '.html'),
      outputPath(outDir, doc.route, '/index.html'),
    ].filter((file) => fs.existsSync(file) && fs.statSync(file).isFile());
    if (htmlFiles.length !== 1)
      throw new Error(`Missing/ambiguous built HTML: ${doc.route}`);
    return {
      markdownFile,
      htmlFile: htmlFiles[0],
      markdown: `---\n${yaml.dump(metadata, { schema: yaml.JSON_SCHEMA, noRefs: true, lineWidth: -1 })}---\n\n${content}\n`,
      html: insertAlternate(
        fs.readFileSync(htmlFiles[0], 'utf8'),
        metadata.markdown_url,
      ),
    };
  });
  for (const output of outputs) {
    fs.mkdirSync(path.dirname(output.markdownFile), { recursive: true });
    fs.writeFileSync(output.markdownFile, output.markdown);
    fs.writeFileSync(output.htmlFile, output.html);
  }
  return outputs.length;
}

module.exports = function markdownExportPlugin() {
  let loadedVersions;
  return {
    name: 'markdown-export-plugin',
    allContentLoaded({ allContent }) {
      loadedVersions = allContent?.[PLUGIN]?.[INSTANCE]?.loadedVersions;
    },
    postBuild({ siteDir, outDir, generatedFilesDir, siteConfig }) {
      const globalData = JSON.parse(
        fs.readFileSync(
          path.join(generatedFilesDir, 'globalData.json'),
          'utf8',
        ),
      );
      const count = exportDocuments({
        siteDir,
        outDir,
        loadedVersions,
        globalData,
        siteUrl: siteConfig.url,
      });
      console.log(`Exported Markdown for ${count} native content documents.`);
    },
  };
};

Object.assign(module.exports, {
  contentRoute,
  outputPath,
  sourcePath,
  escapeHtml,
  insertAlternate,
  exportMetadata,
  exportDocuments,
});
