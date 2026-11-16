'use strict';

const { createRequire } = require('node:module');
const { createProcessor } = require('@mdx-js/mdx');
const comment = require('@slorber/remark-comment').default;
const frontmatter = require('remark-frontmatter').default;
const matter = require('gray-matter');
const { unwrapMdxCodeBlocks } = require('@docusaurus/utils');
const {
  DEFAULT_MARKDOWN_CONFIG,
} = require('@docusaurus/core/lib/server/configValidation');
const site = require('../../docusaurus.config');
// Use the installed site's syntax plugins and compatibility preprocessing. Keep
// this aligned with Docusaurus 3.9.2 mdx-loader/processor.js when upgrading it.
const loaderRequire = createRequire(require.resolve('@docusaurus/mdx-loader'));
const directive = loaderRequire('remark-directive').default;
const gfm = loaderRequire('remark-gfm').default;
const preprocess = loaderRequire('./preprocessor').default;
const { getFormat } = loaderRequire('./format');
const markdown = {
  ...DEFAULT_MARKDOWN_CONFIG,
  ...site.markdown,
  mdx1Compat: {
    ...DEFAULT_MARKDOWN_CONFIG.mdx1Compat,
    ...site.markdown?.mdx1Compat,
  },
};
const docsOptions = site.presets[0][1].docs;
const processors = new Map();

function processor(format) {
  if (!processors.has(format))
    processors.set(
      format,
      createProcessor({
        format,
        remarkPlugins: [
          ...(docsOptions.beforeDefaultRemarkPlugins || []),
          frontmatter,
          directive,
          gfm,
          // Retaining comments changes only the inspection AST, not tokenization.
          ...(markdown.mdx1Compat.comments ? [[comment, { ast: true }]] : []),
          ...(docsOptions.remarkPlugins || []),
        ],
      }),
    );
  return processors.get(format);
}

function parseMarkdownCode(source, { filePath = 'document.mdx' } = {}) {
  const format = getFormat({
    filePath,
    frontMatterFormat: matter(source).data.mdx?.format,
    markdownConfigFormat: markdown.format,
  });
  // The native unwrap removes mdx-code-block wrapper lines. Map its remaining
  // lines back to the source before the other, line-preserving compatibility
  // transforms so compiler diagnostics still name the authored line.
  const originalLines = source.split(/\r?\n/);
  let cursor = 0;
  const sourceLines = unwrapMdxCodeBlocks(source)
    .split(/\r?\n/)
    .map((line) => {
      while (cursor < originalLines.length && originalLines[cursor] !== line)
        cursor++;
      if (cursor === originalLines.length)
        throw new Error(`Cannot map Markdown source lines in ${filePath}`);
      return ++cursor;
    });
  const parsedSource = preprocess({
    fileContent: source,
    filePath,
    markdownConfig: markdown,
    admonitions: docsOptions.admonitions ?? true,
  });
  const lines = parsedSource.split(/\r?\n/);
  if (lines.length !== sourceLines.length)
    throw new Error(
      `Markdown preprocessing changed line counts in ${filePath}`,
    );
  let tree;
  try {
    tree = processor(format).parse({ value: parsedSource, path: filePath });
  } catch (error) {
    throw new Error(
      `Cannot parse ${format.toUpperCase()} ${filePath}:${sourceLines[(error.line || 1) - 1]}:${error.column || 1}: ${error.message}`,
    );
  }
  const fences = [];
  const markers = [];
  function visit(parent, quoteDepth = 0) {
    const children = parent.children || [];
    let previousMarker;
    for (const node of children) {
      const markerKind =
        node.type === 'comment' &&
        node.commentValue.trim().match(/^docs-typecheck: (skip|v1)$/)?.[1];
      if (markerKind) {
        previousMarker = {
          kind: markerKind,
          start: node.position.start.offset,
          endLine: node.position.end.line,
          line: sourceLines[node.position.start.line - 1],
          associated: false,
        };
        markers.push(previousMarker);
        continue;
      }
      if (node.type === 'code') {
        const { start, end } = node.position;
        const opening = parsedSource
          .slice(start.offset)
          .match(/^(`{3,}|~{3,})/);
        let closingLine = lines[end.line - 1];
        for (let depth = 0; depth < quoteDepth; depth++)
          closingLine = closingLine.replace(/^[ \t]*>[ \t]?/, '');
        const closed =
          !opening ||
          (end.line > start.line &&
            new RegExp(
              `^[ \\t]*${opening[1][0]}{${opening[1].length},}[ \\t]*$`,
            ).test(closingLine));
        const marker =
          previousMarker?.endLine === start.line - 1
            ? previousMarker
            : undefined;
        if (marker) marker.associated = true;
        fences.push({
          info: [node.lang, node.meta].filter(Boolean).join(' '),
          fenceLine: sourceLines[start.line - 1],
          annotation: marker
            ? `<!-- docs-typecheck: ${marker.kind} -->`
            : undefined,
          code: node.value,
          rawCode: `${node.value}\n`,
          sourceLines: node.value
            .split('\n')
            .map((_, index) => sourceLines[start.line + index]),
          closed,
          start: start.offset,
          end: end.offset,
        });
      }
      visit(node, quoteDepth + (node.type === 'blockquote' ? 1 : 0));
      previousMarker = undefined;
    }
  }
  visit(tree);
  return { fences, markers, source: parsedSource };
}

function readCodeFences(source, options) {
  return parseMarkdownCode(source, options).fences;
}

const INTUITION_IMPORT_PATTERN =
  /(?:import|require)\b[\s\S]*?['"]@0xintuition\//;

module.exports = {
  readCodeFences,
  parseMarkdownCode,
  INTUITION_IMPORT_PATTERN,
};
