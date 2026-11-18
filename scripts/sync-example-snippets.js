#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { versions } = require('../docs-versions.config');
const { parseMarkdownCode, readFrontMatter } = require('./lib/markdown-fences');

const ROOT = path.resolve(__dirname, '..');
const EXECUTABLE = /^(?:ts|typescript|tsx|js|javascript|jsx)(?:\s|$)/i;
const MIGRATION = `${versions.current.docsDir}/get-started/migrate-from-v1.md`;

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== '..' &&
      !path.isAbsolute(relative))
  );
}

function walk(directory, accept) {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (entry.name === 'node_modules' || entry.name === '.git') return [];
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink())
        throw new Error(`Symlink inputs are not supported: ${file}`);
      return entry.isDirectory()
        ? walk(file, accept)
        : accept(file)
          ? [file]
          : [];
    });
}

function readRegion(root, reference) {
  const match = reference.match(
    /^(examples\/v2\/[A-Za-z0-9_./-]+\.tsx?)#([A-Za-z][A-Za-z0-9_-]*)$/,
  );
  if (!match || /\.d\.tsx?#/.test(reference))
    throw new Error(`Invalid example source reference: ${reference}`);
  const [, relative, name] = match;
  if (
    relative
      .split('/')
      .some(
        (part) =>
          part === '..' || part === '.' || part === 'node_modules' || !part,
      )
  )
    throw new Error(`Unsafe example source path: ${relative}`);
  const file = path.resolve(root, relative);
  const base = path.resolve(root, 'examples/v2');
  if (!inside(base, file) || !fs.existsSync(file))
    throw new Error(`Missing or unsafe example source: ${relative}`);
  if (!inside(fs.realpathSync(base), fs.realpathSync(file)))
    throw new Error(`Example source escapes examples/v2: ${relative}`);
  let cursor = root;
  for (const part of relative.split('/')) {
    cursor = path.join(cursor, part);
    if (fs.lstatSync(cursor).isSymbolicLink())
      throw new Error(`Symlink example source: ${relative}`);
  }
  const source = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(
    relative,
    source,
    ts.ScriptTarget.Latest,
    true,
    relative.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const lineComments = new Set();
  const remember = (position, end, kind) => {
    if (kind === ts.SyntaxKind.SingleLineCommentTrivia)
      lineComments.add(position);
  };
  function visit(node) {
    ts.forEachLeadingCommentRange(source, node.pos, remember);
    ts.forEachTrailingCommentRange(source, node.end, remember);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  const regions = new Map();
  let active;
  let offset = 0;
  for (const line of source.match(/[^\n]*\n|[^\n]+$/g) || []) {
    const marker = line.trim().match(/^\/\/ #(region|endregion)(?:\s+(.*))?$/);
    if (marker) {
      if (!lineComments.has(offset + line.indexOf('//')))
        throw new Error(
          `Region marker is not a TypeScript line comment in ${relative}`,
        );
      if (marker[1] === 'region') {
        if (
          active ||
          !/^[A-Za-z][A-Za-z0-9_-]*$/.test(marker[2] || '') ||
          regions.has(marker[2])
        )
          throw new Error(`Invalid, nested or duplicate region in ${relative}`);
        active = { name: marker[2], start: offset + line.length };
      } else {
        if (!active || marker[2])
          throw new Error(`Invalid endregion in ${relative}`);
        regions.set(active.name, source.slice(active.start, offset));
        active = undefined;
      }
    }
    offset += line.length;
  }
  if (active) throw new Error(`Unclosed region in ${relative}`);
  if (!regions.has(name))
    throw new Error(`Missing region ${name} in ${relative}`);
  const code = regions.get(name);
  if (!code.trim() || !code.endsWith('\n'))
    throw new Error(`Empty or unterminated source region: ${reference}`);
  return { code, file, relative };
}

// A generated reference is an API artifact, not a runnable example. This is
// deliberately limited to the generator's exact page allowlist and declarations.
// Exact source regeneration is a separate mandatory phase-exit check.
function isDeclarationOnly(code) {
  const source = ts.createSourceFile(
    'api.d.ts',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  if (source.parseDiagnostics.length || !source.statements.length) return false;
  const literal = (node) => {
    if (
      ts.isStringLiteralLike(node) ||
      ts.isNumericLiteral(node) ||
      ts.isBigIntLiteral(node) ||
      [
        ts.SyntaxKind.TrueKeyword,
        ts.SyntaxKind.FalseKeyword,
        ts.SyntaxKind.NullKeyword,
      ].includes(node.kind)
    )
      return true;
    if (
      ts.isAsExpression(node) ||
      ts.isSatisfiesExpression(node) ||
      ts.isParenthesizedExpression(node)
    )
      return literal(node.expression);
    if (ts.isPrefixUnaryExpression(node))
      return (
        [ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken].includes(
          node.operator,
        ) && literal(node.operand)
      );
    if (ts.isArrayLiteralExpression(node)) return node.elements.every(literal);
    if (ts.isObjectLiteralExpression(node))
      return node.properties.every(
        (property) =>
          ts.isPropertyAssignment(property) &&
          !ts.isComputedPropertyName(property.name) &&
          literal(property.initializer),
      );
    return false;
  };
  const ambient = (node) =>
    node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.DeclareKeyword,
    );
  return source.statements.every((node) => {
    if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node))
      return true;
    if (ts.isFunctionDeclaration(node))
      return (
        !node.body &&
        node.parameters.every((parameter) => !parameter.initializer)
      );
    if (ts.isVariableStatement(node))
      return node.declarationList.declarations.every(
        (decl) =>
          ts.isIdentifier(decl.name) &&
          (ambient(node)
            ? !decl.initializer
            : Boolean(node.declarationList.flags & ts.NodeFlags.Const) &&
              Boolean(decl.initializer) &&
              literal(decl.initializer)),
      );
    if (ts.isClassDeclaration(node))
      return (
        ambient(node) &&
        node.members.every((member) => !member.body && !member.initializer)
      );
    if (ts.isEnumDeclaration(node))
      return (
        ambient(node) &&
        node.members.every(
          (member) =>
            !member.initializer ||
            ts.isStringLiteral(member.initializer) ||
            ts.isNumericLiteral(member.initializer),
        )
      );
    if (ts.isImportDeclaration(node))
      return Boolean(node.importClause?.isTypeOnly);
    if (ts.isExportDeclaration(node)) return node.isTypeOnly;
    return false;
  });
}

function isGeneratedDeclaration(relative, source, fence) {
  const generatorPath = path.join(__dirname, 'generate-package-reference.js');
  if (!fs.existsSync(generatorPath)) return false;
  const { SDK_REFERENCE_FILES, SDK_REFERENCE_GENERATOR } = require(
    generatorPath,
  );
  return (
    SDK_REFERENCE_FILES?.includes(relative) &&
    readFrontMatter(source).generated_by === SDK_REFERENCE_GENERATOR &&
    isDeclarationOnly(fence.code)
  );
}

function validateAnnotations(relative, parsed) {
  for (const marker of parsed.markers) {
    if (!marker.associated)
      throw new Error(
        `Typecheck marker must immediately precede a fence in the same container at ${relative}:${marker.line}`,
      );
    if (marker.kind === 'v1' && relative !== MIGRATION)
      throw new Error(
        `V1 markers are allowed only in the migration guide: ${relative}:${marker.line}`,
      );
    if (marker.kind === 'v1') {
      const associated = parsed.fences.find(
        (candidate) => candidate.annotationMarker === marker,
      );
      if (
        !associated ||
        !/^(?:ts|typescript|tsx)(?:\s|$)/i.test(associated.info) ||
        associated.example
      )
        throw new Error(
          `V1 markers must identify an isolated TypeScript fence: ${relative}:${marker.line}`,
        );
    }
  }
}

function syncSource(relative, source, { root = ROOT, write = false } = {}) {
  const parsed = parseMarkdownCode(source, { filePath: relative });
  validateAnnotations(relative, parsed);
  const replacements = [];
  let count = 0;
  for (const fence of parsed.fences) {
    if (!EXECUTABLE.test(fence.info)) {
      if (fence.example)
        throw new Error(
          `Example markers require a TypeScript fence at ${relative}:${fence.fenceLine}`,
        );
      continue;
    }
    if (!fence.closed)
      throw new Error(
        `Unclosed executable fence at ${relative}:${fence.fenceLine}`,
      );
    if (fence.annotation === '<!-- docs-typecheck: v1 -->') continue;
    if (!fence.example) {
      if (isGeneratedDeclaration(relative, source, fence)) continue;
      throw new Error(
        `Unsynced executable example at ${relative}:${fence.fenceLine}; use examples/v2 source markers`,
      );
    }
    if (!/^(?:ts|typescript|tsx)(?:\s|$)/i.test(fence.info))
      throw new Error(
        `Synced JavaScript must be authored as typed TypeScript at ${relative}:${fence.fenceLine}`,
      );
    if (fence.annotation)
      throw new Error(
        `Synced V2 examples cannot skip typechecking at ${relative}:${fence.fenceLine}`,
      );
    const region = readRegion(root, fence.example.reference);
    if (
      (path.extname(region.file) === '.tsx') !==
      /^tsx(?:\s|$)/i.test(fence.info)
    )
      throw new Error(
        `Fence language does not match source extension: ${fence.example.reference}`,
      );
    count++;
    if (fence.authoredCode !== region.code) {
      if (!write)
        throw new Error(
          `Example snippet drift at ${relative}:${fence.fenceLine} (${fence.example.reference})`,
        );
      replacements.push({
        start: fence.bodyStart,
        end: fence.bodyEnd,
        value: region.code
          .split(/(?<=\n)/)
          .map((line) => fence.prefix + line)
          .join(''),
      });
    }
  }
  let output = source;
  for (const replacement of replacements.reverse())
    output =
      output.slice(0, replacement.start) +
      replacement.value +
      output.slice(replacement.end);
  return { output, count, parsed };
}

function main(argv = process.argv.slice(2), root = ROOT) {
  let write = false;
  const files = [];
  let mode;
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--write' || arg === '--check') {
      if (mode && mode !== arg) throw new Error('Choose --check or --write');
      mode = arg;
      write = arg === '--write';
    } else if (arg === '--file' && argv[index + 1]) files.push(argv[++index]);
    else throw new Error(`Unknown or incomplete argument: ${arg}`);
  }
  const docsRoot = path.join(root, versions.current.docsDir);
  const selected = files.length
    ? files.map((file) => path.resolve(root, file))
    : walk(docsRoot, (file) => /\.mdx?$/.test(file));
  let count = 0;
  for (const file of selected) {
    if (
      !inside(docsRoot, file) ||
      !inside(fs.realpathSync(docsRoot), fs.realpathSync(file))
    )
      throw new Error(`Not a V2 documentation path: ${file}`);
    const source = fs.readFileSync(file, 'utf8');
    const result = syncSource(
      path.relative(root, file).split(path.sep).join('/'),
      source,
      { root, write },
    );
    count += result.count;
    if (write && result.output !== source)
      fs.writeFileSync(file, result.output);
  }
  console.log(
    `Example snippets ${write ? 'synced' : 'verified'}: ${count} regions across ${selected.length} V2 pages.`,
  );
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}
module.exports = {
  EXECUTABLE,
  MIGRATION,
  inside,
  walk,
  readRegion,
  isDeclarationOnly,
  isGeneratedDeclaration,
  validateAnnotations,
  syncSource,
  main,
};
