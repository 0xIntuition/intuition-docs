#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { walkFiles } = require('./lib/docs-tree');
const { versions } = require('../docs-versions.config');
const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
];
const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function operationsFrom(schema) {
  if (!schema.openapi || !schema.paths || typeof schema.paths !== 'object')
    throw new Error('Malformed vendored Core OpenAPI');
  return Object.entries(schema.paths).flatMap(([route, methods]) =>
    HTTP_METHODS.filter((method) => methods[method]).map((method) => ({
      method: method.toUpperCase(),
      path: route,
      pattern: new RegExp(
        `^${route
          .split(/(\{[^}]+\})/)
          .map((part) => (part.startsWith('{') ? '[^/]+' : escape(part)))
          .join('')}/?$`,
      ),
    })),
  );
}
function requestPath(url) {
  return url
    .replace(/\$\{[^}]+\}/g, '{parameter}')
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/^\{parameter\}(?=\/)/, '')
    .split(/[?#]/)[0];
}
function checkRequest(request, operations) {
  const pathname = requestPath(request.url);
  if (
    !operations.some(
      (operation) =>
        operation.method === request.method && operation.pattern.test(pathname),
    )
  )
    return `${request.file}:${request.line}: Unsupported Core operation ${request.method} ${pathname}`;
}
function curlRequests(source, file) {
  const requests = [];
  for (const match of source.matchAll(/\bcurl\b(?:\\\r?\n|[^\r\n])*/g)) {
    const command = match[0].replace(/\\\r?\n/g, ' ');
    // Resolve only the documented local Query API. Shell placeholders may
    // represent path parameters, never a new unverified route.
    const urls = [
      ...command.matchAll(
        /https?:\/\/(?:localhost|127\.0\.0\.1):3000(?:\/[^\s"'`\\]*)?/g,
      ),
    ];
    for (const found of urls) {
      const explicit = command.match(
        /(?:-X\s*|--request(?:=|\s+))["']?([A-Za-z]+)/,
      )?.[1];
      let method = explicit?.toUpperCase() || 'GET';
      if (!explicit && /(?:^|\s)(?:-I|--head)(?:\s|$)/.test(command))
        method = 'HEAD';
      if (
        !explicit &&
        /(?:^|\s)(?:-d\b|--data(?:-raw|-binary|-urlencode)?\b|--json\b|--form\b|-F\b)/.test(
          command,
        )
      )
        method = 'POST';
      if (!explicit && /(?:^|\s)(?:-G|--get)(?:\s|$)/.test(command))
        method = 'GET';
      requests.push({
        method,
        url: found[0],
        file,
        line: source.slice(0, match.index).split('\n').length,
      });
    }
  }
  return requests;
}

// Static extraction deliberately fails on dynamic fetch routes/options instead
// of declaring an unchecked request valid. No service or network is contacted.
function projectRequests(source, file) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const bindings = new Map();
  const requests = [];
  const errors = [];
  const collect = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      if (bindings.has(node.name.text)) bindings.set(node.name.text, null);
      else bindings.set(node.name.text, node.initializer);
    }
    ts.forEachChild(node, collect);
  };
  collect(ast);
  const evaluate = (node, seen = new Set()) => {
    if (!node) return undefined;
    if (ts.isStringLiteralLike(node)) return node.text;
    if (ts.isIdentifier(node) && !seen.has(node.text))
      return evaluate(bindings.get(node.text), new Set([...seen, node.text]));
    if (
      ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node)
    )
      return evaluate(node.expression, seen);
    if (ts.isTemplateExpression(node))
      return (
        node.head.text +
        node.templateSpans
          .map(
            (span) =>
              (evaluate(span.expression, seen) ?? '{parameter}') +
              span.literal.text,
          )
          .join('')
      );
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.PlusToken
    ) {
      const left = evaluate(node.left, seen),
        right = evaluate(node.right, seen);
      if (left !== undefined && right !== undefined) return left + right;
    }
    if (ts.isNewExpression(node) && node.expression.getText(ast) === 'URL') {
      const route = evaluate(node.arguments?.[0], seen);
      const base = evaluate(node.arguments?.[1], seen);
      if (route?.startsWith('/'))
        return (base?.replace(/\/$/, '') || '{parameter}') + route;
      return route;
    }
    return undefined;
  };
  const optionsNode = (node, seen = new Set()) => {
    if (node && ts.isIdentifier(node) && !seen.has(node.text))
      return optionsNode(
        bindings.get(node.text),
        new Set([...seen, node.text]),
      );
    return node;
  };
  const visit = (node) => {
    if (
      ts.isCallExpression(node) &&
      /^(?:globalThis\.)?fetch$/.test(node.expression.getText(ast))
    ) {
      const line =
        ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
      const url = evaluate(node.arguments[0]);
      let method = 'GET';
      const options = optionsNode(node.arguments[1]);
      if (options) {
        if (
          !ts.isObjectLiteralExpression(options) ||
          options.properties.some(
            (property) =>
              ts.isSpreadAssignment(property) ||
              ts.isComputedPropertyName(property.name),
          )
        )
          errors.push(
            `${file}:${line}: Core fetch options must be statically inspectable`,
          );
        else {
          const property = options.properties.find(
            (entry) =>
              entry.name?.getText(ast).replace(/["']/g, '') === 'method',
          );
          if (property) {
            const value = ts.isPropertyAssignment(property)
              ? evaluate(property.initializer)
              : ts.isShorthandPropertyAssignment(property)
                ? evaluate(property.name)
                : undefined;
            if (!value)
              errors.push(
                `${file}:${line}: Core HTTP method must be a static string`,
              );
            else method = value.toUpperCase();
          }
        }
      }
      if (!url || !/^(?:https?:\/\/[^/]+|\{parameter\})?\//.test(url))
        errors.push(
          `${file}:${line}: Core fetch URL must expose a static path`,
        );
      else requests.push({ url, method, file, line });
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return { requests, errors };
}
function validateCoreApiExamples({
  root = path.resolve(__dirname, '..'),
} = {}) {
  const manifest = JSON.parse(
    fs.readFileSync(path.join(root, 'static/intuition-release.json'), 'utf8'),
  );
  if (
    manifest.core?.distribution !== 'source' ||
    !/^[a-f0-9]{40}$/.test(manifest.core.commit || '')
  )
    throw new Error(
      'Core examples require a source-mode manifest with full core.commit',
    );
  const snapshot = path.join(
    root,
    'scripts',
    `core-openapi-${manifest.core.commit}.json`,
  );
  if (!fs.existsSync(snapshot))
    throw new Error(
      `Missing vendored Core OpenAPI: ${path.basename(snapshot)}`,
    );
  const operations = operationsFrom(
    JSON.parse(fs.readFileSync(snapshot, 'utf8')),
  );
  const requests = [];
  const errors = [];
  for (const absolute of walkFiles(
    path.join(root, versions.current.docsDir),
  ).filter((file) => /\.mdx?$/.test(file))) {
    const file = path.relative(root, absolute);
    const source = fs.readFileSync(absolute, 'utf8');
    requests.push(...curlRequests(source, file));
    if (
      /\/api\/iids\//.test(source) &&
      !operations.some(
        (operation) =>
          operation.method === 'GET' &&
          operation.path === '/api/iids/{iid}/atoms',
      )
    )
      errors.push(
        `${file}: IID-to-atoms route is absent from the pinned OpenAPI (M-7)`,
      );
  }
  for (const absolute of walkFiles(
    path.join(root, 'examples/v2/core-query-api/src'),
  ).filter((file) => /\.[cm]?[jt]sx?$/.test(file))) {
    const result = projectRequests(
      fs.readFileSync(absolute, 'utf8'),
      path.relative(root, absolute),
    );
    requests.push(...result.requests);
    errors.push(...result.errors);
  }
  for (const request of requests) {
    const error = checkRequest(request, operations);
    if (error) errors.push(error);
  }
  return {
    errors,
    requests: requests.length,
    operations: operations.length,
    snapshot: path.basename(snapshot),
  };
}
if (require.main === module) {
  try {
    const result = validateCoreApiExamples();
    if (result.errors.length) {
      console.error(result.errors.join('\n'));
      process.exitCode = 1;
    } else
      console.log(
        `Verified ${result.requests} Core requests against ${result.operations} operations in ${result.snapshot}.`,
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
module.exports = {
  operationsFrom,
  curlRequests,
  projectRequests,
  checkRequest,
  validateCoreApiExamples,
};
