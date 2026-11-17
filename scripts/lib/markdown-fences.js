'use strict';

const { createRequire } = require('node:module');
const { createProcessor } = require('@mdx-js/mdx');
const comment = require('@slorber/remark-comment').default;
const frontmatter = require('remark-frontmatter').default;
const yaml = require('js-yaml');
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

// Only YAML is metadata. In particular, never invoke gray-matter's JS engines.
function readFrontMatter(source) {
  const header = source.match(/^\uFEFF?---([^\r\n]*)\r?\n/);
  if (!header) return {};
  if (header[1].trim() && !/^(?:yaml|yml)$/.test(header[1].trim()))
    throw new Error('Only YAML front matter is supported');
  const end = source.slice(header[0].length).search(/^---\s*$/m);
  if (end < 0) throw new Error('Unclosed YAML front matter');
  const value = yaml.load(
    source.slice(header[0].length, header[0].length + end),
    { schema: yaml.JSON_SCHEMA },
  );
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : {};
}

function parseMarkdownCode(source, { filePath = 'document.mdx' } = {}) {
  const format = getFormat({
    filePath,
    frontMatterFormat: readFrontMatter(source).mdx?.format,
    markdownConfigFormat: markdown.format,
  });
  // The native unwrap removes mdx-code-block wrapper lines. Map its remaining
  // lines back to the source before the other, line-preserving compatibility
  // transforms so compiler diagnostics still name the authored line.
  const originalLines = source.split(/\r?\n/);
  const originalOffsets = [0];
  for (const match of source.matchAll(/\n/g))
    originalOffsets.push(match.index + 1);
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
  const examples = [];
  function visit(parent, quoteDepth = 0) {
    const children = parent.children || [];
    let previousMarker;
    let activeExample;
    for (const node of children) {
      if (node.type === 'mdxTextExpression' && /example:/.test(node.value))
        throw new Error(
          `Example markers must be standalone blocks in ${filePath}`,
        );
      const expression =
        node.type === 'mdxFlowExpression' ? node.value.trim() : '';
      if (/^\/\*\s*example:/.test(expression)) {
        const start = expression.match(/^\/\* example:start ([^\s]+) \*\/$/);
        const isEnd = expression === '/* example:end */';
        const line = sourceLines[node.position.start.line - 1];
        if (
          (!start && !isEnd) ||
          (start && activeExample) ||
          (isEnd && !activeExample)
        )
          throw new Error(
            `Invalid or nested example marker at ${filePath}:${line}`,
          );
        if (start) activeExample = { reference: start[1], line, fences: [] };
        else {
          if (activeExample.fences.length !== 1)
            throw new Error(
              `Example markers must surround exactly one fence at ${filePath}:${activeExample.line}`,
            );
          examples.push(activeExample);
          activeExample = undefined;
        }
        previousMarker = undefined;
        continue;
      }
      if (activeExample && node.type !== 'code')
        throw new Error(
          `Example markers must contain only one fence in the same container at ${filePath}:${activeExample.line}`,
        );
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
        const closingSourceLine = sourceLines[end.line - 1];
        const bodyStart = originalOffsets[sourceLines[start.line - 1]];
        const bodyEnd = originalOffsets[closingSourceLine - 1];
        const prefix =
          originalLines[closingSourceLine - 1].match(
            /^(.*?)(?:`{3,}|~{3,})/,
          )?.[1] || '';
        const authoredCode = source
          .slice(bodyStart, bodyEnd)
          .split(/(?<=\n)/)
          .map((line) =>
            prefix && line.startsWith(prefix)
              ? line.slice(prefix.length)
              : line,
          )
          .join('');
        const fence = {
          info: [node.lang, node.meta].filter(Boolean).join(' '),
          fenceLine: sourceLines[start.line - 1],
          annotationMarker: marker,
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
          endLine: closingSourceLine,
          bodyStart,
          bodyEnd,
          prefix,
          authoredCode,
          example: activeExample,
        };
        fences.push(fence);
        if (activeExample) activeExample.fences.push(fence);
      }
      visit(node, quoteDepth + (node.type === 'blockquote' ? 1 : 0));
      previousMarker = undefined;
    }
    if (activeExample)
      throw new Error(
        `Unclosed example marker at ${filePath}:${activeExample.line}`,
      );
  }
  visit(tree);
  return { fences, markers, examples, source: parsedSource, tree };
}

function readCodeFences(source, options) {
  return parseMarkdownCode(source, options).fences;
}

const INTUITION_IMPORT_PATTERN =
  /(?:import|require)\b[\s\S]*?['"]@0xintuition\//;

module.exports = {
  readCodeFences,
  readFrontMatter,
  parseMarkdownCode,
  INTUITION_IMPORT_PATTERN,
};
